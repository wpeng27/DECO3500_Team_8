import {env} from 'cloudflare:workers';
export function database():D1Database{if(!env.DB)throw Error('Cannot save the activity right now. Please try again later.');return env.DB}
export async function digest(token:string){const a=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));return Array.from(new Uint8Array(a),b=>b.toString(16).padStart(2,'0')).join('')}
