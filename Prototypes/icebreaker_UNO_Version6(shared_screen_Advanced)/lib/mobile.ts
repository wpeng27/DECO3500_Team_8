import {z} from 'zod';

const id=z.string().min(1).max(80);
const colour=z.string().regex(/^#[0-9a-f]{6}$/i);
export const openQuestionSchema=z.object({id,index:z.number().int().min(0).max(99)}).strict();
export type OpenQuestion=z.infer<typeof openQuestionSchema>;
const matchSchema=z.object({id,text:z.string().min(1).max(300)}).strict();
export type MobileMatch=z.infer<typeof matchSchema>;
const availableSeatSchema=z.object({
  seatIndex:z.number().int().min(0).max(31),label:z.string().min(1).max(40),baseColour:colour,
  revision:z.number().int().nonnegative(),
}).strict();
export type MobileAvailableSeat=z.infer<typeof availableSeatSchema>;
// End-of-game results, the same as the player's corner on the PC. Only sent once the game has ended.
const score=z.number().int().min(0).max(100).nullable();
const resultsSchema=z.object({
  overall:score,
  rows:z.array(z.object({
    name:z.string().min(1).max(80),score,shared:z.number().int().min(0).max(99),
    single:z.object({question:z.number().int().min(0).max(99),mine:z.number().int().min(0).max(20),theirs:z.number().int().min(0).max(20)}).strict().nullable(),
  }).strict()).max(31),
}).strict();
export type MobileResults=z.infer<typeof resultsSchema>;
export const mobileIdentitySchema=z.discriminatedUnion('guest',[
  z.object({guest:z.literal(false),name:z.string().trim().min(1).max(20),email:z.string().trim().email().max(254)}).strict(),
  z.object({guest:z.literal(true),name:z.literal('Guest'),email:z.literal('')}).strict(),
]);
export type MobileIdentity=z.infer<typeof mobileIdentitySchema>;
export const mobileSnapshotSchema=z.object({
  status:z.enum(['ready','playing','paused','ended']),
  rule:z.string().max(80),
  timeLeft:z.number().int().min(0).max(600),
  availableSeats:z.array(availableSeatSchema).max(32).optional(),
  players:z.array(z.object({
    id,seatIndex:z.number().int().min(0).max(31),name:z.string().min(1).max(80),
    colour,baseColour:colour,answered:z.number().int().min(0).max(100),
    complete:z.boolean(),question:openQuestionSchema.nullable(),match:matchSchema.nullable().optional(),
    results:resultsSchema.optional(),
  }).strict()).max(32),
}).strict();
export type MobileSnapshot=z.infer<typeof mobileSnapshotSchema>;
export type MobilePlayer=MobileSnapshot['players'][number];
const questionCommandSchema=z.object({
  id,playerId:id,kind:z.enum(['draw','answer','skip']),
  questionId:id.optional(),option:z.number().int().min(0).max(20).optional(),
}).strict().superRefine((command,ctx)=>{
  if(command.kind!=='draw'&&!command.questionId)ctx.addIssue({code:'custom',message:'A question is required.'});
  if(command.kind==='answer'&&command.option===undefined)ctx.addIssue({code:'custom',message:'Choose an answer.'});
});
export type MobileQuestionCommand=z.infer<typeof questionCommandSchema>;
const joinCommandSchema=z.object({
  id,kind:z.literal('join'),seatIndex:z.number().int().min(0).max(31),
  seatRevision:z.number().int().nonnegative(),identity:mobileIdentitySchema,
}).strict();
export const mobileCommandSchema=z.union([questionCommandSchema,joinCommandSchema]);
export type MobileCommand=z.infer<typeof mobileCommandSchema>;
export type CommandReceipt={id:string;error:string|null};
export type MobileRoom={snapshot:MobileSnapshot;online:boolean;receipts:CommandReceipt[]};
export const HOST_TIMEOUT_MS=15_000;
export class MobileRequestError extends Error{
  status:number;
  constructor(message:string,status:number){super(message);this.status=status;}
}

// Validate against the PC's latest state, not the older snapshot a phone saw.
export function mobileCommandError(snapshot:MobileSnapshot,command:MobileCommand):string|null{
  if(command.kind==='join'){
    if(snapshot.status==='ended'||(snapshot.status!=='ready'&&snapshot.timeLeft===0))return 'This round has finished. Wait for a new round on the PC.';
    const seat=snapshot.availableSeats?.find(seat=>seat.seatIndex===command.seatIndex);
    if(!seat||snapshot.players.some(player=>player.seatIndex===command.seatIndex))return 'This seat has been taken. Choose another free seat.';
    if(seat.revision!==command.seatRevision)return 'This seat has changed. Select a free seat again.';
    return null;
  }
  const player=snapshot.players.find(player=>player.id===command.playerId);
  if(!player)return 'This player has left or a new round has started.';
  if((snapshot.status!=='playing'&&snapshot.status!=='paused')||snapshot.timeLeft===0)return 'Questions are only available during the game.';
  if(command.kind==='draw'){
    if(snapshot.status==='paused')return 'The game is paused.';
    if(player.complete)return 'You have answered every question.';
    return null;
  }
  if(!player.question||player.question.id!==command.questionId)return 'This question has already been answered or skipped.';
  return null;
}

// getRandomValues also works on phones using an HTTP LAN address (randomUUID does not).
export function mobileId(){
  return Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');
}

export async function mobileRequest<T>(body:unknown,signal?:AbortSignal):Promise<T>{
  const response=await fetch('/api/mobile',{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),
    signal:signal??AbortSignal.timeout(5000),cache:'no-store',
  });
  const data=await response.json() as {error?:string};
  if(!response.ok)throw new MobileRequestError(data.error||'Cannot reach the table. Retrying…',response.status);
  return data as T;
}
