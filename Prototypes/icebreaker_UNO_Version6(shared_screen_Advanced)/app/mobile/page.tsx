'use client';

import {useEffect,useState} from 'react';
import type {CSSProperties} from 'react';
import {Bell,BellOff,Check,MessageCircleQuestion,Smartphone,Sparkles,Wifi,WifiOff} from 'lucide-react';
import {QUESTIONS,RULE_HELP,isMatch} from '../../lib/game';
import {MobileRequestError,mobileId,mobileRequest} from '../../lib/mobile';
import type {MobileAvailableSeat,MobileCommand,MobileIdentity,MobilePlayer,MobileQuestionCommand,MobileResults,MobileRoom} from '../../lib/mobile';
import {useMatchAlerts} from '../../hooks/use-match-alerts';
import {MobileJoin} from '../../components/mobile-join';

function QuestionControls({player,disabled,onAction}:{player:MobilePlayer;disabled:boolean;onAction:(kind:'answer'|'skip',option?:number)=>void}){
  const [picked,setPicked]=useState<number|null>(null);
  const question=player.question&&QUESTIONS[player.question.index];
  if(!question)return null;
  return <section className="mobile-question">
    <span className="eyebrow">Your question</span><h2>{question.text}</h2>
    <div className="mobile-options" role="radiogroup" aria-label={question.text}>
      {question.options.map((option,index)=><button key={index} role="radio" aria-checked={picked===index} disabled={disabled} className={picked===index?'selected':''} onClick={()=>setPicked(index)}><span>{String.fromCharCode(65+index)}</span>{option}{picked===index&&<Check size={18}/>}</button>)}
    </div>
    <button className="primary mobile-submit" disabled={disabled||picked===null} onClick={()=>{if(picked!==null)onAction('answer',picked);}}><Check size={18}/>Submit answer</button>
    <button className="mobile-skip" disabled={disabled} onClick={()=>onAction('skip')}>Skip question</button>
  </section>;
}

// Mirrors the match summary in the player's corner on the PC.
function Results({results}:{results:MobileResults}){
  return <section className="mobile-results" aria-label="Your match results">
    <div className="mobile-results-overall"><span>Overall match</span><strong>{results.overall===null?'—':`${results.overall}%`}</strong></div>
    <p>Only questions you both answered count; a percentage needs 2 or more. It shows shared answers, not teamwork fit. Use it to start a conversation.</p>
    {results.rows.length?<ul>{results.rows.map((row,index)=>{
      if(row.single){
        const q=QUESTIONS[row.single.question];
        if(!q)return null;
        const {mine,theirs}=row.single;
        const matched=isMatch(row.single.question,mine,theirs);
        const label=q.complementary?(matched?'Complementary':'Same role'):(matched?'Same':'Different');
        return <li key={index}><div><strong>{row.name}</strong><span>{q.topic} · 1 shared question</span>
          <span>{mine===theirs?<>You both chose <q>{q.options[mine]}</q></>:<>You chose <q>{q.options[mine]}</q>; {row.name} chose <q>{q.options[theirs]}</q></>}</span></div><b>{label}</b></li>;
      }
      return <li key={index}><div><strong>{row.name}</strong><span>{row.shared?`Based on ${row.shared} shared questions`:'No shared question yet'}</span></div><b>{row.score===null?'—':`${row.score}%`}</b></li>;
    })}</ul>:<p>No other seated players.</p>}
  </section>;
}

