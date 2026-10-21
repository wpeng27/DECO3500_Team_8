'use client';

import {useEffect,useState} from 'react';
import type {CSSProperties} from 'react';
import {Check,Flag,Info,LogIn,LogOut,MessageCircleQuestion,Pause,Play,RotateCcw,Smartphone,Sparkles,UserRound,X} from 'lucide-react';
import {QUESTIONS,RULES,isMatch,isOptOut} from '../lib/game';
import {mobileCommandError,mobileId} from '../lib/mobile';
import type {MobileCommand,MobileMatch,MobileSnapshot,OpenQuestion} from '../lib/mobile';
import {useMobileHost} from '../hooks/use-mobile-host';
import {MobileInvite} from '../components/mobile-invite';

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
  ['Take a seat','Up to four players: choose a corner, or scan the QR code under Mobile screens with a phone and choose a free seat.'],
  ['Sign in or play as a Guest','Enter your email and preferred name, or choose Continue as Guest without sharing any details.'],
  ['Start the game','With at least two players seated, press Start game in the centre circle to begin the 10-minute timer.'],
  ['Play UNO with real cards','Use physical UNO cards. The centre circle shows the time and extra rule. Anyone can press Pause to stop the timer, then Resume.'],
  ['Draw after an action card','After you play Skip, Reverse, Draw Two, Wild or Wild Draw Four (or another player picks you), press Draw a question. Choose an option and Submit answer, or Skip question. Skipping is always fine: it never counts against you or changes your colour, scores or the rule. Number cards do not trigger questions.'],
  ['How answers are used','Matching answers blend the inside colours; borders keep your seat colour. For the task-role question, different answers match because teams need different roles. Similarity scores compare only questions you both answered.'],
  ['Rules change automatically','The table counts answers and skips. Every three answers changes the extra rule and shows Rule changed. Skipped questions do not count towards a rule change.'],
  ['When does the game end?','The game ends when time runs out or someone has no cards left, whichever comes first. For empty hands, press Player out of cards. Each corner then shows similarity results with the other players.'],
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

// Guests, and signed-in players who share a name with someone else at the table, get their seat
// number added so results never say "Alex chose ..." about two different people.
function displayName(seats:(Seat|null)[],index:number){
  const seat=seats[index]!;
  if(seat.guest)return `Guest (Seat ${index+1})`;
  const key=seat.name.trim().toLowerCase();
  const shared=seats.some((other,otherIndex)=>otherIndex!==index&&other&&!other.guest&&other.name.trim().toLowerCase()===key);
  return shared?`${seat.name} (Seat ${index+1})`:seat.name;
}

function Brand(){
  return <div className="brand"><span className="brandmark">iB</span><span>Icebreaker <b>UNO</b></span></div>;
}

function RulesCard({onConfirm,confirmLabel}:{onConfirm:()=>void;confirmLabel:string}){
  return <section className="intro-card">
    <header className="intro-heading"><span className="eyebrow">Before you start</span><h1>How Icebreaker UNO works</h1></header>
    <ol className="intro-steps">{steps.map(([title,text],i)=><li key={title}><div className="intro-step-heading"><b>{i+1}</b><strong>{title}</strong></div><p>{text}</p></li>)}</ol>
    <footer className="intro-footer">
      <aside className="intro-privacy"><strong>About your email</strong><p>Your email and preferred name are used only for this game; mobile sign-in sends them through the PC server. Your email is never shown to other players. Connected phones share player names, colours and open questions. Choose Continue as Guest to avoid sharing sign-in details.</p></aside>
      <button className="primary intro-confirm" onClick={onConfirm}><Check size={18}/>{confirmLabel}</button>
    </footer>
  </section>;
}

function Intro({onConfirm}:{onConfirm:()=>void}){
  return <main className="intro"><Brand/><RulesCard onConfirm={onConfirm} confirmLabel="Got it, let's start"/></main>;
}

