import {z} from 'zod';
import {database,digest} from '../../../lib/storage';
import {HOST_TIMEOUT_MS,mobileCommandError,mobileCommandSchema,mobileSnapshotSchema} from '../../../lib/mobile';
import type {CommandReceipt,MobileCommand,MobileSnapshot} from '../../../lib/mobile';

export const dynamic='force-dynamic';
const ROOM_LIFETIME=12*60*60*1000;
const key=z.string().regex(/^[a-f0-9]{32}$/);
const receipt=z.object({id:z.string().min(1).max(80),error:z.string().max(200).nullable()}).strict();
const requestSchema=z.discriminatedUnion('kind',[
  z.object({kind:z.literal('create'),code:key,token:key,snapshot:mobileSnapshotSchema}).strict(),
  z.object({kind:z.literal('sync'),code:key,token:key,snapshot:mobileSnapshotSchema,receipt:receipt.nullable()}).strict(),
  z.object({kind:z.literal('command'),code:key,command:mobileCommandSchema}).strict(),
]);
type StoredRoom={snapshot:MobileSnapshot;commands:MobileCommand[];receipts:CommandReceipt[]};
type RoomRow={state:string;host_hash:string;revision:number;updated_at:number;expires_at:number};
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
async function load(code:string){
  return database().prepare('SELECT * FROM mobile_rooms WHERE code = ? AND expires_at > ?').bind(code,Date.now()).first<RoomRow>();
}

export async function GET(request:Request){
  const code=new URL(request.url).searchParams.get('room');
  if(!key.safeParse(code).success)return json({error:'Open the mobile link shown on the PC.'},400);
  try{
    const row=await load(code!);
    if(!row)return json({error:'This table link has expired. Open the new link from the PC.'},404);
    const room:StoredRoom=JSON.parse(row.state);
    return json({snapshot:room.snapshot,receipts:room.receipts,online:Date.now()-row.updated_at<HOST_TIMEOUT_MS});
  }catch{
    return json({error:'Cannot connect to the table. Check the PC and Wi-Fi connection.'},503);
  }
}

export async function POST(request:Request){
  if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Open this page on the same server as the table.'},403);
  const raw=await request.text();
  if(raw.length>24000)return json({error:'Message too large.'},413);
  let input:z.infer<typeof requestSchema>;
  try{input=requestSchema.parse(JSON.parse(raw));}catch{return json({error:'Invalid mobile request.'},400);}
  try{
    const db=database();
    if(input.kind==='create'){
      const now=Date.now();
      await db.prepare('DELETE FROM mobile_rooms WHERE expires_at < ?').bind(now).run();
      const state:StoredRoom={snapshot:input.snapshot,commands:[],receipts:[]};
      const hash=await digest(input.token);
      // Idempotent creation: a lost response never creates a second table.
      await db.prepare('INSERT OR IGNORE INTO mobile_rooms (code, host_hash, state, revision, updated_at, expires_at) VALUES (?, ?, ?, 0, ?, ?)')
        .bind(input.code,hash,JSON.stringify(state),now,now+ROOM_LIFETIME).run();
      const row=await load(input.code);
      if(row?.host_hash!==hash)return json({error:'This table link is already in use.'},403);
      return json({ok:true});
    }
    for(let attempt=0;attempt<8;attempt++){
      const row=await load(input.code);
      if(!row)return json({error:'This table link has expired. Reopen Mobile screens on the PC.'},404);
      const room:StoredRoom=JSON.parse(row.state);
      let updatedAt=row.updated_at;
      if(input.kind==='sync'){
        if(await digest(input.token)!==row.host_hash)return json({error:'Only the PC can update this table.'},403);
        room.snapshot=input.snapshot;
        updatedAt=Date.now();
        if(input.receipt){
          room.commands=room.commands.filter(command=>command.id!==input.receipt!.id);
          room.receipts=[...room.receipts.filter(item=>item.id!==input.receipt!.id),input.receipt].slice(-80);
        }
      }else{
        if(room.commands.some(command=>command.id===input.command.id)||room.receipts.some(item=>item.id===input.command.id))return json({ok:true});
        if(Date.now()-row.updated_at>=HOST_TIMEOUT_MS)return json({error:'The PC is disconnected. Keep its game tab open, then try again.'},409);
        const command=input.command;
        if(command.kind==='join'){
          const error=mobileCommandError(room.snapshot,command);
          if(error)return json({error},409);
          if(room.commands.some(queued=>queued.kind==='join'&&queued.seatIndex===command.seatIndex))return json({error:'Someone is already joining this seat. Choose another free seat.'},409);
        }else if(!room.snapshot.players.some(player=>player.id===command.playerId))return json({error:'This player has left. Choose a current player.'},409);
        if(room.commands.length>=32)return json({error:'The table is busy. Try again in a moment.'},429);
        room.commands.push(input.command);
      }
      // Compare-and-swap protects simultaneous phone submissions and PC updates.
      const result=await db.prepare('UPDATE mobile_rooms SET state = ?, revision = revision + 1, updated_at = ?, expires_at = ? WHERE code = ? AND revision = ?')
        .bind(JSON.stringify(room),updatedAt,updatedAt+ROOM_LIFETIME,input.code,row.revision).run();
      if(result.meta.changes)return json(input.kind==='sync'?{command:room.commands[0]??null}:{ok:true});
    }
    return json({error:'The table changed. Please try again.'},409);
  }catch(error){
    console.error('Mobile connection failed',error);
    return json({error:'Mobile connection unavailable. Check the PC server and run npm run db:migrate:local during setup.'},503);
  }
}
