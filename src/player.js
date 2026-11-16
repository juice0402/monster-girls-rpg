/* ---------- プレイヤーの作業 ---------- */
// 手に持っている物（item）でこのマスに何ができるか。文字列＝できる作業、{need}／{done}＝できない理由、null＝作業なし（歩く）
function canAct(x,y,item){
  if(S.map!=='farm')return null;const i=I(x,y),t=tile('farm',x,y);item=item||S.hand;
  if(S.farm.rock[i])return item==='pick'?'rock':{need:'岩はハンマーでくだこう'};
  if(S.farm.flower[i])return'flower';
  if(t!=='f')return null;
  const soil=S.farm.soil[i],c=S.farm.crop[i],wet=S.farm.wet[i];
  if(c&&c.ready)return'harvest';
  if(item==='hoe'&&!soil)return'till';
  if(item==='can'&&soil)return wet?{done:'ここは今日もう水をやったよ'}:'water';
  if(CROPS[item]&&soil&&!c)return S.seeds[item]>0?'plant':{need:`${CROPS[item].name}の種がない。街の種屋で買えるよ`};
  const need=!soil?'耕すならクワに持ちかえてね':!c?'種をえらぶと、ここにまけるよ':!wet?'水やりはじょうろに持ちかえてね':null;
  return need?{need}:null;
}
function queueField(x,y){
  const k=canAct(x,y,S.hand);
  if(!k)return false;
  if(typeof k==='object'){toast(k.need||k.done);return true;}
  if(Q.some(t=>t.kind==='field'&&t.x===x&&t.y===y)||(P.task&&P.task.kind==='field'&&P.task.x===x&&P.task.y===y))return true;
  if(Q.length>=12){toast('予約は12マスまで');return true;}
  Q.push({kind:'field',x,y,item:S.hand});return true;
}
function startTask(t){
  P.task=t;P.tries=(P.tries||0);
  let goal;
  if(t.kind==='walk')goal=(x,y)=>x===t.x&&y===t.y;
  else if(t.kind==='field'){const self=!blocked('farm',t.x,t.y);goal=(x,y)=>near(x,y,t.x,t.y,1)&&(self||!(x===t.x&&y===t.y));}
  else if(t.kind==='npc'){const r=RT[t.id];if(!r||r.hidden||r.map!==S.map){P.task=null;return;}const nx=Math.round(r.x),ny=Math.round(r.y);r.wait=5;goal=(x,y)=>near(x,y,nx,ny,1)&&!(x===nx&&y===ny);}
  else if(t.kind==='bld'){goal=(x,y)=>x===t.sx&&y===t.sy;}
  const res=bfs(S.map,Math.round(P.x),Math.round(P.y),goal);
  if(!res){if(t.kind!=='walk')toast('岩にふさがれて行けない。手前の岩からくだこう');P.task=null;return;}
  P.path=res.path;
}
function updPlayer(dt){
  if(P.act){P.act.t+=dt;if(P.act.t>=P.act.dur){const a=P.act;P.act=null;a.done();}return;}
  if(moveAlong(P,dt,P.speed))return;
  if(P.task){const t=P.task;P.task=null;arrive(t);return;}
  if(Q.length)startTask(Q.shift());
}
async function arrive(t){
  if(t.kind==='field'){faceTo(P,t.x,t.y);doField(t.x,t.y,t.item);}
  else if(t.kind==='npc'){const r=RT[t.id];if(r&&!r.hidden&&r.map===S.map&&near(Math.round(P.x),Math.round(P.y),Math.round(r.x),Math.round(r.y),1.5)){faceTo(P,r.x,r.y);faceTo(r,P.x,P.y);r.wait=2;P.tries=0;await openNpc(t.id);r.wait=1;}
    else if((P.tries=(P.tries||0)+1)<4)startTask(t);else P.tries=0;}
  else if(t.kind==='bld'){if(t.face)P.dir=t.face;await interact(t.id);}
}
function doField(x,y,item){
  item=item||S.hand;const k=canAct(x,y,item),i=I(x,y);
  if(!k||typeof k==='object')return;   // 予約のあいだに様子が変わった
  const need=k==='till'?COST.till:k==='water'?COST.water:k==='rock'?COST.rock:0;
  if(need&&S.stamina<need){toast('つかれて動けない…今日は家で休もう');Q.length=0;return;}
  const tool=TOOLS[item]&&(k==='till'||k==='water'||k==='rock')?item:null;
  P.act={t:0,dur:k==='rock'?.5:.28,tool,done:()=>{
    S.stamina-=need;
    if(k==='till'){S.farm.soil[i]=1;dust(x*TS+8,y*TS+10,'#8a5a35',5);hint('till','つぎは下の道具から種をえらんで、耕したマスをタップ');}
    else if(k==='plant'){S.seeds[item]--;S.farm.crop[i]={id:item,d:0,ready:false};hint('plant','じょうろに持ちかえて水やり。毎日やると育つよ');}
    else if(k==='water'){S.farm.wet[i]=1;splash(x*TS+8,y*TS+8);}
    else if(k==='harvest'){const c=S.farm.crop[i];S.inv[c.id]++;fxText(x*TS+8,y*TS,'+1 '+CROPS[c.id].name);const cd=CROPS[c.id];if(cd.regrow){c.d=cd.days-cd.regrow;c.ready=false;}else{S.farm.crop[i]=null;}hint('harvest','とれた作物は出荷箱へ。あげると喜ぶ住人もいるよ');}
    else if(k==='rock'){S.farm.rock[i]=0;S.inv.stone+=2;dust(x*TS+8,y*TS+8,'#9d978a',7);fxText(x*TS+8,y*TS,'+2 石');hint('rock','石は家の改築に使うよ。クロエの工房で相談しよう');}
    else if(k==='flower'){S.farm.flower[i]=0;S.inv.flower++;fxText(x*TS+8,y*TS,'+1 野の花');}
    updHud();
  }};
}

