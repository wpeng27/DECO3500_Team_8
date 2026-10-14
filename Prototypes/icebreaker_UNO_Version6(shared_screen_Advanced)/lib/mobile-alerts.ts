import type {MobileMatch,MobilePlayer} from './mobile';

export type SeenMatches=Record<string,string|null>;

// Observe all seats, including unselected ones, so changing tabs cannot replay a match.
// A null baseline is used on first load and after a disconnection/background pause.
export function observeMatches(previous:SeenMatches|null,players:MobilePlayer[],selectedId:string|undefined){
  const seen:SeenMatches=Object.fromEntries(players.map(player=>[player.id,player.match?.id??null]));
  const player=players.find(player=>player.id===selectedId);
  const match:MobileMatch|null=player?.match&&previous&&Object.hasOwn(previous,player.id)&&previous[player.id]!==player.match.id?player.match:null;
  return {seen,match};
}

// A short, softly decaying two-note bell generated locally; no audio download is needed.
export function playMatchChime(context:AudioContext){
  if(context.state!=='running')return false;
  const start=context.currentTime;
  [880,1174.66].forEach((frequency,index)=>{
    const tone=context.createOscillator();
    const gain=context.createGain();
    const at=start+index*.16;
    tone.type='sine';
    tone.frequency.setValueAtTime(frequency,at);
    gain.gain.setValueAtTime(0,at);
    gain.gain.linearRampToValueAtTime(.16,at+.012);
    gain.gain.exponentialRampToValueAtTime(.001,at+.5);
    tone.connect(gain);
    gain.connect(context.destination);
    tone.onended=()=>{tone.disconnect();gain.disconnect();};
    tone.start(at);
    tone.stop(at+.52);
  });
  return true;
}

export function vibrateMatch(cancel=false){
  try{
    if(typeof navigator!=='undefined'&&typeof navigator.vibrate==='function')navigator.vibrate(cancel?0:[120,70,120]);
  }catch{
    // Unsupported or blocked vibration must never interrupt the question controls.
  }
}
