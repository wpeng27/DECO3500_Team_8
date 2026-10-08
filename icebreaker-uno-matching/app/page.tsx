'use client';

import {useEffect,useState} from 'react';
import type {CSSProperties} from 'react';
import {Check,Flag,Info,LogIn,LogOut,MessageCircleQuestion,Pause,Play,RotateCcw,Shuffle,Sparkles,UserRound,X} from 'lucide-react';
import {QUESTIONS,RULES} from '../lib/game';

type Seat={name:string;email:string;guest:boolean};
type AnswerHistory=Record<number,number>;
type PairMatch={score:number|null;shared:number;same:number};
type MatchRow={seatIndex:number;score:number|null;shared:number};

const SEATS=[{pos:'tl',label:'Seat 1'},{pos:'tr',label:'Seat 2'},{pos:'bl',label:'Seat 3'},{pos:'br',label:'Seat 4'}];
const BASE_COLORS=['#7565F6','#11A78D','#E5A037','#E35675'];
const EMPTY_HISTORIES=():AnswerHistory[]=>SEATS.map(()=>({}));

const ruleHelp:Record<string,string>={
  'Normal UNO':'Play normal UNO with your real cards.',
  'Hidden cards':'Do not look at your own cards. Ask the table to help you choose what to play.',
  'Optional questions':'Ask someone a question if you want to talk. Asking and answering are both optional.',
  'Give a card':'You may give one of your cards to another player.',
  'Swap cards':'You may swap cards with another player if you both agree.',
};

const steps=[
  ['Take a corner','Up to four players share this screen. Each corner is one seat.'],
  ['Sign in or play as a Guest','Enter your email and preferred name, or continue as a Guest without sharing anything.'],
  ['Play UNO with real cards','The circle in the middle shows the current rule. Anyone can pause the game or switch to a random rule.'],
  ['Answer only when you want','Answers gradually shape each player colour. At the end, each corner reveals pair-by-pair match percentages.'],
];

function hexToRgb(hex:string):[number,number,number]{
  const value=parseInt(hex.slice(1),16);
  return [value>>16&255,value>>8&255,value&255];
}

function rgbToHex(rgb:[number,number,number]){
  return '#'+rgb.map(value=>Math.round(Math.max(0,Math.min(255,value))).toString(16).padStart(2,'0')).join('');
}

function compareAnswers(a:AnswerHistory,b:AnswerHistory):PairMatch{
  const shared=Object.keys(a).map(Number).filter(question=>b[question]!==undefined);
  const same=shared.filter(question=>a[question]===b[question]).length;
  return {shared:shared.length,same,score:shared.length?Math.round(same/shared.length*100):null};
}

function evolvingColors(histories:AnswerHistory[],seats:(Seat|null)[]){
  return BASE_COLORS.map((base,index)=>{
    if(!seats[index])return base;
    const total=hexToRgb(base).map(Number) as [number,number,number];
    let totalWeight=1;
    histories.forEach((history,peerIndex)=>{
      if(peerIndex===index||!seats[peerIndex])return;
      const match=compareAnswers(histories[index],history);
      // One shared match creates a visible move; repeated evidence creates convergence.
      // A disagreement reduces influence instead of falsely forcing colours together.
      const influence=match.shared?Math.min(1,(2*match.same)/(match.shared+2)):0;
      if(!influence)return;
      const peer=hexToRgb(BASE_COLORS[peerIndex]);
      total[0]+=peer[0]*influence;
      total[1]+=peer[1]*influence;
      total[2]+=peer[2]*influence;
      totalWeight+=influence;
    });
    return rgbToHex([total[0]/totalWeight,total[1]/totalWeight,total[2]/totalWeight]);
  });
}

function matchRowsFor(index:number,histories:AnswerHistory[],seats:(Seat|null)[]):MatchRow[]{
  return seats.flatMap((seat,peerIndex)=>{
    if(!seat||peerIndex===index)return [];
    const result=compareAnswers(histories[index],histories[peerIndex]);
    return [{seatIndex:peerIndex,score:result.score,shared:result.shared}];
  });
}

function overallMatch(index:number,histories:AnswerHistory[],seats:(Seat|null)[]){
  let shared=0;
  let same=0;
  seats.forEach((seat,peerIndex)=>{
    if(!seat||peerIndex===index)return;
    const result=compareAnswers(histories[index],histories[peerIndex]);
    shared+=result.shared;
    same+=result.same;
  });
  return shared?Math.round(same/shared*100):null;
}

function displayName(seat:Seat,index:number){
  return seat.guest?`Guest (Seat ${index+1})`:seat.name;
}

function Brand(){
  return <div className="brand"><span className="brandmark">iB</span><span>Icebreaker <b>UNO</b></span></div>;
}

