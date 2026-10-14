'use client';

import {useState} from 'react';
import {Copy,Smartphone} from 'lucide-react';

export function MobileInvite({code,status}:{code:string;status:string}){
  const [address,setAddress]=useState(()=>window.location.hostname);
  const [copied,setCopied]=useState(false);
  // Only a hostname/IP is accepted, never another path or URL scheme.
  const valid=/^[a-z0-9.-]+$/i.test(address.trim())||/^\[[a-f0-9:]+\]$/i.test(address.trim());
  const local=['localhost','127.0.0.1','[::1]'].includes(address.trim());
  const link=valid?`${window.location.protocol}//${address.trim()}${window.location.port?`:${window.location.port}`:''}/mobile?room=${code}`:'';
  return <section className="mobile-invite" aria-label="Connect mobile screens">
    <div><strong><Smartphone size={18}/>Mobile screens</strong><p>Connect phones to the same Wi-Fi, then open this link in a browser. Keep this PC game tab open.</p></div>
    <label>PC network address<input value={address} onChange={event=>{setAddress(event.target.value);setCopied(false);}} placeholder="e.g. 192.168.1.25" spellCheck={false}/></label>
    {local&&<p>Replace localhost with the PC’s IPv4 address. Find it using <code>ipconfig</code> under your Wi-Fi or Ethernet adapter.</p>}
    {!valid&&<p role="status">Enter the PC’s IP address or hostname, without http:// or a port.</p>}
    {link&&<div className="mobile-link"><input aria-label="Mobile screen link" readOnly value={link} onFocus={event=>event.target.select()}/><button className="outline" onClick={async()=>{
      try{await navigator.clipboard.writeText(link);setCopied(true);}catch{setCopied(false);}
    }}><Copy size={16}/>{copied?'Copied':'Copy'}</button><a href={link} target="_blank" rel="noreferrer">Open</a></div>}
    <p role="status">{status}{status==='Connected'?' · Players can sign in, join as a guest, draw, answer and skip from their phones.':''}</p>
  </section>;
}
