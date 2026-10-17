import assert from 'node:assert/strict';
import {test} from 'node:test';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import {getLanAddresses} from './lan-addresses.mjs';
import {isLoopbackAddress,mobileWebsiteUrl} from '../lib/mobile-connection.ts';

const ipv4=(address,internal=false)=>({address,internal,family:'IPv4'});

test('LAN detection prefers Wi-Fi, excludes loopback/link-local/IPv6 and retains alternatives',()=>{
  assert.deepEqual(getLanAddresses({
    'vEthernet (WSL)':[ipv4('172.19.0.1')],
    Ethernet:[ipv4('10.0.0.5')],
    'Wi-Fi 2':[ipv4('192.168.1.25'),{address:'fe80::1',family:'IPv6',internal:false}],
    Loopback:[ipv4('127.0.0.1',true)],
    Disconnected:[ipv4('169.254.1.1'),ipv4('0.0.0.0')],
    Duplicate:[ipv4('192.168.1.25')],
  }),[
    {name:'Wi-Fi 2',address:'192.168.1.25'},
    {name:'Ethernet',address:'10.0.0.5'},
    {name:'vEthernet (WSL)',address:'172.19.0.1'},
  ]);
  assert.deepEqual(getLanAddresses({}),[]);
});

test('mobile URL includes the room code and preserves protocol and server port',()=>{
  const code='a'.repeat(32);
  assert.equal(mobileWebsiteUrl('192.168.1.25',{protocol:'http:',port:'5173'},code),`http://192.168.1.25:5173/mobile?room=${code}`);
  assert.equal(mobileWebsiteUrl('game.example.com',{protocol:'https:',port:''},code),`https://game.example.com/mobile?room=${code}`);
  assert.equal(mobileWebsiteUrl('[2001:db8::1]',{protocol:'http:',port:'5174'},code),`http://[2001:db8::1]:5174/mobile?room=${code}`);
  for(const invalid of ['','http://192.168.1.25','192.168.1.25:5173','example.com/other','a@b','999.999.999.999']){
    assert.equal(mobileWebsiteUrl(invalid,{protocol:'http:',port:'5173'},code),null);
  }
  assert.equal(mobileWebsiteUrl('example.com',{protocol:'javascript:',port:''},code),null);
  for(const invalid of ['', 'invalid', `${code}&room=other`]){
    assert.equal(mobileWebsiteUrl('192.168.1.25',{protocol:'http:',port:'5173'},invalid),null);
  }
  for(const address of ['localhost','LOCALHOST.','127.0.0.1','127.0.0.2','[::1]','0.0.0.0'])assert(isLoopbackAddress(address));
  assert(!isLoopbackAddress('192.168.1.25'));
});

test('generated QR codes decode to the exact mobile room link',async()=>{
  for(const address of ['192.168.1.25','10.91.14.74','[2001:db8::1]']){
    const url=mobileWebsiteUrl(address,{protocol:'http:',port:'5173'},'a'.repeat(32));
    const qr=QRCode.create(url,{errorCorrectionLevel:'M'});
    const scale=6,margin=4,size=(qr.modules.size+margin*2)*scale;
    const pixels=new Uint8ClampedArray(size*size*4).fill(255);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const row=Math.floor(y/scale)-margin,column=Math.floor(x/scale)-margin;
      if(row<0||column<0||row>=qr.modules.size||column>=qr.modules.size||!qr.modules.get(row,column))continue;
      const offset=(y*size+x)*4;
      pixels[offset]=0x17;pixels[offset+1]=0x21;pixels[offset+2]=0x3d;
    }
    assert.equal(jsQR(pixels,size,size)?.data,url);
    assert.match(await QRCode.toDataURL(url,{width:256,margin:4,errorCorrectionLevel:'M'}),/^data:image\/png;base64,/);
  }
});
