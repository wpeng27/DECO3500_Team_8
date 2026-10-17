import {networkInterfaces} from 'node:os';
import {isIPv4} from 'node:net';

// Read the same adapter addresses as ipconfig, without parsing localized output.
// Prefer Wi-Fi for phones; retain other adapters so the host can choose if needed.
export function getLanAddresses(interfaces=networkInterfaces()){
  const candidates=Object.entries(interfaces).flatMap(([name,addresses])=>
    (addresses??[]).filter(item=>!item.internal&&isIPv4(item.address)&&
      !/^(127\.|169\.254\.|0\.)/.test(item.address)).map(item=>({name,address:item.address}))
  );
  const rank=({name})=>/virtual|vethernet|vmware|virtualbox|vpn|docker|wsl|tailscale|\btap\b|\btun\b/i.test(name)?3:
    /wi-?fi|wireless|wlan/i.test(name)?0:/ethernet|\beth\d/i.test(name)?1:2;
  return candidates.sort((a,b)=>rank(a)-rank(b)||a.name.localeCompare(b.name))
    .filter((item,index,all)=>all.findIndex(other=>other.address===item.address)===index);
}
