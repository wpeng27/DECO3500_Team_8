'use client';
import {useEffect,useState} from 'react';
import {Check,Info,LogIn,LogOut,MessageCircleQuestion,Mic,MicOff,Pause,Play,Shuffle,UserRound,X} from 'lucide-react';
import {QUESTIONS,RULES} from '../lib/game';
import {QUIET_RATIO,TALK_RATIO,VOICE_MARGIN_DB,useAmbientSilence,type AmbientStatus} from '../hooks/use-ambient-silence';

type Seat={name:string;email:string;guest:boolean};
const SEATS=[{pos:'tl',label:'Seat 1'},{pos:'tr',label:'Seat 2'},{pos:'bl',label:'Seat 3'},{pos:'br',label:'Seat 4'}];
const ruleHelp:Record<string,string>={'Normal UNO':'Play normal UNO with your real cards.','Hidden cards':'Do not look at your own cards. Ask the table to help you choose what to play.','Optional questions':'Ask someone a question if you want to talk. Asking and answering are both optional.','Give a card':'You may give one of your cards to another player.','Swap cards':'You may swap cards with another player if you both agree.'};
const steps=[
  ['Take a corner','Up to four players share this screen. Each corner is one seat.'],
  ['Sign in or play as a Guest','Enter your email and preferred name, or continue as a Guest without sharing anything.'],
  ['Play UNO with real cards','The circle in the middle shows the current rule. Anyone can pause the game or switch to a random rule.'],
  ['Draw a question when you like','Each corner has a button that shows a question from the question bank. Answering is always optional.'],
  ['Optional quiet detector','Turn on the microphone in the middle circle and the screen will suggest a question when the table goes quiet. Nothing is recorded.'],
];
const ambientNote:Record<AmbientStatus,string>={off:'',starting:'Waiting for microphone access…',calibrating:'Measuring background noise…',listening:'Quiet detector on · nothing is recorded',denied:'Microphone access was blocked',unsupported:'Microphone needs HTTPS or localhost',error:'Could not start the microphone'};

// Live numbers from the quiet detector, for tuning. Only shown when the URL has ?debug.
function AmbientDebugPanel({ambient,micOn,lullAfterMs}:{ambient:ReturnType<typeof useAmbientSilence>;micOn:boolean;lullAfterMs:number}){
  const d=ambient.debug,fmt=(db:number|null|undefined)=>db==null?'–':`${db.toFixed(1)} dB`;
  return <aside className="ambient-debug" aria-label="Quiet detector debug">
    <strong>Quiet detector debug</strong>
    <dl>
      <dt>Status</dt><dd>{micOn?ambient.status:'off (tap the mic)'}</dd>
      <dt>Volume</dt><dd>{fmt(d?.db)}</dd>
      <dt>Noise floor</dt><dd>{d&&d.floor===null?'measuring…':fmt(d?.floor)}</dd>
      <dt>Voice above</dt><dd>{d?.floor==null?'–':`${fmt(d.floor+VOICE_MARGIN_DB)} (floor+${VOICE_MARGIN_DB})`}</dd>
      <dt>Talking now</dt><dd><i className={d?.talking?'on':''}/>{d?.talking?'yes':'no'}</dd>
      <dt>Talk ratio</dt><dd>{d?Math.round(d.ratio*100):0}% <small>(quiet ≤{QUIET_RATIO*100}%, reset ≥{TALK_RATIO*100}%)</small></dd>
      <dt>Quiet for</dt><dd>{(ambient.quietMs/1000).toFixed(1)}s / {lullAfterMs/1000}s{ambient.isLull?' · nudge on':''}</dd>
    </dl>
    <div className="ambient-debug-bar" aria-hidden="true"><i style={{width:`${Math.min(100,ambient.quietMs/lullAfterMs*100)}%`}}/></div>
  </aside>;
}

function Brand(){return <div className="brand"><span className="brandmark">iB</span><span>Icebreaker <b>UNO</b></span></div>}

