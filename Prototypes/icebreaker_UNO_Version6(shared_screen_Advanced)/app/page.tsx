'use client';

import {useEffect,useState} from 'react';
import type {CSSProperties} from 'react';
import {Check,Flag,Info,LogIn,LogOut,MessageCircleQuestion,Pause,Play,RotateCcw,Sparkles,UserRound,X} from 'lucide-react';
import {QUESTIONS,RULES,isMatch,isOptOut} from '../lib/game';

type Seat={name:string;email:string;guest:boolean};
type AnswerHistory=Record<number,number>;
type PairMatch={score:number|null;shared:number;same:number;sharedQuestions:number[]};
type SingleAnswer={question:number;mine:number;theirs:number};
type MatchRow={seatIndex:number;score:number|null;shared:number;single:SingleAnswer|null};

const SEATS=[{pos:'tl',label:'Seat 1'},{pos:'tr',label:'Seat 2'},{pos:'bl',label:'Seat 3'},{pos:'br',label:'Seat 4'}];
const BASE_COLORS=['#7565F6','#11A78D','#E5A037','#E35675'];
const EMPTY_HISTORIES=():AnswerHistory[]=>SEATS.map(()=>({}));

const GAME_SECONDS=10*60;
const QUESTIONS_PER_RULE=3;
const RULE_NOTICE_MS=4000;

const ruleHelp:Record<string,string>={
  'Normal UNO':'Standard UNO rules, with no extra rule.',
  'Hidden cards':'Hold your cards facing out so you cannot see them. The other players help you choose what to play.',
  'Pick a player':'On your turn, pick another player to draw a question in their corner and answer it.',
  'Give a card':'On your turn, you may give one of your cards to another player, then draw one card from the deck.',
  'Swap cards':'On your turn, you may swap one card with another player if that player agrees.',
};

const steps=[
  ['Take a seat','Up to four people can play on this screen. Take one corner as your seat.'],
  ['Sign in or play as a Guest','Enter your email and preferred name, or choose Continue as Guest to play without sharing any details.'],
  ['Start the game','Once at least two players are seated, press Start game in the circle in the middle. This starts the 10-minute timer.'],
  ['Play UNO with real cards','Play UNO with physical cards around the screen. The circle in the middle shows the time left and the current extra rule. Anyone can press Pause, which also stops the timer.'],
  ['Draw a question after each action card','Every card except a number card is an action card: Skip, Reverse, Draw Two, Wild and Wild Draw Four. When you play one, press Draw a question in your corner and read the question. Then either choose an answer and press Submit answer, or press Skip question if you would rather not answer.'],
  ['How answers are used',"When your answer matches another player's, the inside of your corners moves towards each other's colour; the outer border keeps your own colour. Answers match when they are the same, except for the question about which task you would pick up first: there, different answers match, because a team needs people who take on different tasks. Your similarity score with another player compares only the questions you have both answered."],
  ['Rules change automatically','The screen counts every question drawn at the table, answered or skipped. After every three, the extra rule changes automatically and the screen shows Rule changed.'],
  ['When does the game end?','The game lasts 10 minutes from when you press Start game. It ends when the timer reaches zero or when someone has no cards left, whichever comes first. If someone has no cards left, press Player out of cards. Each corner then shows your similarity scores with the other players.'],
];

function formatTime(seconds:number){
  return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
}

function hexToRgb(hex:string):[number,number,number]{
  const value=parseInt(hex.slice(1),16);
  return [value>>16&255,value>>8&255,value&255];
}

function rgbToHex(rgb:[number,number,number]){
  return '#'+rgb.map(value=>Math.round(Math.max(0,Math.min(255,value))).toString(16).padStart(2,'0')).join('');
}

function rgbToHsl([r,g,b]:[number,number,number]):[number,number,number]{
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b),l=(max+min)/2,d=max-min;
  if(!d)return [0,0,l];
  const s=d/(1-Math.abs(2*l-1));
  const h=max===r?((g-b)/d+6)%6:max===g?(b-r)/d+2:(r-g)/d+4;
  return [h*60,s,l];
}

function hslToRgb([h,s,l]:[number,number,number]):[number,number,number]{
  const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
  const [r,g,b]=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
  return [(r+m)*255,(g+m)*255,(b+m)*255];
}

