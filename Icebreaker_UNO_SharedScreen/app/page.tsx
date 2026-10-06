'use client';
import {useEffect,useState} from 'react';
import {Check,Info,LogIn,LogOut,MessageCircleQuestion,Pause,Play,Shuffle,UserRound,X} from 'lucide-react';
import {QUESTIONS,RULES} from '../lib/game';

type Seat={name:string;email:string;guest:boolean};
const SEATS=[{pos:'tl',label:'Seat 1'},{pos:'tr',label:'Seat 2'},{pos:'bl',label:'Seat 3'},{pos:'br',label:'Seat 4'}];
const ruleHelp:Record<string,string>={'Normal UNO':'Play normal UNO with your real cards.','Hidden cards':'Do not look at your own cards. Ask the table to help you choose what to play.','Optional questions':'Ask someone a question if you want to talk. Asking and answering are both optional.','Give a card':'You may give one of your cards to another player.','Swap cards':'You may swap cards with another player if you both agree.'};
const steps=[
  ['Take a corner','Up to four players share this screen. Each corner is one seat.'],
  ['Sign in or play as a Guest','Enter your email and preferred name, or continue as a Guest without sharing anything.'],
  ['Play UNO with real cards','The circle in the middle shows the current rule. Anyone can pause the game or switch to a random rule.'],
  ['Draw a question when you like','Each corner has a button that shows a question from the question bank. Answering is always optional.'],
];

function Brand(){return <div className="brand"><span className="brandmark">iB</span><span>Icebreaker <b>UNO</b></span></div>}

