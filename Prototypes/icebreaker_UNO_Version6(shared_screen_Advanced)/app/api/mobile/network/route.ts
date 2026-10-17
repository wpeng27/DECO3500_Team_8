import {env} from 'cloudflare:workers';

export const dynamic='force-dynamic';

export async function GET(){
  let addresses:{name:string;address:string}[]=[];
  try{
    const value:unknown=JSON.parse(env.MOBILE_LAN_ADDRESSES??'[]');
    if(Array.isArray(value))addresses=value.filter((item):item is {name:string;address:string}=>
      typeof item?.name==='string'&&typeof item?.address==='string'&&
      /^(?:\d{1,3}\.){3}\d{1,3}$/.test(item.address));
  }catch{/* Hosted deployments have no local PC adapters. */}
  return Response.json({addresses},{headers:{'Cache-Control':'no-store'}});
}
