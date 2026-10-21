'use client';

import {useEffect,useState} from 'react';
import {Copy,Smartphone} from 'lucide-react';
import QRCode from 'qrcode';
import {isLoopbackAddress,mobileWebsiteUrl} from '../lib/mobile-connection';

type NetworkAddress={name:string;address:string};

export function MobileInvite({code,status}:{code:string;status:string}){
  const [address,setAddress]=useState(()=>window.location.hostname);
  const [networks,setNetworks]=useState<NetworkAddress[]>([]);
  const [detecting,setDetecting]=useState(true);
  const [edited,setEdited]=useState(false);
  const [copyMessage,setCopyMessage]=useState('');
  const [qr,setQr]=useState<{link:string;image:string}|null>(null);
  const [qrError,setQrError]=useState('');
  // A deployed (HTTPS) site is reachable from any network, so the LAN address controls are not needed.
  const hosted=window.location.protocol==='https:'&&!isLoopbackAddress(window.location.hostname);
  const local=isLoopbackAddress(address);
  const link=mobileWebsiteUrl(address,window.location,code);

  useEffect(()=>{
    const controller=new AbortController();
    fetch('/api/mobile/network',{cache:'no-store',signal:controller.signal})
      .then(async response=>{
        if(!response.ok)throw new Error('Network detection unavailable');
        const data=await response.json() as {addresses:NetworkAddress[]};
        if(!controller.signal.aborted)setNetworks(data.addresses);
      })
      .catch(()=>{/* Keep the address field available if detection fails. */})
      .finally(()=>{if(!controller.signal.aborted)setDetecting(false);});
    return()=>controller.abort();
  },[]);

  useEffect(()=>{
    if(!edited&&isLoopbackAddress(window.location.hostname)&&networks.length)setAddress(networks[0].address);
  },[networks,edited]);

  useEffect(()=>{
    let cancelled=false;
    setQrError('');
    if(link&&!local){
      QRCode.toDataURL(link,{width:256,margin:4,errorCorrectionLevel:'M',color:{dark:'#17213d',light:'#ffffff'}})
        .then(image=>{if(!cancelled)setQr({link,image});})
        .catch(()=>{if(!cancelled)setQrError('QR code unavailable. Open the link instead.');});
    }
    return()=>{cancelled=true;};
  },[link,local]);

  function changeAddress(value:string){setAddress(value);setEdited(true);setCopyMessage('');}

  return <section className="mobile-invite" aria-label="Connect mobile screens">
    <div className="mobile-invite-layout"><div>
      <strong><Smartphone size={18}/>Mobile screens</strong>
      {hosted
        ?<p>Scan the QR code with any phone that has Internet access. The room code is included in the link. If you refresh the PC game, scan its new QR code to rejoin.</p>
        :<p>Connect phones to the same Wi-Fi and scan the QR code. The room code is included in the link. If you refresh the PC game, scan its new QR code to rejoin.</p>}
      {!hosted&&<div className="mobile-network-fields">
        <label>PC network address<input value={address} onChange={event=>changeAddress(event.target.value)} placeholder="e.g. 192.168.1.25" spellCheck={false}/></label>
        {networks.length>1&&<label>Detected networks<select value={networks.some(item=>item.address===address)?address:''} onChange={event=>changeAddress(event.target.value)}>
          <option value="" disabled>Choose a network</option>
          {networks.map(item=><option key={item.address} value={item.address}>{item.name} · {item.address}</option>)}
        </select></label>}
      </div>}
      {!hosted&&detecting&&<p role="status">Finding the PC’s IPv4 address…</p>}
      {!detecting&&local&&<p role="status">No LAN address was selected. Connect this PC to Wi-Fi or enter its IPv4 address above.</p>}
      {!link&&<p role="status">Enter the PC’s IP address or hostname, without http:// or a port.</p>}
      {link&&!local&&<div className="mobile-link"><input aria-label="Mobile screen link" readOnly value={link} onFocus={event=>event.target.select()}/><button className="outline" onClick={async()=>{
        try{await navigator.clipboard.writeText(link);setCopyMessage('Copied');}catch{setCopyMessage('Select the link to copy it.');}
      }}><Copy size={16}/>Copy</button><a href={link} target="_blank" rel="noreferrer">Open</a></div>}
      {copyMessage&&<p role="status">{copyMessage}</p>}
      <p role="status">{status}{status==='Connected'?' · Keep the PC game tab open. Players can join and answer from their phones.':''}</p>
    </div>
    {link&&!local&&<figure className="mobile-qr">
      {qr?.link===link?<img src={qr.image} width={176} height={176} alt="QR code to join this Icebreaker UNO room"/>:<div className="mobile-qr-placeholder" role="status">{qrError||'Creating QR code…'}</div>}
      <figcaption>Scan to join this room</figcaption>
    </figure>}
    </div>
  </section>;
}