// One shared question can only give 0% or 100%, which says little: with four options, two people
// pick the same answer 25% of the time by chance. So a percentage needs at least two shared questions.
const MIN_SHARED_FOR_SCORE=2;

// Every pair starts at 50% and moves towards the real share of matching answers as more questions
// are shared, so a few answers cannot produce an extreme score: 2/2 same is 75%, 10/10 is 92%.
function similarity(same:number,shared:number){
  return shared>=MIN_SHARED_FOR_SCORE?Math.round((same+1)/(shared+2)*100):null;
}

function compareAnswers(a:AnswerHistory,b:AnswerHistory):PairMatch{
  const sharedQuestions=Object.keys(a).map(Number).filter(question=>b[question]!==undefined&&!isOptOut(question,a[question])&&!isOptOut(question,b[question]));
  const same=sharedQuestions.filter(question=>isMatch(question,a[question],b[question])).length;
  return {shared:sharedQuestions.length,same,score:similarity(same,sharedQuestions.length),sharedQuestions};
}

function evolvingColors(histories:AnswerHistory[],seats:(Seat|null)[]){
  return BASE_COLORS.map((base,index)=>{
    if(!seats[index])return base;
    // Blend in HSL rather than RGB: averaging RGB pulls contrasting colours towards grey,
    // whereas averaging hue on the colour wheel keeps the mixed colour bright.
    const [baseHue,baseSat,baseLight]=rgbToHsl(hexToRgb(base));
    let hueX=Math.cos(baseHue*Math.PI/180),hueY=Math.sin(baseHue*Math.PI/180),sat=baseSat,light=baseLight;
    let totalWeight=1;
    histories.forEach((history,peerIndex)=>{
      if(peerIndex===index||!seats[peerIndex])return;
      const match=compareAnswers(histories[index],history);
      // One shared match creates a visible move; repeated evidence creates convergence.
      // A disagreement reduces influence instead of falsely forcing colours together.
      const influence=match.shared?Math.min(1,(2*match.same)/(match.shared+2)):0;
      if(!influence)return;
      const [h,sPeer,lPeer]=rgbToHsl(hexToRgb(BASE_COLORS[peerIndex]));
      hueX+=Math.cos(h*Math.PI/180)*influence;
      hueY+=Math.sin(h*Math.PI/180)*influence;
      sat+=sPeer*influence;
      light+=lPeer*influence;
      totalWeight+=influence;
    });
    // Opposite hues can cancel out; keep the seat's own hue rather than an arbitrary one.
    const hue=Math.hypot(hueX,hueY)<1e-3?baseHue:(Math.atan2(hueY,hueX)*180/Math.PI+360)%360;
    return rgbToHex(hslToRgb([hue,sat/totalWeight,light/totalWeight]));
  });
}

