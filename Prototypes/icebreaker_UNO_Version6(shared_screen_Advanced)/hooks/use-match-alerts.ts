'use client';

import {useEffect,useRef,useState} from 'react';
import {observeMatches,playMatchChime,vibrateMatch} from '../lib/mobile-alerts';
import type {SeenMatches} from '../lib/mobile-alerts';
import type {MobileMatch,MobileRoom} from '../lib/mobile';

export function useMatchAlerts(room:MobileRoom|null,connected:boolean,selectedId:string|undefined){
  const [enabled,setEnabled]=useState(false);
  const [soundMessage,setSoundMessage]=useState('Tap once to hear a test chime. Keep this screen open for match alerts.');
  const [notice,setNotice]=useState<(MobileMatch&{playerId:string})|null>(null);
  const previous=useRef<SeenMatches|null>(null);
  const audio=useRef<AudioContext|null>(null);
  const enabledRef=useRef(false);

  useEffect(()=>{
    const onVisibility=()=>{
      previous.current=null;
      setNotice(null);
      if(document.visibilityState!=='visible')vibrateMatch(true);
    };
    document.addEventListener('visibilitychange',onVisibility);
    return()=>{
      document.removeEventListener('visibilitychange',onVisibility);
      const context=audio.current;
      audio.current=null;
      if(context)void context.close().catch(()=>{});
      vibrateMatch(true);
    };
  },[]);

  useEffect(()=>{
    if(!room||!connected||document.visibilityState!=='visible'){
      previous.current=null;
      setNotice(null);
      return;
    }
    const observed=observeMatches(previous.current,room.snapshot.players,selectedId);
    previous.current=observed.seen;
    setNotice(current=>current?.playerId===selectedId?current:null);
    if(room.snapshot.status==='ready'||room.snapshot.status==='ended'){setNotice(null);return;}
    if(!observed.match||!selectedId)return;
    setNotice({...observed.match,playerId:selectedId});
    if(enabledRef.current){
      vibrateMatch();
      try{
        if(!audio.current||!playMatchChime(audio.current))setSoundMessage('Tap Test alerts to resume sound.');
      }catch{setSoundMessage('Sound unavailable. Vibration and match messages still work where supported.');}
    }
  },[room,connected,selectedId]);

  useEffect(()=>{
    if(!notice)return;
    const timer=setTimeout(()=>setNotice(null),4000);
    return()=>clearTimeout(timer);
  },[notice]);

  function testAlerts(){
    enabledRef.current=true;
    setEnabled(true);
    vibrateMatch();
    try{
      const Audio=window.AudioContext??(window as Window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
      if(!Audio)throw new Error('Audio unavailable');
      const context=audio.current??new Audio();
      audio.current=context;
      // resume() is called directly during the tap, satisfying browser autoplay rules.
      void context.resume().then(()=>{
        if(!enabledRef.current||audio.current!==context||document.visibilityState!=='visible')return;
        setSoundMessage(playMatchChime(context)?'Sound on · vibration where supported.':'Tap Test alerts to resume sound.');
      }).catch(()=>{
        if(enabledRef.current&&audio.current===context)setSoundMessage('Sound blocked. Tap Test alerts to try again.');
      });
    }catch{setSoundMessage('Sound unavailable. Match messages and supported vibration remain enabled.');}
  }

  function toggleAlerts(){
    if(!enabledRef.current){testAlerts();return;}
    enabledRef.current=false;
    setEnabled(false);
    setSoundMessage('Sound and vibration off. Match messages will still appear.');
    vibrateMatch(true);
    // Close rather than suspend: scheduled tones must not ring when alerts are re-enabled.
    const context=audio.current;
    audio.current=null;
    if(context)void context.close().catch(()=>{});
  }

  return {enabled,soundMessage,toggleAlerts,testAlerts,notice:notice?.playerId===selectedId?notice:null};
}
