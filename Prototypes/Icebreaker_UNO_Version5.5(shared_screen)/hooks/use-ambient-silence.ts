'use client';
import {useCallback,useEffect,useRef,useState} from 'react';

// Listens to the room through the microphone and reports when the table has gone quiet.
// Audio is analysed in the browser only: nothing is recorded, stored or sent anywhere.

export type AmbientStatus='off'|'starting'|'calibrating'|'listening'|'denied'|'unsupported'|'error';
// Raw numbers behind each decision, shown by the ?debug panel.
export type AmbientDebug={db:number;floor:number|null;talking:boolean;ratio:number};

const TICK_MS=100;            // how often the volume is sampled
const CALIBRATE_MS=5000;      // time spent measuring the background noise at the start
const WINDOW_MS=10000;        // sliding window used to judge whether people are talking
export const VOICE_MARGIN_DB=6;      // a sample this far above the noise floor counts as voice
const HANGOVER_MS=400;        // keep counting as voice through short gaps between words
export const QUIET_RATIO=.1;         // less voice than this in the window counts as quiet
export const TALK_RATIO=.25;         // more voice than this resets the quiet timer (hysteresis)

export function useAmbientSilence({enabled,lullAfterMs}:{enabled:boolean;lullAfterMs:number}){
  const [status,setStatus]=useState<AmbientStatus>('starting'),[level,setLevel]=useState(0),[quietMs,setQuietMs]=useState(0),[debug,setDebug]=useState<AmbientDebug|null>(null);
  const quietRef=useRef(0);
  // Snooze: restart the quiet timer, e.g. after someone draws a question or dismisses the nudge.
  const dismiss=useCallback(()=>{quietRef.current=0;setQuietMs(0)},[]);

  // getUserMedia only exists in a secure context (HTTPS or localhost).
  const supported=typeof navigator!=='undefined'&&!!navigator.mediaDevices?.getUserMedia&&typeof AudioContext!=='undefined';

  useEffect(()=>{
    if(!enabled||!supported)return;
    let cancelled=false,stream:MediaStream|null=null,ctx:AudioContext|null=null,timer:number|undefined;
    navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}}).then(s=>{
      if(cancelled){s.getTracks().forEach(t=>t.stop());return}
      stream=s;ctx=new AudioContext();void ctx.resume();
      // Keep roughly the speech band (about 300-3400 Hz) so hum, air-con and bass music matter less.
      const voice=ctx.createBiquadFilter();voice.type='bandpass';voice.frequency.value=1000;voice.Q.value=.7;
      const analyser=ctx.createAnalyser();analyser.fftSize=4096; // ~85 ms of audio, so each 100 ms tick sees most of the sound
      ctx.createMediaStreamSource(s).connect(voice).connect(analyser);
      const buf=new Float32Array(analyser.fftSize),calibration:number[]=[],recent:{at:number;talking:boolean}[]=[],started=performance.now();
      let floor:number|null=null,last=started,lastVoiceAt=-Infinity;
      setStatus('calibrating');
      timer=window.setInterval(()=>{
        // Use real elapsed time: browsers slow timers down in background tabs.
        const now=performance.now(),dt=now-last;last=now;
        analyser.getFloatTimeDomainData(buf);
        let sum=0;for(const v of buf)sum+=v*v;
        const db=10*Math.log10(sum/buf.length+1e-12);
        setLevel(Math.max(0,Math.min(1,(db-(floor??-70))/20)));
        if(floor===null){
          calibration.push(db);setDebug({db,floor:null,talking:false,ratio:0});
          if(now-started<CALIBRATE_MS)return;
          // Use a low percentile so a few words during calibration do not raise the floor.
          calibration.sort((a,b)=>a-b);floor=calibration[Math.floor(calibration.length*.1)];setStatus('listening');return;
        }
        const voiced=db>floor+VOICE_MARGIN_DB;
        if(voiced)lastVoiceAt=now;
        const talking=now-lastVoiceAt<=HANGOVER_MS;
        // Track slow changes in background noise: drop quickly, rise slowly, and never rise
        // towards soft speech (anything close to the voice threshold) so the floor does not creep up.
        if(db<floor)floor+=(db-floor)*.05;else if(db<floor+VOICE_MARGIN_DB/2)floor+=(db-floor)*.002;
        recent.push({at:now,talking});while(now-recent[0].at>WINDOW_MS)recent.shift();
        const ratio=recent.filter(r=>r.talking).length/recent.length;
        if(ratio<=QUIET_RATIO)quietRef.current+=dt;else if(ratio>=TALK_RATIO)quietRef.current=0;
        setQuietMs(quietRef.current);setDebug({db,floor,talking,ratio});
      },TICK_MS);
    }).catch((e:unknown)=>{if(!cancelled)setStatus(e instanceof DOMException&&e.name==='NotAllowedError'?'denied':'error')});
    return()=>{
      cancelled=true;window.clearInterval(timer);stream?.getTracks().forEach(t=>t.stop());void ctx?.close();
      quietRef.current=0;setQuietMs(0);setLevel(0);setDebug(null);setStatus('starting');
    };
  },[enabled,supported]);

  const current:AmbientStatus=!enabled?'off':!supported?'unsupported':status;
  return {status:current,level,quietMs,debug,isLull:current==='listening'&&quietMs>=lullAfterMs,dismiss};
}