function matchRowsFor(index:number,histories:AnswerHistory[],seats:(Seat|null)[]):MatchRow[]{
  return seats.flatMap((seat,peerIndex)=>{
    if(!seat||peerIndex===index)return [];
    const result=compareAnswers(histories[index],histories[peerIndex]);
    // With exactly one shared question, show the answers themselves instead of a percentage.
    const question=result.shared===1?result.sharedQuestions[0]:null;
    const single=question===null?null:{question,mine:histories[index][question],theirs:histories[peerIndex][question]};
    return [{seatIndex:peerIndex,score:result.score,shared:result.shared,single}];
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
  return similarity(same,shared);
}

function displayName(seat:Seat,index:number){
  return seat.guest?`Guest (Seat ${index+1})`:seat.name;
}

function Brand(){
  return <div className="brand"><span className="brandmark">iB</span><span>Icebreaker <b>UNO</b></span></div>;
}

function Intro({onConfirm,inProgress}:{onConfirm:()=>void;inProgress:boolean}){
  return <main className="intro"><Brand/><section className="intro-card"><span className="eyebrow">Before you start</span><h1>How Icebreaker UNO works</h1><ol className="intro-steps">{steps.map(([title,text],i)=><li key={title}><b>{i+1}</b><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol><button className="primary intro-confirm" onClick={onConfirm}><Check size={18}/>{inProgress?'Back to the game':<>Got it, let&apos;s start</>}</button></section></main>;
}

function MatchSummary({overall,matches,seats}:{overall:number|null;matches:MatchRow[];seats:(Seat|null)[]}){
  return <section className="match-summary" aria-label="Match summary">
    <div className="match-overall"><span>Overall match</span><strong>{overall===null?'—':`${overall}%`}</strong></div>
    <p className="match-explainer">Compares only questions you both answered. A percentage appears once you share 2 or more questions with someone.</p>
    <div className="match-list">{matches.length?matches.map(match=>{
      const peer=seats[match.seatIndex]!;
      const peerName=displayName(peer,match.seatIndex);
      if(match.single){
        const {question,mine,theirs}=match.single;
        const q=QUESTIONS[question];
        const alike=mine===theirs;
        const matched=isMatch(question,mine,theirs);
        // On a complementary question, different answers are the good outcome.
        const label=q.complementary?(matched?'Complementary':'Same role'):(matched?'Same':'Different');
        return <div className="match-row single" key={match.seatIndex}>
          <div><strong>{peerName}</strong><span className="match-topic">{q.topic} · 1 shared question</span>
            <span className="match-answers">{alike?<>You both chose <q>{q.options[mine]}</q></>:<>You chose <q>{q.options[mine]}</q>; {peerName} chose <q>{q.options[theirs]}</q></>}</span></div>
          <b className={matched?'alike':'differ'}>{label}</b>
        </div>;
      }
      return <div className={`match-row ${match.score===null?'unknown':''}`} key={match.seatIndex}>
        <div><strong>{peerName}</strong><span>{match.shared?`Based on ${match.shared} shared questions`:'No shared question yet'}</span></div>
        <b>{match.score===null?'—':`${match.score}%`}</b>
        {match.score!==null&&<span className="match-track" aria-hidden="true"><i style={{width:`${match.score}%`}}/></span>}
      </div>;
    }):<p className="no-matches">No other seated players.</p>}</div>
  </section>;
}

function Corner({pos,label,seat,onSit,onLeave,onAnswer,onSkip,flash,ended,playing,rule,color,baseColor,history,peerHistories,matches,overall,allSeats}:{
  pos:string;
  label:string;
  seat:Seat|null;
  onSit:(seat:Seat)=>void;
  onLeave:()=>void;
  onAnswer:(questionIndex:number,optionIndex:number)=>void;
  onSkip:()=>void;
  flash:{key:number;text:string}|null;
  ended:boolean;
  playing:boolean;
  rule:string;
  color:string;
  baseColor:string;
  history:AnswerHistory;
  peerHistories:AnswerHistory[];
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

  // Prefer questions you have not answered that the most other players have, so every pair
  // builds up shared answers and the similarity score has something to compare.
  function draw(){
    const unanswered=QUESTIONS.map((_,index)=>index).filter(index=>history[index]===undefined);
    const candidates=unanswered.length?unanswered:QUESTIONS.map((_,index)=>index);
    const answeredByOthers=(index:number)=>peerHistories.filter(peer=>peer[index]!==undefined&&!isOptOut(index,peer[index])).length;
    const best=Math.max(...candidates.map(answeredByOthers));
    const top=candidates.filter(index=>answeredByOthers(index)===best);
    const next=top[Math.floor(Math.random()*top.length)];
    setQuestion(next);
    setPicked(history[next]??null);
  }

  function closeQuestion(){
    setQuestion(null);
    setPicked(null);
  }

  // A drawn question always ends as answered or skipped, so the table count stays honest.
  function skipQuestion(){
    onSkip();
    closeQuestion();
  }

  function submitAnswer(){
    if(question===null||picked===null)return;
    onAnswer(question,picked);
    closeQuestion();
  }

  function leave(){
    setQuestion(null);
    setPicked(null);
    setEmail('');
    setName('');
    onLeave();
  }

  const q=question===null?null:QUESTIONS[question];
  // The inside follows the evolving colour; the border keeps the seat's own colour so seats stay recognisable.
  const cornerStyle={'--player-color':color,'--base-color':baseColor} as CSSProperties;

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
          {!q&&(playing
            ?<button className="corner-draw" type="button" onClick={draw} title="Press after you play an action card, or when another player picks you"><MessageCircleQuestion size={15}/>{rule==='Pick a player'?'Played an action card or picked? Draw a question':'Played an action card? Draw a question'}</button>
            :<p className="corner-waiting">Questions start when the game starts.</p>)}
          {q&&<div className="corner-question">
            <button className="corner-question-close" type="button" aria-label="Skip question" title="Skip question" onClick={skipQuestion}><X size={14}/></button>
            <span className="question-badge">Question · Choose one</span><p>{q.text}</p>
            <div className="question-options" role="radiogroup" aria-label={q.text}>{q.options.map((option,optionIndex)=><button key={optionIndex} type="button" role="radio" className={picked===optionIndex?'selected':''} aria-checked={picked===optionIndex} onClick={()=>setPicked(optionIndex)}><span>{String.fromCharCode(65+optionIndex)}</span>{option}</button>)}</div>
            <div className="question-actions">
              <button className="primary" type="button" disabled={picked===null} onClick={submitAnswer}><Check size={14}/>Submit answer</button>
              <button className="ghost" type="button" onClick={skipQuestion}>Skip question</button>
            </div>
          </div>}
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
  // The rules screen only opens the table; the game and its timer start when someone presses Start game.
  const [visitedTable,setVisitedTable]=useState(false);
  const [gameStarted,setGameStarted]=useState(false);
  const [ruleNotice,setRuleNotice]=useState<{key:number;rule:string}|null>(null);
  const [timeLeft,setTimeLeft]=useState(GAME_SECONDS);
  const [endReason,setEndReason]=useState<'time'|'cards'|null>(null);
  const [tally,setTally]=useState({answered:0,skipped:0});

  useEffect(()=>{
    if(!flash)return;
    const timer=setTimeout(()=>setFlash(null),3600);
    return()=>clearTimeout(timer);
  },[flash]);

  useEffect(()=>{
    if(!ruleNotice)return;
    const timer=setTimeout(()=>setRuleNotice(null),RULE_NOTICE_MS);
    return()=>clearTimeout(timer);
  },[ruleNotice]);

  useEffect(()=>{
    if(!gameStarted||paused||ended)return;
    const timer=setInterval(()=>setTimeLeft(left=>Math.max(0,left-1)),1000);
    return()=>clearInterval(timer);
  },[gameStarted,paused,ended]);

  useEffect(()=>{
    if(gameStarted&&timeLeft===0&&!ended)finishGame('time');
  });

  const colors=evolvingColors(histories,seats);
  const seatedCount=seats.filter(Boolean).length;
  const playing=gameStarted&&!ended;
  const questionsDone=tally.answered+tally.skipped;
  const untilNextRule=QUESTIONS_PER_RULE-questionsDone%QUESTIONS_PER_RULE;

  // Answered and skipped questions share one table-wide count; every third one switches the rule.
  function countQuestion(kind:'answered'|'skipped'){
    setTally(current=>({...current,[kind]:current[kind]+1}));
    if((questionsDone+1)%QUESTIONS_PER_RULE===0)randomRule();
  }

  function answer(seatIndex:number,questionIndex:number,optionIndex:number){
    const matched=isOptOut(questionIndex,optionIndex)?[]:histories.flatMap((history,peerIndex)=>peerIndex!==seatIndex&&seats[peerIndex]&&history[questionIndex]!==undefined&&!isOptOut(questionIndex,history[questionIndex])&&isMatch(questionIndex,optionIndex,history[questionIndex])?[peerIndex]:[]);
    setHistories(all=>all.map((history,index)=>index===seatIndex?{...history,[questionIndex]:optionIndex}:history));
    countQuestion('answered');
    if(matched.length){
      const names=[seatIndex,...matched].map(index=>displayName(seats[index]!,index));
      setFlash(previous=>({seats:[seatIndex,...matched],key:(previous?.key??0)+1,text:`${QUESTIONS[questionIndex].complementary?'Complementary roles':'Answer match'}: ${names.join(' & ')} · colours moved closer`}));
    }
  }

  function setSeat(index:number,seat:Seat|null){
    setSeats(all=>all.map((current,currentIndex)=>currentIndex===index?seat:current));
    if(!seat)setHistories(all=>all.map((history,currentIndex)=>currentIndex===index?{}:history));
  }

  function randomRule(){
    const others=RULES.filter(candidate=>candidate!==rule);
    const next=others[Math.floor(Math.random()*others.length)];
    setRule(next);
    setRuleNotice(previous=>({key:(previous?.key??0)+1,rule:next}));
  }

  function finishGame(reason:'time'|'cards'){
    setPaused(false);
    setFlash(null);
    setRuleNotice(null);
    setEndReason(reason);
    setEnded(true);
  }

  function playAgain(){
    setEnded(false);
    setPaused(false);
    setRule(RULES[0]);
    setHistories(EMPTY_HISTORIES());
    setFlash(null);
    setEndReason(null);
    setTally({answered:0,skipped:0});
    setTimeLeft(GAME_SECONDS);
    setRuleNotice(null);
    setGameStarted(false);
    setSessionKey(key=>key+1);
  }

  if(!started)return <Intro inProgress={visitedTable} onConfirm={()=>{setStarted(true);setVisitedTable(true)}}/>;

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
        onSkip={()=>countQuestion('skipped')}
        flash={flash?.seats.includes(index)?flash:null}
        ended={ended}
        playing={playing}
        rule={rule}
        color={colors[index]}
        baseColor={BASE_COLORS[index]}
        history={histories[index]}
        peerHistories={histories.filter((_,peerIndex)=>peerIndex!==index&&seats[peerIndex])}
        matches={matchRowsFor(index,histories,seats)}
        overall={overallMatch(index,histories,seats)}
        allSeats={seats}
      />)}
      {ruleNotice&&<>
        <div key={`flash-${ruleNotice.key}`} className="rule-flash" aria-hidden="true"/>
        <div key={`top-${ruleNotice.key}`} className="rule-banner rule-banner-top" aria-hidden="true">Rule changed: {ruleNotice.rule}</div>
        <div key={`bottom-${ruleNotice.key}`} className="rule-banner rule-banner-bottom" role="status">Rule changed: {ruleNotice.rule}</div>
      </>}
      <div className={`center-circle ${paused?'paused':''} ${ended?'ended':''} ${ruleNotice?'rule-changed':''}`}>
        <span className={`game-state ${!gameStarted?'ready':paused?'paused':'live'} ${ended?'ended':''}`}><i/>{ended?'Results':!gameStarted?'Ready':paused?'Paused':'Playing'}</span>
        {!ended&&<span className={`game-timer ${timeLeft<=60?'low':''}`} role="timer" aria-label="Time left">{formatTime(timeLeft)}</span>}
        {ended?<div className="center-idle result-intro"><Sparkles size={30}/><h2>{endReason==='time'?"Time's up":'A player is out of cards'}</h2><p>Each corner compares your answers with every other player: the answers themselves after one shared question, a percentage after two or more.</p></div>
        :!gameStarted?<div className="center-idle"><h2>Ready to play?</h2><p>{seatedCount<2?'Take your seats. At least 2 players are needed to start.':'Everyone seated? Press Start game to begin the 10-minute timer.'}</p></div>
        :paused?<div className="center-idle"><Pause size={30}/><h2>Game paused</h2><p>The timer is stopped. Take a moment to talk, then press Resume.</p></div>
        :<div className="center-idle" key={rule}>{ruleNotice&&<span className="rule-changed-chip">Rule changed</span>}<span className="rule-name">{rule}</span><p>{ruleHelp[rule]}</p><p className="rule-next">Rule changes after {untilNextRule} more {untilNextRule===1?'question':'questions'}</p></div>}
        <div className="center-actions">{ended?
          <button className="primary" onClick={playAgain}><RotateCcw size={16}/>Play again</button>
          :!gameStarted?<button className="primary start-button" onClick={()=>setGameStarted(true)} disabled={seatedCount<2}><Play size={16}/>Start game</button>
          :<><button className="primary" onClick={()=>setPaused(!paused)}>{paused?<><Play size={16}/>Resume</>:<><Pause size={16}/>Pause</>}</button><button className="outline-light finish-button" onClick={()=>finishGame('cards')} disabled={seatedCount<2} title="Press when someone has no cards left"><Flag size={16}/>Player out of cards</button></>}
        </div>
        <small className="seat-count">{ended?'Percentages use shared questions, not private profile data.':`${seatedCount} / 4 seats taken · ${tally.answered} answered · ${tally.skipped} skipped`}</small>
      </div>
    </div>
  </main>;
}
