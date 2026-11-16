/* ---------- 住人と話す ---------- */
async function openNpc(id){
  const n=S.npc[id],d=DLG[id];
  if(id==='shop'){await say('shop',pick(d.greet));n.met=true;return openShop();}
  if(!n.met){n.met=true;await scene(d.meet.map(text=>({who:id,text})));n.talked=true;addPts(id,20);hint('town2','また話したり、贈り物をすると仲よくなれるよ');return;}
  const opts=['話す','贈り物'];
  if(id==='chloe'&&S.reno.state!==2)opts.push(S.reno.state===1?'工事のようす':'改築をたのむ');
  if(!n.live&&!n.pending&&!n.visit)opts.push('一緒に住もう');
  opts.push('またね');
  const k=await choose(id,`${heartStr(id)}`,opts,true);
  const o=opts[k];
  if(o==='話す')await talk(id);
  else if(o==='贈り物')await gift(id);
  else if(o==='改築をたのむ'||o==='工事のようす')await renovate();
  else if(o==='一緒に住もう')await invite(id);
}
async function talk(id){
  const n=S.npc[id],d=DLG[id];
  const other=id==='chloe'?'luu':'chloe';const ro=RT[other],ri=RT[id];
  if(S.flags.banterDay!==S.day&&S.npc[other].met&&ro&&!ro.hidden&&ro.map===ri.map&&near(ro.x,ro.y,ri.x,ri.y,5)&&DLG.banter&&DLG.banter.length){
    S.flags.banterDay=S.day;const sc=DLG.banter[S.flags.banterIdx%DLG.banter.length];S.flags.banterIdx++;ro.wait=6;
    await scene(sc);if(!n.talked){n.talked=true;addPts(id,20);}return;
  }
  let line;
  if(id==='chloe'&&S.reno.state===2&&!S.flags.renoTold){S.flags.renoTold=true;line=d.reno.done;}
  else if(id==='chloe'&&S.reno.state===1&&ri.map==='farm')line=d.reno.working;
  else if(n.live&&ri.map==='farm')line=d.farm[(S.day+n.tc)%d.farm.length];
  else{const h=hearts(id);const arr=d.daily[h>=4?'4':h>=2?'2':'0'];line=arr[(S.day*3+n.tc)%arr.length];}
  n.tc++;
  await say(id,line);
  if(!n.talked){n.talked=true;addPts(id,20);}
}
async function gift(id){
  const n=S.npc[id],d=DLG[id];
  if(n.gifted){await say(id,d.gift.already);return;}
  const item=await pickItem(`${d.name}に なにをあげる？`);
  if(!item)return;
  S.inv[item]--;const nm=ITEM_NAMES[item];const p=d.giftPrefs||{};
  const kind=(p.love||[]).includes(nm)?'love':(p.like||[]).includes(nm)?'like':(p.dislike||[]).includes(nm)?'dislike':'normal';
  n.gifted=true;addPts(id,{love:80,like:45,normal:20,dislike:-20}[kind]);updHud();
  await say(id,d.gift[kind]);
}
const freeRooms=()=>S.reno.state===2?S.rooms.filter(x=>!x).length:0;
async function invite(id){
  const n=S.npc[id],d=DLG[id];
  if(hearts(id)<INVITE_HEARTS){await say(id,d.invite.lowHearts);toast(`♥${INVITE_HEARTS}から誘えるよ（いま♥${hearts(id)}）`);return;}
  if(freeRooms()<=0){await say(id,d.invite.noRoom);toast('家を改築して部屋をふやそう（クロエの工房）');return;}
  // 街では「部屋を見に来て」まで。一緒に暮らす話は、次の朝に牧場で（runVisits）
  await scene(d.invite.visit||[{who:id,text:'あしたの朝、見に行くね。'}]);
  const ri=S.rooms.indexOf(null);S.rooms[ri]=id;n.pending=true;
  toast(`${d.name}が、あしたの朝 部屋を見に来る`);save();
}
// 次の朝：牧場で新しい部屋を見て、同居が始まる
async function runVisits(){
  let k=0;
  for(const id of['chloe','luu']){const n=S.npc[id];if(!n||!n.visit)continue;
    const r=RT[id],sp=[[5,6],[4,7]][k++]||[5,6];
    if(S.map!=='farm'){S.map='farm';P.x=3;P.y=6;}r.hidden=false;r.map='farm';r.x=sp[0];r.y=sp[1];r.path=[];r.task=null;r.act=null;
    faceTo(r,P.x,P.y);faceTo(P,r.x,r.y);
    await scene(DLG[id].cohabit);
    n.visit=false;n.live=true;r.wait=2;
    toast(`${DLG[id].name}と一緒に暮らしはじめた！ ${id==='luu'?'毎朝、畑に水をやってくれる':'畑の岩をくだいてくれる'}`);save();
  }
}
async function renovate(){
  const d=DLG.chloe.reno;
  if(S.reno.state===1){await say('chloe',d.working);return;}
  const offer=d.offer.replace('{cost}',RENO.cost).replace('{stone}',RENO.stone);
  const k=await choose('chloe',offer,[`たのむ（${RENO.cost}G・石${RENO.stone}）`,'やめる']);
  if(k!==0)return;
  if(S.money<RENO.cost||S.inv.stone<RENO.stone){await say('chloe',d.short);toast(`いま ${S.money}G・石${S.inv.stone}個`);return;}
  S.money-=RENO.cost;S.inv.stone-=RENO.stone;S.reno={state:1,days:RENO.days};updHud();
  await say('chloe',d.ordered);renderBase('farm');save();
}
const heartStr=id=>{const h=hearts(id);return`${DLG[id].name}　${'♥'.repeat(h)}${'♡'.repeat(Math.max(0,Math.max(INVITE_HEARTS,Math.min(MAX_HEARTS,h+2))-h))}`;};

