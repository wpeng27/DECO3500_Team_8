// Integration checks against a running LOCAL server; uses separate synthetic rooms.
// Run: node scripts/check-mobile.mjs http://localhost:5173
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';

const base=new URL(process.argv[2]??'http://localhost:5173');
assert(['localhost','127.0.0.1','[::1]'].includes(base.hostname),'Use a local test server.');
const id=()=>randomBytes(16).toString('hex');
const code=id(),token=id();
const colours=['#7565F6','#11A78D','#E5A037','#E35675'];
const players=colours.map((colour,index)=>({id:id(),seatIndex:index,name:`Test ${index+1}`,colour,baseColour:colour,answered:0,complete:false,question:null}));
let snapshot={status:'playing',rule:'Normal UNO',timeLeft:600,players};
async function post(body,expected=200,headers={}){
  const response=await fetch(new URL('/api/mobile',base),{method:'POST',headers:{'Content-Type':'application/json',Origin:base.origin,...headers},body:JSON.stringify(body)});
  const raw=await response.text();
  let data;
  try{data=JSON.parse(raw);}catch{data={error:raw};}
  assert.equal(response.status,expected,JSON.stringify(data));
  return data;
}
async function read(roomCode=code){
  const response=await fetch(new URL(`/api/mobile?room=${roomCode}`,base));
  assert.equal(response.status,200);
  assert.equal(response.headers.get('cache-control'),'no-store');
  return response.json();
}
await post({kind:'create',code,token,snapshot});
await post({kind:'create',code,token,snapshot}); // retry creation after a lost response
assert.deepEqual((await read()).snapshot,snapshot);
await post({kind:'sync',code,token:id(),snapshot,receipt:null},403);
await post({kind:'create',code,token:id(),snapshot},403);
await post({kind:'sync',code,token,snapshot,receipt:null},403,{Origin:'http://unrelated.example'});
await post({kind:'sync',code,token,snapshot:{...snapshot,players:[{...players[0],email:'private@example.test'}]},receipt:null},400);
console.log('PASS: room creation, PC authorization, same-origin writes, and email exclusion');

const otherCode=id();
await post({kind:'create',code:otherCode,token:id(),snapshot:{...snapshot,players:[]}});
const commands=players.map(player=>({id:id(),playerId:player.id,kind:'draw'}));
await Promise.all(commands.map(command=>post({kind:'command',code,command})));
await post({kind:'command',code,command:commands[0]});
await post({kind:'command',code:otherCode,command:commands[0]},409);
assert.equal((await read(otherCode)).snapshot.players.length,0);
let reply=await post({kind:'sync',code,token,snapshot,receipt:null});
const received=new Set();
while(reply.command){
  assert(!received.has(reply.command.id),'Duplicate action was delivered after acknowledgment.');
  received.add(reply.command.id);
  snapshot={...snapshot,players:snapshot.players.map(player=>player.id===reply.command.playerId?{...player,question:{id:id(),index:0}}:player)};
  reply=await post({kind:'sync',code,token,snapshot,receipt:{id:reply.command.id,error:null}});
}
assert.deepEqual([...received].sort(),commands.map(command=>command.id).sort());
await post({kind:'command',code,command:commands[0]});
assert.equal((await post({kind:'sync',code,token,snapshot,receipt:null})).command,null);
const publicRoom=await read();
assert.equal(publicRoom.snapshot.players.filter(player=>player.question).length,4);
assert.equal(publicRoom.receipts.length,4);
assert.equal(publicRoom.online,true);
assert.deepEqual(Object.keys(publicRoom).sort(),['online','receipts','snapshot']);
console.log('PASS: concurrent phones, isolated tables, retry deduplication, and synchronized questions');

const match={id:id(),text:'Answer match: Test 1 & Test 2 · colours moved closer'};
snapshot={...snapshot,players:snapshot.players.map((player,index)=>({...player,match:index<2?match:null}))};
await post({kind:'sync',code,token,snapshot,receipt:null});
const matchedRoom=await read();
assert.deepEqual(matchedRoom.snapshot.players.slice(0,2).map(player=>player.match),[match,match]);
assert.equal(matchedRoom.snapshot.players[2].match,null);
assert.equal((await read()).snapshot.players[0].match.id,match.id);
console.log('PASS: match events reach both matching players with a stable notification ID');

const question=snapshot.players[0].question;
await post({kind:'command',code,command:{id:id(),playerId:players[0].id,kind:'answer',questionId:question.id}},400);
await post({kind:'command',code,command:{id:id(),playerId:players[0].id,kind:'skip'}},400);
snapshot={...snapshot,status:'ended',players:snapshot.players.map((player,index)=>({...player,colour:index<2?'#6471bd':player.colour,question:null}))};
await post({kind:'sync',code,token,snapshot,receipt:null});
assert.deepEqual((await read()).snapshot,snapshot);
snapshot={...snapshot,status:'ready',players:[{...players[0],id:id()}]};
await post({kind:'sync',code,token,snapshot,receipt:null});
await post({kind:'command',code,command:{id:id(),playerId:players[0].id,kind:'draw'}},409);
assert.equal((await read()).snapshot.players.length,1);
console.log('PASS: invalid actions, final colours, new rounds, and departed players');