export default function MobilePage(){
  const [code,setCode]=useState<string|null>(null);
  const [room,setRoom]=useState<MobileRoom|null>(null);
  const [error,setError]=useState('');
  const [connected,setConnected]=useState(false);
  const [selectedSeat,setSelectedSeat]=useState<number|null>(null);
  const [showJoin,setShowJoin]=useState(true);
  const [pending,setPending]=useState<MobileCommand|null>(null);
  const [actionMessage,setActionMessage]=useState('');

  useEffect(()=>{
    const value=new URL(window.location.href).searchParams.get('room');
    if(value&&/^[a-f0-9]{32}$/.test(value))setCode(value);
    else setError('Open Mobile screens on the PC and use the link for your table.');
  },[]);

  useEffect(()=>{
    if(!code)return;
    let stopped=false;
    let timer:ReturnType<typeof setTimeout>;
    const controller=new AbortController();
    async function poll(){
      try{
        const response=await fetch(`/api/mobile?room=${code}`,{cache:'no-store',signal:AbortSignal.any([controller.signal,AbortSignal.timeout(5000)])});
        const data=await response.json() as MobileRoom&{error?:string};
        if(!response.ok)throw new Error(data.error);
        if(stopped)return;
        setRoom(data);
        setConnected(data.online);
        setError(data.online?'':'PC disconnected. Keep its game tab open. If the PC was refreshed, scan the new QR code in Mobile screens.');
      }catch(error){
        if(stopped)return;
        setConnected(false);
        setError(error instanceof Error?error.message:'Cannot reach the PC. Check your Wi-Fi.');
      }
      if(!stopped)timer=setTimeout(poll,600);
    }
    void poll();
    return()=>{stopped=true;clearTimeout(timer);controller.abort();};
  },[code]);

  useEffect(()=>{
    if(!pending||!code)return;
    let stopped=false;
    let timer:ReturnType<typeof setTimeout>;
    const controller=new AbortController();
    // Retry the same ID after uncertain delivery; the server and PC deduplicate it.
    async function send(){
      try{
        await mobileRequest({kind:'command',code,command:pending},AbortSignal.any([controller.signal,AbortSignal.timeout(5000)]));
      }catch(error){
        if(!stopped)setActionMessage(error instanceof Error?error.message:'Reconnecting…');
        if(!stopped&&error instanceof MobileRequestError&&error.status<500){setPending(null);return;}
      }
      if(!stopped)timer=setTimeout(send,2500);
    }
    void send();
    return()=>{stopped=true;clearTimeout(timer);controller.abort();};
  },[pending,code]);

  useEffect(()=>{
    if(!pending||!room)return;
    const receipt=room.receipts.find(item=>item.id===pending.id);
    if(receipt){
      if(pending.kind==='join'){
        if(!receipt.error){setSelectedSeat(pending.seatIndex);setShowJoin(false);}
        setActionMessage(receipt.error??`You joined Seat ${pending.seatIndex+1}.`);
      }else{
        const name=room.snapshot.players.find(player=>player.id===pending.playerId)?.name??'this player';
        setActionMessage(receipt.error??(pending.kind==='answer'?`Answer submitted for ${name}.`:pending.kind==='skip'?`Question skipped for ${name}.`:''));
      }
      setPending(null);
    }
    else if(pending.kind!=='join'&&!room.snapshot.players.some(player=>player.id===pending.playerId)){
      setActionMessage('The table changed. Choose a current player.');setPending(null);
    }
  },[room,pending]);

  const players=room?.snapshot.players??[];
  const availableSeats=room?.snapshot.availableSeats??[];
  const player=players.find(item=>item.seatIndex===selectedSeat)??players[0];
  const status=room?.snapshot.status;
  const alerts=useMatchAlerts(room,connected,player?.id);
  const disabled=!connected||!!pending;
  function act(kind:MobileQuestionCommand['kind'],option?:number){
    if(!player||disabled)return;
    setActionMessage('Sending to the table…');
    setPending({id:mobileId(),playerId:player.id,kind,...(player.question?{questionId:player.question.id}:{}),...(option!==undefined?{option}:{})});
  }
  function join(seat:MobileAvailableSeat,identity:MobileIdentity){
    if(disabled)return;
    setActionMessage(`Joining ${seat.label}…`);
    setPending({id:mobileId(),kind:'join',seatIndex:seat.seatIndex,seatRevision:seat.revision,identity});
  }
  return <main className="mobile-page">
    <header className="mobile-header"><a href={code?`/mobile?room=${code}`:'/mobile'} aria-label="Icebreaker UNO mobile"><span className="brandmark">iB</span><span>Icebreaker <b>UNO</b><small>Mobile player screen</small></span></a><Smartphone size={22}/></header>
    <div className={`mobile-connection ${connected?'online':''}`} role="status">{connected?<Wifi size={16}/>:<WifiOff size={16}/>}<span>{error||(connected?'Connected to your table':'Connecting to the table…')}</span></div>
    {room&&<>
      <section className="mobile-alert-settings" aria-label="Match alerts">
        <div><button className="mobile-alert-toggle" aria-pressed={alerts.enabled} onClick={alerts.toggleAlerts}>{alerts.enabled?<BellOff size={17}/>:<Bell size={17}/>} {alerts.enabled?'Mute alerts':'Enable sound & vibration'}</button>{alerts.enabled&&<button className="mobile-alert-test" onClick={alerts.testAlerts}>Test alerts</button>}</div>
        <p role="status">{alerts.soundMessage}</p>
      </section>
      <div className="mobile-game-status"><span>{status==='ready'?'Ready to play':status==='ended'?'Game finished':status==='paused'?'Game paused':'Playing'} · {room.snapshot.rule}</span><strong>{Math.floor(room.snapshot.timeLeft/60)}:{String(room.snapshot.timeLeft%60).padStart(2,'0')}</strong></div>
      {(status==='playing'||status==='paused')&&RULE_HELP[room.snapshot.rule]&&<p className="mobile-rule-help"><strong>Extra rule: {room.snapshot.rule}</strong>{RULE_HELP[room.snapshot.rule]}</p>}
      {status!=='ended'&&(availableSeats.length>0?<section className="mobile-join-section" aria-label="Join this table">
        {players.length>0&&<button className="mobile-join-toggle" aria-expanded={showJoin} onClick={()=>setShowJoin(value=>!value)}>{showJoin?'Hide sign-in':'Join this table'} · {availableSeats.length} free {availableSeats.length===1?'seat':'seats'}</button>}
        {(showJoin||!players.length)&&<MobileJoin seats={availableSeats} disabled={disabled} onJoin={join}/>}
      </section>:<p className="mobile-seats-full">All seats are taken. Choose a player below to view their screen.</p>)}
      {players.length>0?<>
        <nav className="mobile-player-tabs" aria-label="Choose a player">{players.map(item=><button key={item.id} aria-pressed={player?.id===item.id} style={{'--seat-colour':item.baseColour} as CSSProperties} onClick={()=>{setSelectedSeat(item.seatIndex);setActionMessage('');}}><i/><span>Seat {item.seatIndex+1}<strong>{item.name}</strong></span></button>)}</nav>
        {player&&<section className={`mobile-player ${status==='ended'?'finished':''}`} style={{'--player-color':player.colour,'--base-color':player.baseColour} as CSSProperties} aria-label={`${player.name} player screen`}>
          {alerts.notice&&<><div key={alerts.notice.id} className="mobile-match-halo" aria-hidden="true"/><div className="mobile-match-notice" role="status"><Sparkles size={20}/><span>{alerts.notice.text}</span></div></>}
          <div className="mobile-player-title"><span>Seat {player.seatIndex+1}</span><h1>{player.name}</h1><p>{player.answered?`${player.answered} ${player.answered===1?'answer':'answers'} shaping your colour`:'Your colour starts unique'}</p></div>
          {status==='ended'?<><div className="mobile-waiting"><h2>Thanks for playing!</h2><p>{player.results?'Here is how your answers compared with everyone else at the table. Your final colour is shown here.':'See your match results on the shared screen. Your final colour is shown here.'}</p></div>{player.results&&<Results results={player.results}/>}</>
            :player.question?<QuestionControls key={`${player.id}-${player.question.id}`} player={player} disabled={disabled} onAction={act}/>
            :status==='ready'?<div className="mobile-waiting"><h2>Ready when you are</h2><p>Start the game on the PC to draw questions here.</p></div>
            :status==='paused'?<div className="mobile-waiting"><h2>Time for a chat</h2><p>Resume on the PC to draw your next question.</p></div>
            :player.complete?<div className="mobile-waiting"><h2>All questions answered</h2><p>Keep playing UNO and watch your colours come together.</p></div>
            :<div className="mobile-draw"><MessageCircleQuestion size={36}/><h2>Played an action card?</h2><p>{room.snapshot.rule==='Pick a player'?'Draw after an action card, or when another player picks you.':'Skip, Reverse, Draw Two, Wild or Wild Draw Four — draw a question after playing one.'}</p><button className="primary" disabled={disabled} onClick={()=>act('draw')}>Draw a question</button></div>}
        </section>}
      </>:status==='ended'?<section className="mobile-empty"><h1>Game finished</h1><p>Start a new round on the PC to take a seat.</p></section>:null}
      <p className="mobile-action-status" role="status">{actionMessage||(players.length?'Choose your seat above. Its colour stays in sync with the shared screen.':'Join a free seat above to get started.')}</p>
      {pending&&<button className="mobile-cancel" onClick={()=>{setPending(null);setActionMessage('Stopped waiting. A request already sent may still appear on the table.');}}>Stop waiting</button>}
    </>}
  </main>;
}
