import type {Game} from './game';

// Keep older activity data readable after the interface language changes.
const labels:Record<string,string>={
  '\u57fa\u7840 UNO':'Normal UNO','\u76f2\u624b\u724c':'Hidden cards',
  '\u81ea\u613f\u63d0\u95ee\u4ea4\u6d41':'Optional questions','\u8d60\u9001':'Give a card','\u4ea4\u6362':'Swap cards',
  '\u666e\u901a\u51fa\u724c':'Play a card','\u62bd\u4e00\u5f20':'Draw 1','\u7981\u724c':'Skip','\u52a0\u4e8c':'Draw 2','\u52a0\u56db':'Draw 4','\u53cd\u8f6c':'Reverse','\u5b8c\u6210\uff0fpass':'Finish turn',
  '\u73a9\u4e00\u5c40\u6e38\u620f':'Play a game','\u51fa\u53bb\u8fd0\u52a8':'Play a sport','\u542c\u6b4c\u6216\u521b\u4f5c':'Enjoy music or art','\u63a2\u7d22\u4e00\u5bb6\u5c0f\u5e97':'Try a new cafe',
  '\u684c\u6e38\u6216\u7535\u5b50\u6e38\u620f':'Play a board or video game','\u8f7b\u677e\u7684\u6237\u5916\u6d3b\u52a8':'Do something outdoors','\u97f3\u4e50\u6216\u521b\u610f\u6d3b\u52a8':'Make music or art','\u4e00\u8d77\u5403\u70b9\u4e1c\u897f':'Have some food together',
  '\u6700\u8fd1\u73a9\u7684\u6e38\u620f':'Games you like','\u559c\u6b22\u7684\u8fd0\u52a8':'Sports you like','\u559c\u6b22\u7684\u6b4c\u6216\u4f5c\u54c1':'Music or art you like','\u6821\u56ed\u9644\u8fd1\u7684\u7f8e\u98df':'Food near campus',
};
const demoNames:Record<string,string>={'\u5c0f\u6797':'Alex','\u5c0f\u9648':'Sam','\u5c0f\u5468':'Mia'};
const patterns:[RegExp,(...s:string[])=>string][]=[
  [/^\u6f14\u793a\u6d3b\u52a8\u5df2\u521b\u5efa\uff0cA \u684c\u6709\u56db\u4f4d\u793a\u4f8b\u73a9\u5bb6\u3002$/,()=> 'Demo ready. Four example players are at Table A.'],
  [/^\u6d3b\u52a8\u5df2\u521b\u5efa\uff0c\u7b49\u5f85\u5b66\u751f\u9009\u62e9\u684c\u4f4d\u3002$/,()=> 'Activity ready. Players can choose their seats.'],
  [/^(.*?)\u7b2c (\d+) \u8f6e\u5b8c\u6210\uff0c\u8fdb\u5165(.*?)\u3002$/, (t,r,p)=>`${t}: round ${r} is done. ${p==='\u8336\u6b47'?'Tea break':'Round break'}.`],
  [/^(.*?)\u7b2c (\d+) \u8f6e\u5f00\u59cb\uff1a(.*?)\u3002$/, (t,r,rule)=>`${t}: round ${r} started. Rule: ${rule}.`],
  [/^(.*?)\u7533\u8bf7\u52a0\u5165(.*?)\u3002$/, (p,t)=>`${p} asked to join ${t}.`],
  [/^(.*?)\u52a0\u5165(.*?)\u3002$/, (p,t)=>`${p} joined ${t}.`],
  [/^(.*?)\u81ea\u613f\u524d\u5f80(.*?)(\uff0c\u7b49\u5f85\u8f6e\u672b\u6216\u7a7a\u4f4d)?\u3002$/, (p,t,w)=>`${p} chose to move to ${t}${w?'. Waiting for a round break or a free seat':''}.`],
  [/^(.*?) · (.*?)\uff1a(.*?)\u3002$/, (t,p,a)=>`${t} · ${p}: ${a}.`],
  [/^(.*?)\u51fa\u5b8c\u624b\u724c\uff0c(.*?)\u7ed3\u675f\u3002$/, (p,t)=>`${p} has no cards left. ${t} has ended.`],
  [/^(.*?)\u6536\u5230\u4e00\u4e2a\u53ef\u9009\u95ee\u9898\uff1b\u6e38\u620f\u7ee7\u7eed\u3002$/, p=>`${p} has an optional question. Keep playing.`],
  [/^(.*?)\u6b63\u5728\u81ea\u7136\u4ea4\u8c08\uff0c\u5ef6\u540e\u624b\u73af\u66f4\u65b0\u3002$/, t=>`${t}: players are talking. Bands will update later.`],
  [/^(.*?)\u5df2\u5230\u5408\u9002\u505c\u987f\uff0c\u53ef\u4ee5\u66f4\u65b0\u53cd\u9988\u3002$/, t=>`${t}: this is a good break. Bands can update.`],
  [/^(.*?)\u516c\u5f00\u624b\u73af\u53cd\u9988\u5df2\u66f4\u65b0\u3002$/, t=>`${t}: bands updated on the shared screen.`],
  [/^(.*?)\u5c06\u5728\u672c\u8f6e\u7ed3\u675f\u540e\u8fdb\u5165\u8336\u6b47\u3002$/, t=>`${t}: tea break planned after this round.`],
  [/^(.*?)\u5f00\u59cb\u8336\u6b47\u3002$/, t=>`${t}: tea break started.`],
  [/^(.*?)\u6d3b\u52a8\u5df2\u7ed3\u675f\u3002$/, t=>`${t}: activity ended.`],
  [/^\u6d3b\u52a8\u7ed3\u675f\u3002\u4ea4\u53cb\u3001\u7ec4\u961f\u4e0e\u540e\u7eed\u4ea4\u6d41\u7531\u5b66\u751f\u81ea\u884c\u51b3\u5b9a\u3002$/,()=> 'Activity ended. Each player chooses whether to chat, form a group or leave.'],
  [/^(.*?)\u672c\u6b21\u95ee\u9898\u5df2\u8df3\u8fc7\uff0c\u4e0d\u589e\u52a0\u60e9\u7f5a\u3002$/, t=>`${t}: question skipped. No extra penalty.`],
  [/^(.*?)\u672c\u6b21\u95ee\u9898\u5df2\u5b8c\u6210\uff0c\u6e38\u620f\u7ee7\u7eed\u3002$/, t=>`${t}: question done. Keep playing.`],
  [/^(.*?)\u7533\u8bf7\u5728\u8fc7\u6e21\u70b9\u524d\u5f80(.*?)\u3002$/, (p,t)=>`${p} asked to move to ${t} at a break.`],
  [/^(.*?)\u5df2\u79bb\u684c\uff0c\u4ece\u884c\u52a8\u987a\u5e8f\u79fb\u9664\u3002$/, p=>`${p} left the table and the turn order.`],
];
function oldLabel(s:string){let text=labels[s]||s;text=text.replace(/([AB]) \u684c/g,'Table $1');for(const [old,name] of Object.entries(demoNames))text=text.replaceAll(old,name);return text;}
export function englishGame(g:Game):Game{
  for(const p of g.players)if(p.demo&&demoNames[p.name])p.name=demoNames[p.name];
  for(const t of g.tables){if(t.name===`${t.id} \u684c`)t.name=`Table ${t.id}`;t.rule=labels[t.rule]||t.rule;t.responses=t.responses.map(s=>labels[s]||s);if(t.winner&&demoNames[t.winner])t.winner=demoNames[t.winner];}
  g.log=g.log.map(entry=>{let text=entry.text;for(const [pattern,render] of patterns){const match=text.match(pattern);if(match){text=render(...match.slice(1).map(s=>oldLabel(s||'')));break;}}return {...entry,text};});
  return g;
}