function Intro({onConfirm}:{onConfirm:()=>void}){return <main className="intro"><Brand/><section className="intro-card"><span className="eyebrow">Before you start</span><h1>How Icebreaker UNO works</h1><ol className="intro-steps">{steps.map(([title,text],i)=><li key={title}><b>{i+1}</b><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol><button className="primary intro-confirm" onClick={onConfirm}><Check size={18}/>Got it, let&apos;s start</button></section></main>}

function Corner({pos,label,seat,onSit,onLeave,onAnswer,onDraw,nudge,flash}:{pos:string;label:string;seat:Seat|null;onSit:(s:Seat)=>void;onLeave:()=>void;onAnswer:(tag:string)=>void;onDraw:()=>void;nudge:boolean;flash:{key:number;text:string}|null}){
  const [signingIn,setSigningIn]=useState(false),[email,setEmail]=useState(''),[name,setName]=useState(''),[question,setQuestion]=useState<number|null>(null),[picked,setPicked]=useState<number|null>(null);
  function draw(){let next=Math.floor(Math.random()*QUESTIONS.length);if(QUESTIONS.length>1)while(next===question)next=Math.floor(Math.random()*QUESTIONS.length);setQuestion(next);setPicked(null);onDraw()}
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
      <button className={`corner-draw ${nudge?'nudge':''}`} type="button" onClick={draw}><MessageCircleQuestion size={15}/>{q?'Draw another':'Draw a question'}</button>
      {q&&<div className="corner-question"><button className="corner-question-close" type="button" aria-label="Close question" onClick={()=>setQuestion(null)}><X size={14}/></button><span className="question-badge">Question</span><p>{q.text}</p><div className="question-options">{q.options.map((o,idx)=><button key={idx} type="button" className={picked===idx?'selected':''} aria-pressed={picked===idx} onClick={()=>{setPicked(idx);onAnswer(q.tags[idx])}}><span>{String.fromCharCode(65+idx)}</span>{o}</button>)}</div></div>}
    </>}
  </div></div>;
}

export default function Home(){
  const [started,setStarted]=useState(false),[seats,setSeats]=useState<(Seat|null)[]>([null,null,null,null]),[paused,setPaused]=useState(false),[rule,setRule]=useState(RULES[0]),[answers,setAnswers]=useState<(string|null)[]>([null,null,null,null]),[flash,setFlash]=useState<{seats:number[];key:number;text:string}|null>(null);
  const [micOn,setMicOn]=useState(false),[showDebug]=useState(()=>typeof window!=='undefined'&&new URLSearchParams(window.location.search).has('debug'));
  const lullAfterMs=paused?12000:25000;
  const ambient=useAmbientSilence({enabled:micOn,lullAfterMs});
  useEffect(()=>{if(!flash)return;const timer=setTimeout(()=>setFlash(null),3600);return()=>clearTimeout(timer)},[flash]);
  function answer(i:number,tag:string){const matched=answers.flatMap((a,j)=>j!==i&&seats[j]&&a===tag?[j]:[]);setAnswers(all=>all.map((x,j)=>j===i?tag:x));if(matched.length){const names=[i,...matched].map(j=>seats[j]!.guest?`Guest (Seat ${j+1})`:seats[j]!.name);setFlash(prev=>({seats:[i,...matched],key:(prev?.key??0)+1,text:`Same choice: ${names.join(' & ')}`}))}}
  if(!started)return <Intro onConfirm={()=>setStarted(true)}/>;
  const setSeat=(i:number,s:Seat|null)=>{setSeats(all=>all.map((x,j)=>j===i?s:x));if(!s)setAnswers(all=>all.map((x,j)=>j===i?null:x))};
  function randomRule(){const others=RULES.filter(r=>r!==rule);setRule(others[Math.floor(Math.random()*others.length)])}
  return <main className="table-page">
    <header className="table-header"><Brand/><button className="outline" onClick={()=>setStarted(false)}><Info size={16}/>Rules</button></header>
    <div className="radial-board">
      {SEATS.map((s,i)=><Corner key={s.pos} pos={s.pos} label={s.label} seat={seats[i]} onSit={seat=>setSeat(i,seat)} onLeave={()=>setSeat(i,null)} onAnswer={tag=>answer(i,tag)} onDraw={ambient.dismiss} nudge={ambient.isLull} flash={flash?.seats.includes(i)?flash:null}/>)}
      <div className={`center-circle ${paused?'paused':''}`}>
        <button className={`ambient-toggle ${micOn?'on':''}`} data-state={ambient.status} style={{'--level':ambient.level} as React.CSSProperties} type="button" aria-pressed={micOn} title={micOn?'Turn off quiet detector':'Turn on quiet detector (uses the microphone, nothing is recorded)'} aria-label={micOn?'Turn off quiet detector':'Turn on quiet detector'} onClick={()=>setMicOn(!micOn)}>{micOn?<Mic size={16}/>:<MicOff size={16}/>}</button>
        <span className={`game-state ${paused?'paused':'live'}`}><i/>{paused?'Paused':'Playing'}</span>
        {ambient.isLull?<div className="center-idle lull-nudge" role="status"><MessageCircleQuestion size={30}/><h2>It&apos;s gone quiet</h2><p>{seats.some(Boolean)?'Want to draw a question? Try the glowing button in your corner.':'Take a seat and draw a question to get talking.'}</p><button className="outline-light" type="button" onClick={ambient.dismiss}>Not now</button></div>
        :paused?<div className="center-idle"><Pause size={30}/><h2>Game paused</h2><p>Take a moment to talk. Resume when everyone is ready.</p></div>
        :<div className="center-idle"><span className="uno-label">UNO</span><span className="rule-name">{rule}</span><p>{ruleHelp[rule]}</p></div>}
        <div className="center-actions">
          <button className="primary" onClick={()=>setPaused(!paused)}>{paused?<><Play size={16}/>Resume</>:<><Pause size={16}/>Pause</>}</button>
          <button className="outline-light" onClick={randomRule} disabled={paused}><Shuffle size={16}/>Random rule</button>
        </div>
        <small className="seat-count">{seats.filter(Boolean).length} / 4 seats taken</small>
        {micOn&&<small className="ambient-note">{ambient.status==='listening'&&<span className="ambient-meter" aria-hidden="true"><i style={{width:`${Math.round(ambient.level*100)}%`}}/></span>}{ambientNote[ambient.status]}</small>}
      </div>
    </div>
    {showDebug&&<AmbientDebugPanel ambient={ambient} micOn={micOn} lullAfterMs={lullAfterMs}/>}
  </main>;
}
