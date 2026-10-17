'use client';

import {useEffect,useRef,useState} from 'react';
import {MobileRequestError,mobileId,mobileRequest} from '../lib/mobile';
import type {CommandReceipt,MobileCommand,MobileSnapshot} from '../lib/mobile';

export function useMobileHost(snapshot:MobileSnapshot,onCommand:(command:MobileCommand)=>string|null){
  const [connection,setConnection]=useState<{code:string;token:string}|null>(null);
  const [status,setStatus]=useState('');
  const latest=useRef({snapshot,onCommand});
  useEffect(()=>{latest.current={snapshot,onCommand};});

  useEffect(()=>{
    if(!connection)return;
    let stopped=false;
    let created=false;
    let receipt:CommandReceipt|null=null;
    let timer:ReturnType<typeof setTimeout>;
    const controller=new AbortController();
    async function sync(){
      try{
        const signal=AbortSignal.any([controller.signal,AbortSignal.timeout(5000)]);
        if(!created){
          await mobileRequest({kind:'create',...connection,snapshot:latest.current.snapshot},signal);
          created=true;
        }
        const result=await mobileRequest<{command:MobileCommand|null}>({
          kind:'sync',...connection,snapshot:latest.current.snapshot,receipt,
        },signal);
        if(stopped)return;
        if(result.command&&result.command.id!==receipt?.id){
          receipt={id:result.command.id,error:latest.current.onCommand(result.command)};
        }
        setStatus('Connected');
      }catch(error){
        if(stopped)return;
        setStatus(error instanceof Error?error.message:'Reconnecting…');
        if(error instanceof MobileRequestError&&error.status===404)created=false;
      }
      // One command per cycle lets React commit the new state before publishing its receipt.
      if(!stopped)timer=setTimeout(sync,400);
    }
    void sync();
    return()=>{stopped=true;clearTimeout(timer);controller.abort();};
  },[connection]);

  return {code:connection?.code??null,status,enable:()=>{
    if(!connection){setStatus('Connecting…');setConnection({code:mobileId(),token:mobileId()});}
  }};
}