/* ---------- 1日のおわりとはじまり ---------- */
async function sleep(passedOut){
  if(S.over)return;
  Q.length=0;P.path=[];P.task=null;
  const lines=[];
  // 出荷
  let pay=0,cnt=0;for(const k in S.ship){pay+=S.ship[k]*CROPS[k].sell;cnt+=S.ship[k];S.ship[k]=0;}
  // 作物
  for(let i=0;i<MW*MH;i++){const c=S.farm.crop[i];if(c&&!c.ready&&S.farm.wet[i]){c.d++;if(c.d>=CROPS[c.id].days)c.ready=true;}S.farm.wet[i]=0;}
  // 改築
  let renoDone=false;if(S.reno.state===1){S.reno.days--;if(S.reno.days<=0){S.reno.state=2;renoDone=true;}}
  // 部屋を見に来る（同居の場面は朝のカードのあと）
  for(const id of['chloe','luu']){const n=S.npc[id];if(n.pending){n.pending=false;n.visit=true;}}
  // 住人の毎日
  for(const id in S.npc){S.npc[id].talked=false;S.npc[id].gifted=false;}
  // 岩と花
  if(S.npc.chloe.live){let k=0;for(let t=0;t<40&&k<2;t++){const x=3+((Math.random()*10)|0),y=9+((Math.random()*11)|0),i=I(x,y);if(!S.farm.rock[i]&&!S.farm.soil[i]&&!S.farm.crop[i]&&!(y<=10&&(x===7||x===8))){S.farm.rock[i]=1;k++;}}fixRocks(S.farm);}
  S.farm.flower.fill(0);{let k=0;for(let t=0;t<60&&k<3;t++){const x=(Math.random()*MW)|0,y=(Math.random()*MH)|0;if(tile('farm',x,y)==='g'&&!(x===3&&y===6)){S.farm.flower[I(x,y)]=1;k++;}}}
  S.day++;S.time=DAY_START;S.stamina=passedOut?Math.round(S.maxSt*.7):S.maxSt;S.map='farm';P.x=3;P.y=6;P.dir=0;
  for(const id in RT){RT[id].hidden=true;RT[id].task=null;RT[id].path=[];RT[id].act=null;}
  if(pay){S.money+=pay;S.stats.earned+=pay;S.stats.shipped+=cnt;lines.push(`出荷のお金 ${pay}G が入った`);}
  if(passedOut)lines.unshift('つかれて眠ってしまった…（体力が少しへった）');
  if(renoDone){lines.push('家の増築ができた！部屋が2つふえた');}
  if(S.npc.luu.live)lines.push('ルゥが畑の水やりをしてくれる');
  if(S.npc.chloe.live)lines.push('クロエが畑の岩をくだいてくれる');
  renderBase('farm');
  if(S.day>SEASON_DAYS){S.over=true;save();return seasonEnd();}
  setFree(null);save();
  await dayCard(lines);
  await runVisits();
  if(S.day===2)hint('map','街へは下の「地図」から。住人と仲よくなろう');
}
async function passOut(){if(dlgOpen||modalOpen)return;await sleep(true);}

