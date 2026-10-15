// Participation log: who took part in each game, kept in this browser's localStorage only.
// Nothing is sent to a server. The team running a test exports it as CSV from the rules screen.

export type ParticipationRow={
  id:string;
  gameId:string;
  gameStartedAt:string;
  gameEndedAt:string;
  endReason:string;
  seat:string;
  name:string;
  email:string;
  guest:boolean;
  joinedAt:string;
  leftAt:string;
  answered:number;
  skipped:number;
};

const STORAGE_KEY='icebreaker-uno-participation-log';

const COLUMNS:[keyof ParticipationRow,string][]=[
  ['gameId','Game ID'],
  ['gameStartedAt','Game started'],
  ['gameEndedAt','Game ended'],
  ['endReason','End reason'],
  ['seat','Seat'],
  ['name','Name'],
  ['email','Email'],
  ['guest','Guest'],
  ['joinedAt','Joined'],
  ['leftAt','Left early'],
  ['answered','Questions answered'],
  ['skipped','Questions skipped'],
];

// Storage can be unavailable (private windows, blocked site data), so every access is guarded
// and the game keeps working without a log.
export function readLog():ParticipationRow[]{
  try{
    const raw=window.localStorage.getItem(STORAGE_KEY);
    const rows=raw?JSON.parse(raw):[];
    return Array.isArray(rows)?rows:[];
  }catch{
    return [];
  }
}

function writeLog(rows:ParticipationRow[]){
  try{
    window.localStorage.setItem(STORAGE_KEY,JSON.stringify(rows));
  }catch{
    // Storage full or blocked: skip logging rather than interrupt the game.
  }
}

// Inserts new rows and replaces rows with the same id, so a game's rows can be saved as it goes.
export function saveRows(rows:ParticipationRow[]){
  if(!rows.length)return;
  const byId=new Map(readLog().map(row=>[row.id,row]));
  rows.forEach(row=>byId.set(row.id,row));
  writeLog([...byId.values()]);
}

export function clearLog(){
  try{
    window.localStorage.removeItem(STORAGE_KEY);
  }catch{
    // Nothing to clear if storage is unavailable.
  }
}

function csvCell(value:string|number|boolean){
  const text=typeof value==='boolean'?(value?'yes':'no'):String(value);
  return /[",\n\r]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;
}

// A row without an end time belongs to a game that is still running, or whose page was closed
// or refreshed before it ended; say so instead of leaving the end reason blank.
function withEndReason(row:ParticipationRow):ParticipationRow{
  return row.gameEndedAt?row:{...row,endReason:'Not finished (still playing, or page closed)'};
}

export function downloadCsv(rows:ParticipationRow[]){
  const lines=[COLUMNS.map(([,header])=>header).join(','),...rows.map(withEndReason).map(row=>COLUMNS.map(([key])=>csvCell(row[key])).join(','))];
  // The byte-order mark makes Excel read non-English names correctly.
  const blob=new Blob(['﻿'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;
  link.download=`icebreaker-participants-${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