// Shown over the table, so open questions, sign-in forms and the game underneath are kept.
function RulesOverlay({onClose}:{onClose:()=>void}){
  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose();};
    window.addEventListener('keydown',onKey);
    return()=>window.removeEventListener('keydown',onKey);
  },[onClose]);
  return <div className="rules-overlay" role="dialog" aria-modal="true" aria-label="How Icebreaker UNO works" onClick={onClose}>
    <div className="rules-overlay-inner" onClick={event=>event.stopPropagation()}><RulesCard onConfirm={onClose} confirmLabel="Back to the game"/></div>
  </div>;
}

function MatchSummary({overall,matches,seats}:{overall:number|null;matches:MatchRow[];seats:(Seat|null)[]}){
  return <section className="match-summary" aria-label="Match summary">
    <div className="match-overall"><span>Overall match</span><strong>{overall===null?'—':`${overall}%`}</strong></div>
    <p className="match-explainer">Only questions you both answered count; a percentage needs 2 or more. It shows shared answers, not teamwork fit.</p>
    <div className="match-list">{matches.length?matches.map(match=>{
      const peerName=displayName(seats,match.seatIndex);
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

function Corner({pos,label,seat,onSit,onLeave,onAnswer,onSkip,onDraw,question,flash,ended,playing,paused,rule,color,baseColor,history,matches,overall,allSeats}:{
  pos:string;
  label:string;
  seat:Seat|null;
  onSit:(seat:Seat)=>void;
  onLeave:()=>void;
  onAnswer:(questionIndex:number,optionIndex:number)=>void;
  onSkip:()=>void;
  onDraw:()=>void;
  question:OpenQuestion|null;
  flash:{key:number;text:string}|null;
  ended:boolean;
  playing:boolean;
  paused:boolean;
  rule:string;
  color:string;
  baseColor:string;
  history:AnswerHistory;
  matches:MatchRow[];
  overall:number|null;
  allSeats:(Seat|null)[];
}){
  const [signingIn,setSigningIn]=useState(false);
  const [email,setEmail]=useState('');
  const [name,setName]=useState('');
  const [selection,setSelection]=useState<{questionId:string;option:number}|null>(null);
  const picked=selection?.questionId===question?.id?selection?.option??null:null;
  const [confirmLeave,setConfirmLeave]=useState(false);
  const answerCount=Object.keys(history).length;
  const unanswered=QUESTIONS.map((_,index)=>index).filter(index=>history[index]===undefined);

  // A drawn question always ends as answered or skipped, so the table count stays honest.
  function skipQuestion(){
    onSkip();
  }

  function submitAnswer(){
    if(question===null||picked===null)return;
    onAnswer(question.index,picked);
  }

  // Leaving clears this player's answers, so it takes a second press to confirm.
  function leave(){
    if(!confirmLeave){setConfirmLeave(true);return;}
    setConfirmLeave(false);
    setSelection(null);
    setEmail('');
    setName('');
    onLeave();
  }

  const q=question===null?null:QUESTIONS[question.index];
  // The inside follows the evolving colour; the border keeps the seat's own colour so seats stay recognisable.
  const cornerStyle={'--player-color':color,'--base-color':baseColor} as CSSProperties;

  return <div className={`corner corner-${pos} ${ended?'results-visible':''}`} style={cornerStyle}>
    <div key={flash?.key??'idle'} className={`corner-content ${flash?'flashing':''} ${ended?'has-results':''}`}>
      {flash&&<div className="flash-banner" role="status">{flash.text}</div>}
      {!seat?(signingIn?<form className="seat-form" onSubmit={event=>{event.preventDefault();onSit({name:name.trim(),email:email.trim(),guest:false});setSigningIn(false)}}>
        <span className="seat-label">{label} · Sign in</span>
        <label>Email<input type="email" required autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@example.com"/><small className="email-note">Only used for the current game session. Never shown to other players.</small></label>
        <label>Preferred name<input required maxLength={20} value={name} onChange={event=>setName(event.target.value)} placeholder="What should we call you?"/></label>
        <div className="seat-actions"><button className="primary" type="submit" disabled={!name.trim()||!email.trim()}>Sign in</button><button className="ghost" type="button" onClick={()=>setSigningIn(false)}>Cancel</button></div>
      </form>:<div className="seat-empty">
        <span className="seat-label">{label}</span><p>This seat is free.</p>
        <div className="seat-actions"><button className="primary" onClick={()=>setSigningIn(true)}><LogIn size={15}/>Sign in</button><button className="ghost" onClick={()=>onSit({name:'Guest',email:'',guest:true})}>Continue as Guest</button></div>
      </div>):<>
        <div className="seat-player"><span className="seat-avatar">{seat.guest?<UserRound size={18}/>:Array.from(seat.name)[0]?.toUpperCase()}</span><div><strong>{seat.name}</strong><span>{seat.guest?`Guest · ${label}`:`Signed in · ${label}`}</span><small className="colour-status"><i/>{answerCount?`${answerCount} ${answerCount===1?'answer':'answers'} shaping colour`:'Colour starts unique'}</small>{confirmLeave&&<small className="leave-confirm" role="status">Press the red button again to leave. Your answers will be cleared.</small>}</div><button className={`seat-leave ${confirmLeave?'confirming':''}`} title="Leave this seat" aria-label={confirmLeave?'Press again to leave this seat':'Leave this seat'} onClick={leave} onBlur={()=>setConfirmLeave(false)}><LogOut size={14}/></button></div>
        {ended?<MatchSummary overall={overall} matches={matches} seats={allSeats}/>:<>
          {!q&&(!playing?<p className="corner-waiting">Questions start when the game starts.</p>
            :paused?<p className="corner-waiting">Game paused. Questions come back when you press Resume.</p>
            :!unanswered.length?<p className="corner-waiting">You have answered every question.</p>
            :<button className="corner-draw" type="button" onClick={onDraw} title="Press after you play an action card, or when another player picks you"><MessageCircleQuestion size={15}/>{rule==='Pick a player'?'Played an action card or picked? Draw a question':'Played an action card? Draw a question'}</button>
            )}
          {q&&<div className="corner-question">
            <button className="corner-question-close" type="button" aria-label="Skip question" title="Skip question" onClick={skipQuestion}><X size={14}/></button>
            <span className="question-badge">Question · Choose one</span>
            <div className="question-body" key={question?.id} tabIndex={0} role="region" aria-label={`${label} question and answers`}>
              <p>{q.text}</p>
              <div className="question-options" role="radiogroup" aria-label={q.text}>{q.options.map((option,optionIndex)=><button key={optionIndex} type="button" role="radio" className={picked===optionIndex?'selected':''} aria-checked={picked===optionIndex} onClick={()=>question&&setSelection({questionId:question.id,option:optionIndex})}><span>{String.fromCharCode(65+optionIndex)}</span>{option}</button>)}</div>
            </div>
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
  const [seatIds,setSeatIds]=useState<string[]>(SEATS.map(()=>''));
  const [seatRevisions,setSeatRevisions]=useState<number[]>(SEATS.map(()=>0));
  const [openQuestions,setOpenQuestions]=useState<(OpenQuestion|null)[]>(SEATS.map(()=>null));
  const [mobileMatches,setMobileMatches]=useState<(MobileMatch|null)[]>(SEATS.map(()=>null));
  const [showMobile,setShowMobile]=useState(false);
  const [paused,setPaused]=useState(false);
  const [ended,setEnded]=useState(false);
  const [rule,setRule]=useState(RULES[0]);
  const [histories,setHistories]=useState<AnswerHistory[]>(EMPTY_HISTORIES);
  const [sessionKey,setSessionKey]=useState(0);
  const [flash,setFlash]=useState<{seats:number[];key:number;text:string}|null>(null);
  // The rules screen only opens the table; the game and its timer start when someone presses Start game.
  const [showRules,setShowRules]=useState(false);
  const [gameStarted,setGameStarted]=useState(false);
  // While running, the timer counts down to a fixed end time, so a throttled or sleeping tab
  // cannot slow it down. While paused (or before the start) there is no end time.
  const [endsAt,setEndsAt]=useState<number|null>(null);
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
    if(endsAt===null||ended)return;
    const timer=setInterval(()=>setTimeLeft(Math.max(0,Math.ceil((endsAt-Date.now())/1000))),250);
    return()=>clearInterval(timer);
  },[endsAt,ended]);

  useEffect(()=>{
    if(gameStarted&&timeLeft===0&&!ended)finishGame('time');
  });

  const colors=evolvingColors(histories,seats);
  const seatedCount=seats.filter(Boolean).length;
  const playing=gameStarted&&!ended;
  const untilNextRule=QUESTIONS_PER_RULE-tally.answered%QUESTIONS_PER_RULE;
  // Public snapshots exclude emails. Private mobile sign-in details arrive through host commands.
  const mobileSnapshot:MobileSnapshot={
    status:ended?'ended':!gameStarted?'ready':paused?'paused':'playing',rule,timeLeft,
    availableSeats:SEATS.flatMap((seat,index)=>!seats[index]?[{
      seatIndex:index,label:seat.label,baseColour:BASE_COLORS[index],revision:seatRevisions[index],
    }]:[]),
    players:seats.flatMap((seat,index)=>seat?[{
      id:seatIds[index],seatIndex:index,name:displayName(seats,index),colour:colors[index],baseColour:BASE_COLORS[index],
      answered:Object.keys(histories[index]).length,complete:Object.keys(histories[index]).length===QUESTIONS.length,
      question:openQuestions[index],match:mobileMatches[index],
    }]:[]),
  };
  const mobile=useMobileHost(mobileSnapshot,handleMobileCommand);

  // Keep the screen awake during play: nobody touches the laptop during UNO, and a sleeping
  // screen would hide the game. Browsers drop the lock when the tab is hidden, so ask again on return.
  useEffect(()=>{
    if(!playing||paused||!('wakeLock' in navigator))return;
    let lock:WakeLockSentinel|null=null;
    let cancelled=false;
    const request=async()=>{
      try{
        if(document.visibilityState!=='visible')return;
        const next=await navigator.wakeLock.request('screen');
        if(cancelled)next.release().catch(()=>{});
        else lock=next;
      }catch{
        // Not allowed (e.g. battery saver): the game still works, the screen may just dim.
      }
    };
    request();
    const onVisible=()=>{if(document.visibilityState==='visible')request();};
    document.addEventListener('visibilitychange',onVisible);
    return()=>{
      cancelled=true;
      document.removeEventListener('visibilitychange',onVisible);
      lock?.release().catch(()=>{});
    };
  },[playing,paused]);

  // Refreshing or closing the page loses the game, so the browser asks first while a game is on.
  useEffect(()=>{
    if(!playing)return;
    const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};
    window.addEventListener('beforeunload',warn);
    return()=>window.removeEventListener('beforeunload',warn);
  },[playing]);

  function startGame(){
    setTimeLeft(GAME_SECONDS);
    setEndsAt(Date.now()+GAME_SECONDS*1000);
    setGameStarted(true);
  }

  // The table counts answered and skipped questions, but only answers move the rule on:
  // otherwise anyone could draw and skip three times to get rid of a rule they dislike.
  function countQuestion(kind:'answered'|'skipped'){
    setTally(current=>({...current,[kind]:current[kind]+1}));
    if(kind==='answered'&&(tally.answered+1)%QUESTIONS_PER_RULE===0)randomRule();
  }

  function togglePause(){
    if(paused){
      setEndsAt(Date.now()+timeLeft*1000);
      setPaused(false);
    }else{
      if(endsAt!==null)setTimeLeft(Math.max(0,Math.ceil((endsAt-Date.now())/1000)));
      setEndsAt(null);
      setPaused(true);
    }
  }

  function answer(seatIndex:number,questionIndex:number,optionIndex:number){
    if(!playing||!seats[seatIndex]||openQuestions[seatIndex]?.index!==questionIndex||histories[seatIndex][questionIndex]!==undefined||!QUESTIONS[questionIndex]?.options[optionIndex])return;
    setOpenQuestions(all=>all.map((question,index)=>index===seatIndex?null:question));
    const matched=isOptOut(questionIndex,optionIndex)?[]:histories.flatMap((history,peerIndex)=>peerIndex!==seatIndex&&seats[peerIndex]&&history[questionIndex]!==undefined&&!isOptOut(questionIndex,history[questionIndex])&&isMatch(questionIndex,optionIndex,history[questionIndex])?[peerIndex]:[]);
    setHistories(all=>all.map((history,index)=>index===seatIndex?{...history,[questionIndex]:optionIndex}:history));
    countQuestion('answered');
    if(matched.length){
      const names=[seatIndex,...matched].map(index=>displayName(seats,index));
      const text=`${QUESTIONS[questionIndex].complementary?'Complementary roles':'Answer match'}: ${names.join(' & ')} · colours moved closer`;
      const match={id:mobileId(),text};
      // A durable event ID survives polling and belongs to every player in this match.
      setMobileMatches(all=>all.map((current,index)=>index===seatIndex||matched.includes(index)?match:current));
      setFlash(previous=>({seats:[seatIndex,...matched],key:(previous?.key??0)+1,text}));
    }
  }

  function setSeat(index:number,seat:Seat|null){
    if(seat&&seats[index])return;
    setSeats(all=>all.map((current,currentIndex)=>currentIndex===index?seat:current));
    setSeatRevisions(all=>all.map((revision,currentIndex)=>currentIndex===index?revision+1:revision));
    setSeatIds(all=>all.map((id,currentIndex)=>currentIndex===index?(seat?mobileId():''):id));
    setOpenQuestions(all=>all.map((question,currentIndex)=>currentIndex===index?null:question));
    setMobileMatches(all=>all.map((match,currentIndex)=>currentIndex===index?null:match));
    if(!seat)setHistories(all=>all.map((history,currentIndex)=>currentIndex===index?{}:history));
  }

  function drawQuestion(seatIndex:number){
    if(!playing||paused||!seats[seatIndex]||openQuestions[seatIndex])return;
    const candidates=QUESTIONS.map((_,index)=>index).filter(index=>histories[seatIndex][index]===undefined);
    if(!candidates.length)return;
    // Preserve the existing preference for questions already answered by peers.
    const answeredByOthers=(index:number)=>histories.filter((history,peer)=>peer!==seatIndex&&seats[peer]&&history[index]!==undefined&&!isOptOut(index,history[index])).length;
    const best=Math.max(...candidates.map(answeredByOthers));
    const top=candidates.filter(index=>answeredByOthers(index)===best);
    const question={id:mobileId(),index:top[Math.floor(Math.random()*top.length)]};
    setOpenQuestions(all=>all.map((current,index)=>index===seatIndex?question:current));
  }

  function skipQuestion(seatIndex:number){
    if(!playing||!seats[seatIndex]||!openQuestions[seatIndex])return;
    setOpenQuestions(all=>all.map((question,index)=>index===seatIndex?null:question));
    countQuestion('skipped');
  }

  function handleMobileCommand(command:MobileCommand):string|null{
    const error=mobileCommandError(mobileSnapshot,command);
    if(error)return error;
    if(command.kind==='join'){
      setSeat(command.seatIndex,command.identity);
      return null;
    }
    const index=seatIds.indexOf(command.playerId);
    if(command.kind==='draw'){
      drawQuestion(index);
      return null;
    }
    const question=openQuestions[index]!;
    if(command.kind==='skip')skipQuestion(index);
    else{
      if(command.option===undefined||!QUESTIONS[question.index]?.options[command.option])return 'Choose a valid answer.';
      answer(index,question.index,command.option);
    }
    return null;
  }

  function randomRule(){
    const others=RULES.filter(candidate=>candidate!==rule);
    const next=others[Math.floor(Math.random()*others.length)];
    setRule(next);
    setRuleNotice(previous=>({key:(previous?.key??0)+1,rule:next}));
  }

  function finishGame(reason:'time'|'cards'){
    setEndsAt(null);
    setPaused(false);
    setFlash(null);
    setRuleNotice(null);
    setEndReason(reason);
    setEnded(true);
  }

  function playAgain(){
    setSeatIds(seats.map(seat=>seat?mobileId():''));
    setSeatRevisions(all=>all.map(revision=>revision+1));
    setOpenQuestions(SEATS.map(()=>null));
    setMobileMatches(SEATS.map(()=>null));
    setEnded(false);
    setPaused(false);
    setRule(RULES[0]);
    setHistories(EMPTY_HISTORIES());
    setFlash(null);
    setEndReason(null);
    setTally({answered:0,skipped:0});
    setTimeLeft(GAME_SECONDS);
    setEndsAt(null);
    setRuleNotice(null);
    setGameStarted(false);
    setSessionKey(key=>key+1);
  }

  if(!started)return <Intro onConfirm={()=>setStarted(true)}/>;

  return <main className="table-page">
    <header className="table-header"><Brand/><div className="table-header-actions"><button className="outline" aria-expanded={showMobile} onClick={()=>{mobile.enable();setShowMobile(value=>!value);}}><Smartphone size={16}/>Mobile screens</button><button className="outline" onClick={()=>setShowRules(true)}><Info size={16}/>Rules</button></div></header>
    {showMobile&&mobile.code&&<MobileInvite code={mobile.code} status={mobile.status}/>}
    {showRules&&<RulesOverlay onClose={()=>setShowRules(false)}/>}
    <div className={`radial-board ${ended?'game-ended':''}`}>
      {SEATS.map((seat,index)=><Corner
        key={`${sessionKey}-${seat.pos}`}
        pos={seat.pos}
        label={seat.label}
        seat={seats[index]}
        onSit={value=>setSeat(index,value)}
        onLeave={()=>setSeat(index,null)}
        onAnswer={(questionIndex,optionIndex)=>answer(index,questionIndex,optionIndex)}
        onSkip={()=>skipQuestion(index)}
        onDraw={()=>drawQuestion(index)}
        question={openQuestions[index]}
        flash={flash?.seats.includes(index)?flash:null}
        ended={ended}
        playing={playing}
        paused={paused}
        rule={rule}
        color={colors[index]}
        baseColor={BASE_COLORS[index]}
        history={histories[index]}
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
        {ended?<div className="center-idle result-intro"><Sparkles size={30}/><h2>{endReason==='time'?"Time's up":'A player is out of cards'}</h2><p>Each corner compares your answers with every other player: the answers themselves after one shared question, a percentage after two or more. Use them as conversation starters, not as a verdict on who you should team up with.</p></div>
        :!gameStarted?<div className="center-idle"><h2>Ready to play?</h2><p>{seatedCount<2?'Take your seats. At least 2 players are needed to start.':'Everyone seated? Press Start game to begin the 10-minute timer.'}</p></div>
        :paused?<div className="center-idle"><Pause size={30}/><h2>Game paused</h2><p>The timer is stopped. Take a moment to talk, then press Resume.</p></div>
        :<div className="center-idle" key={rule}>{ruleNotice&&<span className="rule-changed-chip">Rule changed</span>}<span className="rule-name">{rule}</span><p>{ruleHelp[rule]}</p><p className="rule-next">Rule changes after {untilNextRule} more {untilNextRule===1?'answer':'answers'}</p></div>}
        <div className="center-actions">{ended?
          <button className="primary" onClick={playAgain}><RotateCcw size={16}/>Play again</button>
          :!gameStarted?<button className="primary start-button" onClick={startGame} disabled={seatedCount<2}><Play size={16}/>Start game</button>
          :<><button className="primary" onClick={togglePause}>{paused?<><Play size={16}/>Resume</>:<><Pause size={16}/>Pause</>}</button><button className="outline-light finish-button" onClick={()=>finishGame('cards')} title="Press when someone has no cards left"><Flag size={16}/>Player out of cards</button></>}
        </div>
        <small className="seat-count">{ended?'Percentages reflect only the questions answered in this game.':`${seatedCount} / 4 seats taken · ${tally.answered} answered · ${tally.skipped} skipped`}</small>
      </div>
    </div>
  </main>;
}