function Intro({onConfirm}:{onConfirm:()=>void}){return <main className="intro"><Brand/><section className="intro-card"><span className="eyebrow">Before you start</span><h1>How Icebreaker UNO works</h1><ol className="intro-steps">{steps.map(([title,text],i)=><li key={title}><b>{i+1}</b><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol><button className="primary intro-confirm" onClick={onConfirm}><Check size={18}/>Got it, let&apos;s start</button></section></main>}

function Corner({pos,label,seat,onSit,onLeave,onAnswer,flash}:{pos:string;label:string;seat:Seat|null;onSit:(s:Seat)=>void;onLeave:()=>void;onAnswer:(tag:string)=>void;flash:{key:number;text:string}|null}){
  const [signingIn,setSigningIn]=useState(false),[email,setEmail]=useState(''),[name,setName]=useState(''),[question,setQuestion]=useState<number|null>(null),[picked,setPicked]=useState<number|null>(null);
  function draw(){let next=Math.floor(Math.random()*QUESTIONS.length);if(QUESTIONS.length>1)while(next===question)next=Math.floor(Math.random()*QUESTIONS.length);setQuestion(next);setPicked(null)}
  function leave(){setQuestion(null);setPicked(null);setEmail('');setName('');onLeave()}
  const q=question===null?null:QUESTIONS[question];
  return <div className={`corner corner-${pos}`}><div key={flash?.key??'idle'} className={`corner-content ${flash?'flashing':''}`}>{flash&&<div className="flash-banner" role="status">{flash.text}</div>}
    {!seat?(signingIn?<form className="seat-form" onSubmit={e=>{e.preventDefault();onSit({name:name.trim(),email:email.trim(),guest:false});setSigningIn(false)}}>
      <span className="seat-label">{label} · Sign in</span>
      <label>Email<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
      <label>Preferred name<input required maxLength={20} value={name} onChange={e=>setName(e.target.value)} placeholder="What should we call you?"/></label>
      <div className="seat-actions"><button className="primary" type="submit" disabled={!name.trim()||!email.trim()}>Sign in</button><button className="ghost" type="button" onClick={()=>setSigningIn(false)}>Cancel</button></div>
    </form>:<div className="seat-empty">
      <span className="seat-label">{label}</span><p>This seat is free.</p>
      <div className="seat-actions"><button className="primary" onClick={()=>setSigningIn(true)}><LogIn size={15}/>Sign in</button><button className="ghost" onClick={()=>onSit({name:'Guest',email:'',guest:true})}>Continue as Guest</button></div>
    </div>):<>
      <div className="seat-player"><span className="seat-avatar">{seat.guest?<UserRound size={18}/>:seat.name[0].toUpperCase()}</span><div><strong>{seat.name}</strong><span>{seat.guest?`Guest · ${label}`:`Signed in · ${label}`}</span></div><button className="seat-leave" title="Leave this seat" aria-label="Leave this seat" onClick={leave}><LogOut size={14}/></button></div>
      <button className="corner-draw" type="button" onClick={draw}><MessageCircleQuestion size={15}/>{q?'Draw another':'Draw a question'}</button>
      {q&&<div className="corner-question"><button className="corner-question-close" type="button" aria-label="Close question" onClick={()=>setQuestion(null)}><X size={14}/></button><span className="question-badge">Question</span><p>{q.text}</p><div className="question-options">{q.options.map((o,idx)=><button key={idx} type="button" className={picked===idx?'selected':''} aria-pressed={picked===idx} onClick={()=>{setPicked(idx);onAnswer(q.tags[idx])}}><span>{String.fromCharCode(65+idx)}</span>{o}</button>)}</div></div>}
    </>}
  </div></div>;
}

export default function Home(){
  const [started,setStarted]=useState(false),[seats,setSeats]=useState<(Seat|null)[]>([null,null,null,null]),[paused,setPaused]=useState(false),[rule,setRule]=useState(RULES[0]),[answers,setAnswers]=useState<(string|null)[]>([null,null,null,null]),[flash,setFlash]=useState<{seats:number[];key:number;text:string}|null>(null);
  useEffect(()=>{if(!flash)return;const timer=setTimeout(()=>setFlash(null),3600);return()=>clearTimeout(timer)},[flash]);
  function answer(i:number,tag:string){const matched=answers.flatMap((a,j)=>j!==i&&seats[j]&&a===tag?[j]:[]);setAnswers(all=>all.map((x,j)=>j===i?tag:x));if(matched.length){const names=[i,...matched].map(j=>seats[j]!.guest?`Guest (Seat ${j+1})`:seats[j]!.name);setFlash(prev=>({seats:[i,...matched],key:(prev?.key??0)+1,text:`Same choice: ${names.join(' & ')}`}))}}
  if(!started)return <Intro onConfirm={()=>setStarted(true)}/>;
  const setSeat=(i:number,s:Seat|null)=>{setSeats(all=>all.map((x,j)=>j===i?s:x));if(!s)setAnswers(all=>all.map((x,j)=>j===i?null:x))};
  function randomRule(){const others=RULES.filter(r=>r!==rule);setRule(others[Math.floor(Math.random()*others.length)])}
  return <main className="table-page">
    <header className="table-header"><Brand/><button className="outline" onClick={()=>setStarted(false)}><Info size={16}/>Rules</button></header>
    <div className="radial-board">
      {SEATS.map((s,i)=><Corner key={s.pos} pos={s.pos} label={s.label} seat={seats[i]} onSit={seat=>setSeat(i,seat)} onLeave={()=>setSeat(i,null)} onAnswer={tag=>answer(i,tag)} flash={flash?.seats.includes(i)?flash:null}/>)}
      <div className={`center-circle ${paused?'paused':''}`}>
        <span className={`game-state ${paused?'paused':'live'}`}><i/>{paused?'Paused':'Playing'}</span>
        {paused?<div className="center-idle"><Pause size={30}/><h2>Game paused</h2><p>Take a moment to talk. Resume when everyone is ready.</p></div>
        :<div className="center-idle"><span className="uno-label">UNO</span><span className="rule-name">{rule}</span><p>{ruleHelp[rule]}</p></div>}
        <div className="center-actions">
          <button className="primary" onClick={()=>setPaused(!paused)}>{paused?<><Play size={16}/>Resume</>:<><Pause size={16}/>Pause</>}</button>
          <button className="outline-light" onClick={randomRule} disabled={paused}><Shuffle size={16}/>Random rule</button>
        </div>
        <small className="seat-count">{seats.filter(Boolean).length} / 4 seats taken</small>
      </div>
    </div>
  </main>;
}
