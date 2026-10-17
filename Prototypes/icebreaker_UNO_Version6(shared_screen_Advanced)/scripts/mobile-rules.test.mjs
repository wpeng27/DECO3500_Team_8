import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mobileCommandError,mobileCommandSchema} from '../lib/mobile.ts';

const player={id:'player',seatIndex:0,name:'Guest',colour:'#7565F6',baseColour:'#7565F6',answered:0,complete:false,question:{id:'question',index:0}};
const snapshot={status:'playing',rule:'Normal UNO',timeLeft:600,players:[player],availableSeats:[{seatIndex:1,label:'Seat 2',baseColour:'#11A78D',revision:2}]};
const draw={id:'request',kind:'draw',playerId:'player'};
const join={id:'join',kind:'join',seatIndex:1,seatRevision:2,identity:{guest:true,name:'Guest',email:''}};

test('paused play blocks drawing but allows the open question to be answered',()=>{
  assert.equal(mobileCommandError(snapshot,draw),null);
  const paused={...snapshot,status:'paused'};
  assert(mobileCommandError(paused,draw));
  assert.equal(mobileCommandError(paused,{...draw,kind:'answer',questionId:'question',option:0}),null);
  assert(mobileCommandError({...snapshot,status:'ended'},draw));
  assert(mobileCommandError({...snapshot,timeLeft:0},draw));
});

test('stale questions and players cannot affect current seats',()=>{
  assert(mobileCommandError(snapshot,{...draw,playerId:'departed'}));
  assert(mobileCommandError(snapshot,{...draw,kind:'answer',questionId:'old-question',option:0}));
  assert(!mobileCommandSchema.safeParse({...draw,kind:'answer',questionId:'question'}).success);
});

test('mobile joins require the current free-seat revision and a live round',()=>{
  assert.equal(mobileCommandError(snapshot,join),null);
  assert(mobileCommandError(snapshot,{...join,seatRevision:1}));
  assert(mobileCommandError(snapshot,{...join,seatIndex:0}));
  assert(mobileCommandError({...snapshot,status:'ended'},join));
  assert(!mobileCommandSchema.safeParse({...join,identity:{...join.identity,email:'private@example.test'}}).success);
});