// Mobile sign-in: two phones competing for one seat, with private details only sent to the PC.
const joinCode=id(),joinToken=id();
const emptySeats=colours.map((baseColour,seatIndex)=>({seatIndex,label:`Seat ${seatIndex+1}`,baseColour,revision:0}));
let joinSnapshot={status:'ready',rule:'Normal UNO',timeLeft:600,players:[],availableSeats:emptySeats};
await post({kind:'create',code:joinCode,token:joinToken,snapshot:joinSnapshot});
const joins=['Alex','Sam'].map(name=>({id:id(),kind:'join',seatIndex:0,seatRevision:0,identity:{guest:false,name,email:`${name.toLowerCase()}-private@example.test`}}));
const claims=await Promise.all(joins.map(async command=>{
  const response=await fetch(new URL('/api/mobile',base),{method:'POST',headers:{'Content-Type':'application/json',Origin:base.origin},body:JSON.stringify({kind:'command',code:joinCode,command})});
  return {status:response.status,data:await response.json()};
}));
assert.deepEqual(claims.map(claim=>claim.status).sort(),[200,409]);
const accepted=joins[claims.findIndex(claim=>claim.status===200)];
await post({kind:'command',code:joinCode,command:accepted});
const publicPending=JSON.stringify(await read(joinCode));
for(const command of joins)assert(!publicPending.includes(command.identity.email));
assert(!publicPending.includes('commands'));
await post({kind:'sync',code:joinCode,token:id(),snapshot:joinSnapshot,receipt:null},403);
const hostJoin=await post({kind:'sync',code:joinCode,token:joinToken,snapshot:joinSnapshot,receipt:null});
assert.deepEqual(hostJoin.command,accepted);
const joinedPlayer={...players[0],id:id(),name:accepted.identity.name,question:null};
joinSnapshot={...joinSnapshot,players:[joinedPlayer],availableSeats:emptySeats.slice(1)};
assert.equal((await post({kind:'sync',code:joinCode,token:joinToken,snapshot:joinSnapshot,receipt:{id:accepted.id,error:null}})).command,null);
const afterJoin=await read(joinCode);
assert.equal(afterJoin.snapshot.players[0].name,accepted.identity.name);
assert.equal(afterJoin.snapshot.availableSeats.length,3);
assert(!JSON.stringify(afterJoin).includes(accepted.identity.email));
await post({kind:'command',code:joinCode,command:accepted});
assert.equal((await post({kind:'sync',code:joinCode,token:joinToken,snapshot:joinSnapshot,receipt:null})).command,null);
await post({kind:'command',code:joinCode,command:{...accepted,id:id()}},409);

const guestJoin={id:id(),kind:'join',seatIndex:1,seatRevision:0,identity:{guest:true,name:'Guest',email:''}};
await post({kind:'command',code:joinCode,command:{...guestJoin,identity:{...guestJoin.identity,email:'should-not-be-sent@example.test'}}},400);
await post({kind:'command',code:joinCode,command:guestJoin});
assert.deepEqual((await post({kind:'sync',code:joinCode,token:joinToken,snapshot:joinSnapshot,receipt:null})).command,guestJoin);
joinSnapshot={...joinSnapshot,players:[joinedPlayer,{...players[1],id:id(),name:'Guest (Seat 2)'}],availableSeats:emptySeats.slice(2)};
await post({kind:'sync',code:joinCode,token:joinToken,snapshot:joinSnapshot,receipt:{id:guestJoin.id,error:null}});
assert.equal((await read(joinCode)).snapshot.players.length,2);
joinSnapshot={...joinSnapshot,players:[],availableSeats:emptySeats.map(seat=>({...seat,revision:2}))};
await post({kind:'sync',code:joinCode,token:joinToken,snapshot:joinSnapshot,receipt:null});
await post({kind:'command',code:joinCode,command:{...guestJoin,id:id()}},409);
console.log('PASS: mobile sign-in, guest seating, competing claims, private email delivery and stale joins');

await new Promise(resolve=>setTimeout(resolve,15_200));
assert.equal((await read()).online,false);
await post({kind:'command',code,command:{id:id(),playerId:snapshot.players[0].id,kind:'draw'}},409);
await post({kind:'sync',code,token,snapshot,receipt:null});
assert.equal((await read()).online,true);
console.log('PASS: disconnected host detection and recovery');