function Intro({onConfirm}:{onConfirm:()=>void}){
  return <main className="intro"><Brand/><section className="intro-card"><span className="eyebrow">Before you start</span><h1>How Icebreaker UNO works</h1><ol className="intro-steps">{steps.map(([title,text],i)=><li key={title}><b>{i+1}</b><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol><button className="primary intro-confirm" onClick={onConfirm}><Check size={18}/>Got it, let&apos;s start</button></section></main>;
}

function MatchSummary({overall,matches,seats}:{overall:number|null;matches:MatchRow[];seats:(Seat|null)[]}){
  return <section className="match-summary" aria-label="Match summary">
    <div className="match-overall"><span>Overall match</span><strong>{overall===null?'—':`${overall}%`}</strong></div>
    <p className="match-explainer">Based only on questions both people answered.</p>
    <div className="match-list">{matches.length?matches.map(match=>{
      const peer=seats[match.seatIndex]!;
      return <div className={`match-row ${match.score===null?'unknown':''}`} key={match.seatIndex}>
        <div><strong>{displayName(peer,match.seatIndex)}</strong><span>{match.shared?`${match.shared} shared ${match.shared===1?'answer':'answers'}`:'No shared answer yet'}</span></div>
        <b>{match.score===null?'—':`${match.score}%`}</b>
        <span className="match-track" aria-hidden="true"><i style={{width:`${match.score??0}%`}}/></span>
      </div>;
    }):<p className="no-matches">No other seated players.</p>}</div>
  </section>;
}

function Corner({pos,label,seat,onSit,onLeave,onAnswer,flash,ended,color,history,matches,overall,allSeats}:{
  pos:string;
  label:string;
  seat:Seat|null;
  onSit:(seat:Seat)=>void;
  onLeave:()=>void;
  onAnswer:(questionIndex:number,optionIndex:number)=>void;
  flash:{key:number;text:string}|null;
  ended:boolean;
  color:string;
  history:AnswerHistory;
  matches:MatchRow[];
  overall:number|null;
  allSeats:(Seat|null)[];
}){
  const [signingIn,setSigningIn]=useState(false);
  const [email,setEmail]=useState('');
  const [name,setName]=useState('');
  const [question,setQuestion]=useState<number|null>(null);
  const [picked,setPicked]=useState<number|null>(null);
  const answerCount=Object.keys(history).length;

  function draw(){
    let next=Math.floor(Math.random()*QUESTIONS.length);
    if(QUESTIONS.length>1)while(next===question)next=Math.floor(Math.random()*QUESTIONS.length);
    setQuestion(next);
    setPicked(history[next]??null);
  }

  function leave(){
    setQuestion(null);
    setPicked(null);
    setEmail('');
    setName('');
    onLeave();
  }

  const q=question===null?null:QUESTIONS[question];
  const cornerStyle={'--player-color':color} as CSSProperties;

  return <div className={`corner corner-${pos} ${ended?'results-visible':''}`} style={cornerStyle}>
    <div key={flash?.key??'idle'} className={`corner-content ${flash?'flashing':''} ${ended?'has-results':''}`}>
      {flash&&<div className="flash-banner" role="status">{flash.text}</div>}
      {!seat?(signingIn?<form className="seat-form" onSubmit={event=>{event.preventDefault();onSit({name:name.trim(),email:email.trim(),guest:false});setSigningIn(false)}}>
        <span className="seat-label">{label} · Sign in</span>
        <label>Email<input type="email" required autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@example.com"/></label>
        <label>Preferred name<input required maxLength={20} value={name} onChange={event=>setName(event.target.value)} placeholder="What should we call you?"/></label>
        <div className="seat-actions"><button className="primary" type="submit" disabled={!name.trim()||!email.trim()}>Sign in</button><button className="ghost" type="button" onClick={()=>setSigningIn(false)}>Cancel</button></div>
      </form>:<div className="seat-empty">
        <span className="seat-label">{label}</span><p>This seat is free.</p>
        <div className="seat-actions"><button className="primary" onClick={()=>setSigningIn(true)}><LogIn size={15}/>Sign in</button><button className="ghost" onClick={()=>onSit({name:'Guest',email:'',guest:true})}>Continue as Guest</button></div>
      </div>):<>
        <div className="seat-player"><span className="seat-avatar">{seat.guest?<UserRound size={18}/>:seat.name[0].toUpperCase()}</span><div><strong>{seat.name}</strong><span>{seat.guest?`Guest · ${label}`:`Signed in · ${label}`}</span><small className="colour-status"><i/>{answerCount?`${answerCount} ${answerCount===1?'answer':'answers'} shaping colour`:'Colour starts unique'}</small></div><button className="seat-leave" title="Leave this seat" aria-label="Leave this seat" onClick={leave}><LogOut size={14}/></button></div>
        {ended?<MatchSummary overall={overall} matches={matches} seats={allSeats}/>:<>
          <button className="corner-draw" type="button" onClick={draw}><MessageCircleQuestion size={15}/>{q?'Draw another':'Draw a question'}</button>
          {q&&<div className="corner-question"><button className="corner-question-close" type="button" aria-label="Close question" onClick={()=>setQuestion(null)}><X size={14}/></button><span className="question-badge">Question</span><p>{q.text}</p><div className="question-options">{q.options.map((option,optionIndex)=><button key={optionIndex} type="button" className={picked===optionIndex?'selected':''} aria-pressed={picked===optionIndex} onClick={()=>{setPicked(optionIndex);onAnswer(question!,optionIndex)}}><span>{String.fromCharCode(65+optionIndex)}</span>{option}</button>)}</div></div>}
        </>}
      </>}
    </div>
  </div>;
}

export default function Home(){
  const [started,setStarted]=useState(false);
  const [seats,setSeats]=useState<(Seat|null)[]>([null,null,null,null]);
  const [paused,setPaused]=useState(false);
  const [ended,setEnded]=useState(false);
  const [rule,setRule]=useState(RULES[0]);
  const [histories,setHistories]=useState<AnswerHistory[]>(EMPTY_HISTORIES);
  const [sessionKey,setSessionKey]=useState(0);
  const [flash,setFlash]=useState<{seats:number[];key:number;text:string}|null>(null);

  useEffect(()=>{
    if(!flash)return;
    const timer=setTimeout(()=>setFlash(null),3600);
    return()=>clearTimeout(timer);
  },[flash]);

  const colors=evolvingColors(histories,seats);

  function answer(seatIndex:number,questionIndex:number,optionIndex:number){
    const matched=histories.flatMap((history,peerIndex)=>peerIndex!==seatIndex&&seats[peerIndex]&&history[questionIndex]===optionIndex?[peerIndex]:[]);
    setHistories(all=>all.map((history,index)=>index===seatIndex?{...history,[questionIndex]:optionIndex}:history));
    if(matched.length){
      const names=[seatIndex,...matched].map(index=>displayName(seats[index]!,index));
      setFlash(previous=>({seats:[seatIndex,...matched],key:(previous?.key??0)+1,text:`Answer match: ${names.join(' & ')} · colours moved closer`}));
    }
  }

  function setSeat(index:number,seat:Seat|null){
    setSeats(all=>all.map((current,currentIndex)=>currentIndex===index?seat:current));
    if(!seat)setHistories(all=>all.map((history,currentIndex)=>currentIndex===index?{}:history));
  }

  function randomRule(){
    const others=RULES.filter(candidate=>candidate!==rule);
    setRule(others[Math.floor(Math.random()*others.length)]);
  }

  function finishGame(){
    setPaused(false);
    setFlash(null);
    setEnded(true);
  }

  function playAgain(){
    setEnded(false);
    setPaused(false);
    setRule(RULES[0]);
    setHistories(EMPTY_HISTORIES());
    setFlash(null);
    setSessionKey(key=>key+1);
  }

  if(!started)return <Intro onConfirm={()=>setStarted(true)}/>;

  return <main className="table-page">
    <header className="table-header"><Brand/><button className="outline" onClick={()=>setStarted(false)}><Info size={16}/>Rules</button></header>
    <div className={`radial-board ${ended?'game-ended':''}`}>
      {SEATS.map((seat,index)=><Corner
        key={`${sessionKey}-${seat.pos}`}
        pos={seat.pos}
        label={seat.label}
        seat={seats[index]}
        onSit={value=>setSeat(index,value)}
        onLeave={()=>setSeat(index,null)}
        onAnswer={(questionIndex,optionIndex)=>answer(index,questionIndex,optionIndex)}
        flash={flash?.seats.includes(index)?flash:null}
        ended={ended}
        color={colors[index]}
        history={histories[index]}
        matches={matchRowsFor(index,histories,seats)}
        overall={overallMatch(index,histories,seats)}
        allSeats={seats}
      />)}
      <div className={`center-circle ${paused?'paused':''} ${ended?'ended':''}`}>
        <span className={`game-state ${paused?'paused':'live'} ${ended?'ended':''}`}><i/>{ended?'Results':paused?'Paused':'Playing'}</span>
        {ended?<div className="center-idle result-intro"><Sparkles size={30}/><h2>Connections revealed</h2><p>Each corner shows pair-by-pair similarity. A percentage appears only when both people answered at least one of the same questions.</p></div>
        :paused?<div className="center-idle"><Pause size={30}/><h2>Game paused</h2><p>Take a moment to talk. Resume when everyone is ready.</p></div>
        :<div className="center-idle"><span className="uno-label">UNO</span><span className="rule-name">{rule}</span><p>{ruleHelp[rule]}</p></div>}
        <div className="center-actions">{ended?
          <button className="primary" onClick={playAgain}><RotateCcw size={16}/>Play again</button>
          :<><button className="primary" onClick={()=>setPaused(!paused)}>{paused?<><Play size={16}/>Resume</>:<><Pause size={16}/>Pause</>}</button><button className="outline-light" onClick={randomRule} disabled={paused}><Shuffle size={16}/>Random rule</button><button className="outline-light finish-button" onClick={finishGame} disabled={seats.filter(Boolean).length<2}><Flag size={16}/>Finish game</button></>}
        </div>
        <small className="seat-count">{ended?'Percentages use shared questions, not private profile data.':`${seats.filter(Boolean).length} / 4 seats taken`}</small>
      </div>
    </div>
  </main>;
}