/* ---------- タップ ---------- */
const BLD={H:'home',A:'home',X:'ship',W:'workshop',S:'shop',a:'houseA',L:'houseL',c:'houseC',k:'anvil',O:'fountain',b:'bench',w:'pond',T:'tree'};
const STAND={home:{farm:[3,6,1]},ship:{farm:[12,6,1]},workshop:{town:[3,6,1]},shop:{town:[12,6,1]},houseA:{town:[2,21,1]},houseL:{town:[7,21,1]},houseC:{town:[12,21,1]}};
function onTap(cx,cy){
  if(busy())return;
  const wx=cx/view.sc+cam.x,wy=cy/view.sc+cam.y;const tx=Math.floor(wx/TS),ty=Math.floor(wy/TS);
  // 住人
  for(const id of Object.keys(RT)){const r=RT[id];if(r.hidden||r.map!==S.map)continue;
    if(wx>=r.x*TS-2&&wx<=r.x*TS+18&&wy>=r.y*TS-18&&wy<=r.y*TS+16){Q.length=0;interrupt();Q.push({kind:'npc',id});return;}}
  if(tx<0||ty<0||tx>=MW||ty>=MH)return;
  if(S.map==='farm'&&queueField(tx,ty)){mark(tx,ty);return;}
  const t=tile(S.map,tx,ty);const b=BLD[t];
  if(b&&b!=='tree'){
    Q.length=0;interrupt();
    const st=STAND[b]&&STAND[b][S.map];
    if(st)Q.push({kind:'bld',id:b,sx:st[0],sy:st[1],face:st[2]});
    else{const res=bfs(S.map,Math.round(P.x),Math.round(P.y),(x,y)=>DIRS.some(([dx,dy])=>x+dx===tx&&y+dy===ty));if(res){Q.push({kind:'bld',id:b,sx:res.end[0],sy:res.end[1]});}}
    return;
  }
  if(!blocked(S.map,tx,ty)){Q.length=0;interrupt();Q.push({kind:'walk',x:tx,y:ty});mark(tx,ty);}
}
function interrupt(){if(P.path.length>1)P.path=P.path.slice(0,1);P.task=null;}
let marks=[];function mark(x,y){marks.push({x,y,t:.5});}

/* ---------- 建物を調べる ---------- */
async function interact(id){
  if(id==='home'){
    const k=await choose(null,S.time>=1080?'もう夜。今日はもう休む？':'家に帰ってきた。寝て次の日にする？',['寝る','まだ外にいる']);
    if(k===0)await sleep(false);return;
  }
  if(id==='ship')return openShip();
  if(id==='workshop'){const r=RT.chloe;if(!r.hidden&&r.map==='town'&&near(r.x,r.y,3,6,3)){Q.push({kind:'npc',id:'chloe'});return;}toast('クロエの工房。いまは留守みたい（8時〜18時）');return;}
  if(id==='shop'){const r=RT.shop;if(!r.hidden&&r.map==='town'){Q.push({kind:'npc',id:'shop'});return;}toast(`${shopTitle()}。9時〜17時にあいてるよ`);return;}
  if(id==='houseL'){toast(RT.luu.hidden?'ルゥの家。中からぷるぷる…と寝息が聞こえる':'ルゥの家。いまは留守みたい');return;}
  if(id==='houseA'||id==='houseC'){const o=(DLG.others||[])[id==='houseA'?0:1];toast(o?`${o.place}。${o.name}に会えるのは次の試作から`:'まだ会っていない住人の家');return;}
  if(id==='anvil'){toast('クロエの金床。使いこまれて光っている');return;}
  if(id==='fountain'){toast('きれいな水がわく噴水。ルゥのお気に入りの場所');return;}
  if(id==='bench'){toast('ベンチでひと休み');return;}
  if(id==='pond'){toast('すんだ池。小さな魚が見える');return;}
}
let OTHERS=[];

