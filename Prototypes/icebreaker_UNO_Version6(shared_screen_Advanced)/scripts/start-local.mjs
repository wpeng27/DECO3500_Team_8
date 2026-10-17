import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {getLanAddresses} from './lan-addresses.mjs';

const cli=new URL('../node_modules/wrangler/bin/wrangler.js',import.meta.url);
const options=process.argv.slice(2);
const hasOption=name=>options.some(option=>option===name||option.startsWith(`${name}=`));
// Detect at every launch, rather than baking this PC's IP into the build.
const child=spawn(process.execPath,[...process.execArgv,fileURLToPath(cli),'dev','--config','dist/server/wrangler.json',
  '--local',...(!hasOption('--persist-to')?['--persist-to','.wrangler/state']:[]),
  ...(!hasOption('--ip')?['--ip','0.0.0.0']:[]),'--inspector-port','0',
  '--var',`MOBILE_LAN_ADDRESSES:${JSON.stringify(getLanAddresses())}`,...options],
  {stdio:'inherit',windowsHide:true});
child.on('error',error=>{console.error(error.message);process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??1;});
process.on('SIGINT',()=>child.kill('SIGINT'));
process.on('SIGTERM',()=>child.kill('SIGTERM'));
