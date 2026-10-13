export const INTERESTS=[{id:'games',label:'Games',symbol:'G',color:'#7565F6'},{id:'sport',label:'Sport',symbol:'S',color:'#11A78D'},{id:'art',label:'Music & art',symbol:'A',color:'#E35675'},{id:'food',label:'Food & places',symbol:'F',color:'#E5A037'}];
function hexToRgb(hex:string):[number,number,number]{const n=parseInt(hex.slice(1),16);return [n>>16&255,n>>8&255,n&255]}
function rgbToHex(r:number,g:number,b:number){return '#'+[r,g,b].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('')}
export function blendInterestColor(tags:string[]):string{const cols=tags.map(t=>INTERESTS.find(i=>i.id===t)?.color).filter((c):c is string=>!!c);if(!cols.length)return '#8893a8';const sum=cols.reduce((acc,hex)=>{const [r,g,b]=hexToRgb(hex);return [acc[0]+r,acc[1]+g,acc[2]+b]},[0,0,0]);return rgbToHex(sum[0]/cols.length,sum[1]/cols.length,sum[2]/cols.length)}
// Question bank for the shared-screen game (10 questions, 4 options each).
// `topic` is a short label shown on the result panel when two players share only one question.
// `complementary` questions count different answers as a match: a team needs people who pick up different tasks.
// `tags` are only read by the earlier server version (app/api/game/route.ts); a null tag would mark an opt-out option.
export const QUESTIONS=[
  {topic:'Starting early',
    text:"It's 3 weeks before a group assignment is due. Usually, you've…",
    options:["Already started a draft","Made a plan but not started","Not started — I work best close to deadlines","Depends on the course"],
    tags:['games','sport','art','food']},
  {topic:'Preferred role',
    complementary:true,
    text:"In a group project, which task would you happily pick up first?",
    options:["Building / coding","Research & writing","Visual design","Presenting & coordinating"],
    tags:['games','sport','art','food']},
  {topic:'Working hours',
    text:"When do you usually get uni work done?",
    options:["Mornings","Afternoons","Evenings","Late night"],
    tags:['games','sport','art','food']},
  {topic:'Communication',
    text:"How do you prefer your group to communicate?",
    options:["Group chat, reply anytime","One scheduled meeting a week","Mostly face-to-face in tutorials","Shared doc, minimal chatting"],
    tags:['games','sport','art','food']},
  {topic:'Course goals',
    text:"What's your main goal for this course?",
    options:["Aiming for a 7","Learn well, grade comes second","Just pass comfortably","Pick up one specific skill"],
    tags:['games','sport','art','food']},
  {topic:'Unresponsive teammate',
    text:"A teammate hasn't replied for 2 days and a deadline is close. You would…",
    options:["Message them privately","Raise it in the group chat","Quietly cover their part","Let the tutor know"],
    tags:['games','sport','art','food']},
  {topic:'First tutorial',
    text:"In your first tutorial, you'd most like to…",
    options:["Start the conversation myself","Join in once someone else starts","Listen first, talk later","Chat online before meeting in person"],
    tags:['games','sport','art','food']},
  {topic:'Splitting work',
    text:"Your group needs to split up the work. You'd prefer to…",
    options:["Each take one section and own it","Work on everything together","Have one person assign the tasks","Pair up and split into halves"],
    tags:['games','sport','art','food']},
  {topic:'Before a deadline',
    text:"It's the night before the deadline and your part is about 80% done. You'd most likely…",
    options:["Submit it — good enough is fine","Keep polishing until it feels right","Send it to the group for feedback first","Depends on how much it's worth"],
    tags:['games','sport','art','food']},
  {topic:'Feedback',
    text:"If a teammate found problems in your part, how would you like to hear about it?",
    options:["Tell me directly, straight to the point","Mention the good parts first, then the issues","Leave comments in the shared doc","Tell me privately, not in front of the group"],
    tags:['games','sport','art','food']},
];
// A null tag marks an opt-out answer such as 'Prefer not to answer': it never counts as a match.
export const isOptOut=(question:number,option:number)=>QUESTIONS[question]?.tags[option]===null;
// Two answers to the same question match when they are the same, or different on a complementary question.
export const isMatch=(question:number,a:number,b:number)=>QUESTIONS[question]?.complementary?a!==b:a===b;
export const RULES=['Normal UNO','Hidden cards','Pick a player','Give a card','Swap cards'];
export type Player={id:string;tokenHash:string;name:string;guest:boolean;demo:boolean;tags:string[];category:string;bandColor:string;tableId:string;status:'seated'|'waiting'|'left';hand:number;score:number|null;visibleScore:number|null;pending:boolean;moveTo?:string;lastMatch:{at:number;withName:string}|null};
export type Prompt={id:string;originalTarget:string;target:string;question:number;status:'open'|'answered'|'passed'|'expired';invited:boolean;createdRound:number};
export type Table={id:string;name:string;capacity:number;phase:'lobby'|'playing'|'transition'|'tea'|'ended';round:number;direction:1|-1;current:string|null;done:string[];promptUsed:boolean;prompt:Prompt|null;rule:string;conversation:boolean;teaRequested:boolean;responses:string[];winner:string|null};
export type Game={code:string;hostHash:string;players:Player[];tables:Table[];createdAt:number;expiresAt:number;recent:string[];log:{text:string;time:number}[];ended:boolean};
export function fail(s:string):never{throw Error(s)}
export function tableOf(g:Game,id:string){return g.tables.find(t=>t.id===id)||fail('Table not found.')}
export function seated(g:Game,t:Table){return g.players.filter(p=>p.tableId===t.id&&p.status==='seated')}
export function addLog(g:Game,text:string){g.log.unshift({text,time:Date.now()});g.log=g.log.slice(0,18)}
export function recalculate(g:Game,t:Table,immediate=false){const ps=seated(g,t).filter(p=>!p.guest);for(const p of ps){const peers=ps.filter(q=>q.id!==p.id);p.score=peers.length?Math.round(peers.reduce((sum,q)=>{const u=new Set([...p.tags,...q.tags]);return sum+(u.size?p.tags.filter(tag=>q.tags.includes(tag)).length/u.size:0)},0)/peers.length*100):null;p.pending=!immediate;if(immediate)p.visibleScore=p.score}}
export function flush(g:Game,t:Table){if(t.conversation)return;for(const p of seated(g,t)){p.visibleScore=p.score;p.pending=false}}
export function newGame(code:string,hostHash:string,demo=false):Game{const now=Date.now();const g:Game={code,hostHash,players:[],tables:['A','B'].map(id=>({id,name:`Table ${id}`,capacity:6,phase:'lobby',round:1,direction:1,current:null,done:[],promptUsed:false,prompt:null,rule:RULES[0],conversation:false,teaRequested:false,responses:[],winner:null})),createdAt:now,expiresAt:now+6*3600000,recent:[],log:[],ended:false};if(demo)['Alex','Sam','Mia','Guest'].forEach((name,i)=>{const tags=i===3?[]:[INTERESTS[i].id,INTERESTS[(i+1)%4].id];g.players.push({id:`demo-${i}`,tokenHash:'',name,guest:i===3,demo:true,tags,category:i===3?'guest':INTERESTS[i].id,bandColor:blendInterestColor(tags),tableId:'A',status:'seated',hand:7,score:null,visibleScore:null,pending:false,lastMatch:null})});recalculate(g,tableOf(g,'A'),true);addLog(g,demo?'Demo ready. Four example players are at Table A.':'Activity ready. Players can choose their seats.');return g}
function closePrompt(t:Table,status:'passed'|'expired'){if(t.prompt?.status==='open')t.prompt.status=status}
function nextPlayer(g:Game,t:Table,from:string,skip?:string){const ps=seated(g,t);if(!ps.length){t.current=null;return}const idx=Math.max(0,ps.findIndex(p=>p.id===from));for(let step=1;step<=ps.length;step++){const p=ps[(idx+t.direction*step+ps.length*2)%ps.length];if(p.id!==skip){t.current=p.id;return}}t.current=ps[0].id}
function finishRound(g:Game,t:Table){if(t.phase!=='playing')return;const ps=seated(g,t);if(ps.length&&ps.every(p=>t.done.includes(p.id))){t.phase=t.teaRequested?'tea':'transition';t.teaRequested=false;addLog(g,`${t.name}: round ${t.round} is done. ${t.phase==='tea'?'Tea break':'Round break'}.`)}else if(!ps.length){t.phase='lobby';t.current=null}}
function activateQueue(g:Game,t:Table){for(const p of g.players.filter(p=>p.tableId===t.id&&p.status==='waiting'))if(seated(g,t).length<t.capacity){p.status='seated';addLog(g,`${p.name} joined ${t.name}.`)}}
export function publicGame(g:Game,ownId?:string,host=false){return {...g,hostHash:undefined,recent:undefined,players:g.players.map(p=>({...p,tokenHash:undefined,tags:host||p.id===ownId?p.tags:undefined,score:host||p.id===ownId?p.score:undefined,lastMatch:host||p.id===ownId?p.lastMatch:undefined})),ownId:ownId||null,isHost:host}}
export function mutate(g:Game,b:any,auth:{host:boolean;ownId?:string}){
const kind=String(b.kind||'');const t=b.tableId?tableOf(g,String(b.tableId)):undefined;const host=()=>{if(!auth.host)fail('Only the host can do this.')};const player=()=>{const id=auth.ownId||(auth.host?b.playerId:undefined);const p=g.players.find(p=>p.id===id);const screenAnswer=auth.host&&b.boardConsent===true&&['answer','pass_question','defer','change_question','invite','decline_invitation'].includes(kind);if(!p||(!auth.ownId&&!(auth.host&&p.demo)&&!screenAnswer))fail('Use your own player view or choose a demo player.');return p};if(g.ended)fail('This activity has ended.');
if(kind==='join'){if(!t||t.phase==='ended')fail('This table has ended. Choose another table.');const name=String(b.name||'').trim().slice(0,20);if(!name)fail('Please enter a name.');const tags=Array.isArray(b.tags)?[...new Set(b.tags)].filter(x=>INTERESTS.some(i=>i.id===x)) as string[]:[];const guest=b.guest===true;if(!guest&&!b.consent)fail('Please read and agree to how your interests are used.');if(!guest&&!tags.length)fail('Choose at least 1 interest.');if(g.players.filter(p=>p.status!=='left').length>=24)fail('This activity is full. Please ask the host.');g.players.push({id:b.newId,tokenHash:b.tokenHash,name,guest,demo:false,tags:guest?[]:tags,category:guest?'guest':tags[0],bandColor:blendInterestColor(guest?[]:tags),tableId:t.id,status:t.phase==='lobby'&&seated(g,t).length<t.capacity?'seated':'waiting',hand:7,score:null,visibleScore:null,pending:false,lastMatch:null});recalculate(g,t,t.phase==='lobby');addLog(g,`${name} asked to join ${t.name}.`);return}
if(['start','next_round','resume'].includes(kind)){host();if(!t||!['lobby','transition','tea'].includes(t.phase))fail('Start before play, after a round or after a tea break.');activateQueue(g,t);for(const p of [...seated(g,t)])if(p.moveTo){const dest=tableOf(g,p.moveTo);if(dest.phase!=='ended'&&seated(g,dest).length<dest.capacity){p.tableId=dest.id;p.moveTo=undefined;p.status=['lobby','transition','tea'].includes(dest.phase)?'seated':'waiting';recalculate(g,dest,dest.phase==='lobby');addLog(g,`${p.name} chose to move to ${dest.name}.`)}}const ps=seated(g,t);if(ps.length<2)fail('At least 2 players must join this table.');const first=t.phase==='lobby';t.responses=[];if(!first)t.round++;recalculate(g,t,first);flush(g,t);t.done=[];t.promptUsed=false;if(t.prompt?.status!=='open')t.prompt=null;t.current=first?ps[0].id:(ps.find(p=>p.id===t.current)?.id||ps[0].id);t.phase='playing';if(b.rule&&RULES.includes(b.rule))t.rule=b.rule;addLog(g,`${t.name}: round ${t.round} started. Rule: ${t.rule}.`);return}
if(kind==='event'){host();if(!t||t.phase!=='playing'||!t.current)fail('Start the table or start the next round first.');const ps=seated(g,t);const actor=ps.find(p=>p.id===t.current)!;const e=String(b.event||'');if(!['play','draw','skip','draw2','draw4','reverse','pass'].includes(e))fail('This card action is not available.');if(t.prompt?.originalTarget===actor.id)closePrompt(t,'expired');const idx=ps.indexOf(actor);const affected=ps[(idx+t.direction+ps.length)%ps.length];if(['play','skip','draw2','draw4','reverse'].includes(e))actor.hand=Math.max(0,actor.hand-1);if(e==='draw')actor.hand++;t.done=[...new Set([...t.done,actor.id])];const labels:any={play:'Play a card',draw:'Draw 1',skip:'Skip',draw2:'Draw 2',draw4:'Draw 4',reverse:'Reverse',pass:'Finish turn'};addLog(g,`${t.name} · ${actor.name}: ${labels[e]}.`);if(actor.hand===0){t.phase='ended';t.winner=actor.name;t.current=null;closePrompt(t,'expired');addLog(g,`${actor.name} has no cards left. ${t.name} has ended.`);return}const skip=['skip','draw2','draw4'].includes(e)?affected.id:undefined;if(skip){t.done=[...new Set([...t.done,skip])];if(e==='draw2')affected.hand+=2;if(e==='draw4')affected.hand+=4;if(!t.promptUsed&&t.prompt?.status!=='open'){t.promptUsed=true;t.prompt={id:crypto.randomUUID(),originalTarget:affected.id,target:affected.id,question:(t.round-1)%QUESTIONS.length,status:'open',invited:false,createdRound:t.round};addLog(g,`${affected.name} has an optional question. Keep playing.`)}}if(e==='reverse')t.direction=t.direction===1?-1:1;nextPlayer(g,t,actor.id,skip);finishRound(g,t);return}
if(kind==='hand'){host();if(!t)fail('Choose a table.');const p=seated(g,t).find(p=>p.id===b.targetId);if(!p)fail('This player has not joined the table.');const n=Number(b.hand);if(!Number.isInteger(n)||n<0||n>60)fail('Enter a card count from 0 to 60.');p.hand=n;if(n===0){t.phase='ended';t.winner=p.name;t.current=null;closePrompt(t,'expired')}return}
if(kind==='conversation'){host();if(!t)fail('Choose a table.');t.conversation=b.value===true;addLog(g,`${t.name}: ${t.conversation?'players are talking. Bands will update later':'this is a good break. Bands can update'}.`);return}
if(kind==='feedback'){host();if(!t||!['transition','tea','lobby'].includes(t.phase))fail('Update bands before play, after a round or during a tea break.');if(t.conversation)fail('Players are talking. Wait for the next break.');flush(g,t);addLog(g,`${t.name}: bands updated on the shared screen.`);return}
if(kind==='tea'){host();if(!t||t.phase==='ended')fail('This table has ended.');if(t.phase==='playing'){t.teaRequested=true;addLog(g,`${t.name}: tea break planned after this round.`)}else{t.phase='tea';addLog(g,`${t.name}: tea break started.`)}return}
if(kind==='end_table'){host();if(!t)fail('Choose a table.');t.phase='ended';t.current=null;closePrompt(t,'expired');addLog(g,`${t.name}: activity ended.`);return}
if(kind==='end'){host();for(const tb of g.tables){tb.phase='ended';tb.current=null;closePrompt(tb,'expired')}g.ended=true;addLog(g,'Activity ended. Each player chooses whether to chat, form a group or leave.');return}
if(['answer','pass_question','defer','change_question','invite','decline_invitation'].includes(kind)){const p=player();const tb=tableOf(g,p.tableId);const q=tb.prompt;if(!q||q.id!==b.promptId||q.status!=='open')fail('This question has closed. Keep playing.');if(q.target!==p.id)fail('This question is for another player.');if(kind==='defer')return;if(kind==='change_question'){q.question=(q.question+1)%QUESTIONS.length;return}if(kind==='pass_question'||kind==='decline_invitation'){q.status='passed';addLog(g,`${tb.name}: question skipped. No extra penalty.`);return}if(kind==='invite'){const invited=seated(g,tb).find(x=>x.id===b.targetId&&x.id!==p.id);if(!invited)fail('Choose another player at this table.');q.target=invited.id;q.invited=true;return}const option=Number(b.option);if(!Number.isInteger(option)||option<0||option>3)fail('Choose an answer.');if(!p.guest&&!isOptOut(q.question,option)){const question=QUESTIONS[q.question];const chosenTag=question.tags[option] as string;const matched=seated(g,tb).filter(o=>o.id!==p.id&&!o.guest&&o.tags.includes(chosenTag));p.tags=[...new Set([...p.tags,chosenTag])];p.bandColor=blendInterestColor(p.tags);if(matched.length){const now=Date.now();p.lastMatch={at:now,withName:matched.map(m=>m.name).join(' & ')};for(const m of matched)m.lastMatch={at:now,withName:p.name};addLog(g,`${p.name} and ${matched.map(m=>m.name).join(', ')} both like ${INTERESTS.find(i=>i.id===chosenTag)?.label}.`)}if(b.share===true)tb.responses.push(question.options[option]);recalculate(g,tb)}q.status='answered';addLog(g,`${tb.name}: question done. Keep playing.`);return}
if(kind==='move'){const p=player();const source=tableOf(g,p.tableId),dest=tableOf(g,String(b.destination));if(p.status==='left'||dest.id===p.tableId||dest.phase==='ended')fail('Choose another open table.');if(p.status==='waiting'||['lobby','transition','tea'].includes(source.phase)){p.tableId=dest.id;p.moveTo=undefined;p.status=['lobby','transition','tea'].includes(dest.phase)&&seated(g,dest).length<dest.capacity?'seated':'waiting';recalculate(g,source,source.phase==='lobby');recalculate(g,dest,dest.phase==='lobby');addLog(g,`${p.name} chose ${dest.name}${p.status==='waiting'?'. Waiting for a round break or a free seat':''}.`)}else{p.moveTo=dest.id;addLog(g,`${p.name} asked to move to ${dest.name} at a break.`)}return}
if(kind==='leave'){const p=player();const tb=tableOf(g,p.tableId);const wasCurrent=tb.current===p.id;if(wasCurrent)nextPlayer(g,tb,p.id);p.status='left';p.moveTo=undefined;if(tb.prompt?.target===p.id||tb.prompt?.originalTarget===p.id)closePrompt(tb,'expired');recalculate(g,tb);finishRound(g,tb);addLog(g,`${p.name} left the table and the turn order.`);return}
fail('This action is not available.')}
