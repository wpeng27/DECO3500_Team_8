'use client';

import {useState} from 'react';
import type {CSSProperties} from 'react';
import {LogIn,UserRound} from 'lucide-react';
import type {MobileAvailableSeat,MobileIdentity} from '../lib/mobile';

export function MobileJoin({seats,disabled,onJoin}:{
  seats:MobileAvailableSeat[];disabled:boolean;onJoin:(seat:MobileAvailableSeat,identity:MobileIdentity)=>void;
}){
  const [selected,setSelected]=useState<MobileAvailableSeat|null>(seats[0]??null);
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  // Never silently claim a different seat if someone takes the one being selected.
  const seat=seats.find(seat=>seat.seatIndex===selected?.seatIndex&&seat.revision===selected.revision);

  return <form className="mobile-join-card" onSubmit={event=>{
    event.preventDefault();
    if(seat&&!disabled)onJoin(seat,{name:name.trim(),email:email.trim(),guest:false});
  }}>
    <h2>Take a seat from your phone</h2><p>Choose a free seat, then sign in or join as a guest. You will appear on the shared screen automatically.</p>
    <fieldset disabled={disabled}>
      <legend>Choose a free seat</legend>
      <div className="mobile-seat-choices">{seats.map(item=><button type="button" key={`${item.seatIndex}-${item.revision}`} aria-pressed={seat?.seatIndex===item.seatIndex} style={{'--seat-colour':item.baseColour} as CSSProperties} onClick={()=>setSelected(item)}><i/>{item.label}</button>)}</div>
      {!seat&&<p role="status">Your selected seat is no longer available. Choose a free seat above.</p>}
      <label>Preferred name<input value={name} onChange={event=>setName(event.target.value)} required maxLength={20} autoComplete="given-name" placeholder="What should we call you?"/></label>
      <label>Email<input type="email" inputMode="email" value={email} onChange={event=>setEmail(event.target.value)} required maxLength={254} autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@example.com"/></label>
      <p className="mobile-join-privacy">Your name and email are sent to the PC for the current game session. Your email is not shown to other players. Guest play needs no personal details.</p>
      <button className="primary mobile-join-submit" type="submit" disabled={!seat||!name.trim()||!email.trim()}><LogIn size={18}/>Sign in{seat?` to ${seat.label}`:''}</button>
      <button className="mobile-join-guest" type="button" disabled={!seat} onClick={()=>{if(seat&&!disabled)onJoin(seat,{name:'Guest',email:'',guest:true});}}><UserRound size={18}/>Continue as Guest</button>
    </fieldset>
  </form>;
}
