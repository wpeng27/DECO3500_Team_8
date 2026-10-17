export function isLoopbackAddress(address:string){
  return /^(localhost\.?|127(?:\.\d{1,3}){3}|\[::1\]|0\.0\.0\.0)$/i.test(address.trim());
}

export function mobileWebsiteUrl(address:string,location:{protocol:string;port:string},code:string){
  const hostname=address.trim();
  if(!/^[a-f0-9]{32}$/.test(code))return null;
  if(!(/^[a-z0-9.-]+$/i.test(hostname)||/^\[[a-f0-9:]+\]$/i.test(hostname)))return null;
  if(!['http:','https:'].includes(location.protocol))return null;
  try{return new URL(`${location.protocol}//${hostname}${location.port?`:${location.port}`:''}/mobile?room=${code}`).href;}
  catch{return null;}
}
