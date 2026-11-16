/* ---------- 上の文字と下の道具の列 ---------- */
const el={date:$('#date'),clock:$('#clock'),money:$('#money'),st:$('#stbar'),hot:$('#hotbar')};
let lastClock='';
function clockStr(t){const m=Math.floor(t/10)*10;const h=Math.floor(m/60)%24,mi=m%60;return`${h}:${String(mi).padStart(2,'0')}`;}
function updHud(){
  el.date.textContent=`春 ${S.day}日（${DOW[(S.day-1)%7]}）`;
  el.money.textContent=S.money;el.st.style.width=(S.stamina/S.maxSt*100)+'%';
  // ホットバー：道具 → 種
  if(!el.hot.children.length){
    HOTBAR().forEach((k,n)=>{const b=document.createElement('button');b.className='slot'+(CROPS[k]&&!CROPS[HOTBAR()[n-1]]?' gap':'');b.dataset.k=k;
      b.innerHTML=`<img alt="" src="${HICON[k]}"><span>${TOOLS[k]?TOOLS[k].name:CROPS[k].name}</span>${CROPS[k]?'<b></b>':''}`;
      b.onclick=()=>{if(!S)return;S.hand=k;updHud();if(CROPS[k]&&!S.seeds[k])toast(`${CROPS[k].name}の種は街の種屋で買えるよ`);};el.hot.appendChild(b);});
  }
  for(const b of el.hot.children){const k=b.dataset.k;b.setAttribute('aria-pressed',S.hand===k?'true':'false');
    if(CROPS[k]){b.querySelector('b').textContent=S.seeds[k];b.classList.toggle('empty',!S.seeds[k]);}}
}
function updClock(){const c=clockStr(S.time);if(c!==lastClock){lastClock=c;el.clock.textContent=c;}}

/* ---------- ふきだし ---------- */
const D={box:$('#dlg'),face:$('#face'),name:$('#dname'),text:$('#dtext'),opts:$('#dopts'),next:$('#dnext')};
const fctx=D.face.getContext('2d');
let dlgOpen=false,modalOpen=false,fading=false;
const busy=()=>dlgOpen||modalOpen||fading||!started||S.over;
function setSpeaker(who){
  if(!who||who==='narr'){D.box.classList.add('noface');D.name.textContent='';return;}
  D.box.classList.remove('noface');
  const id=who==='player'?'player':who;D.name.textContent=who==='player'?DLG.player.name:(DLG[who]?DLG[who].name:who);
  fctx.clearRect(0,0,16,16);fctx.imageSmoothingEnabled=false;const fsp=SPR[id][0][0];fctx.drawImage(fsp,fsp.ox||0,(SPR[id].faceY||0)+(fsp.oy||0),16,16,0,1,16,16);
}
let typing=null;
function typeText(text){
  return new Promise(res=>{D.text.textContent='';let i=0;const full=text||'';
    const step=()=>{i+=2;D.text.textContent=full.slice(0,i);if(i<full.length)typing=setTimeout(step,30);else{typing=null;res();}};
    typing=setTimeout(step,10);D.box._skip=()=>{if(typing){clearTimeout(typing);typing=null;D.text.textContent=full;res();}};});
}
function waitTap(){return new Promise(res=>{D.next.hidden=false;D.box._tap=()=>{D.box._tap=null;D.next.hidden=true;res();};});}
D.box.addEventListener('click',e=>{if(e.target.closest('#dopts'))return;if(typing&&D.box._skip){D.box._skip();return;}if(D.box._tap)D.box._tap();});
async function say(who,text){dlgOpen=true;D.box.hidden=false;D.opts.hidden=true;setSpeaker(who);await typeText(text);await waitTap();D.box.hidden=true;dlgOpen=false;}
async function scene(lines){for(const l of lines)await say(l.who,l.text);}
function choose(who,text,opts,quick){
  return new Promise(async res=>{dlgOpen=true;D.box.hidden=false;setSpeaker(who);D.opts.hidden=true;D.next.hidden=true;
    if(quick)D.text.textContent=text||'';else await typeText(text||'');
    D.opts.innerHTML='';opts.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o;if(i===0)b.className='primary';b.onclick=()=>{D.box.hidden=true;D.opts.hidden=true;dlgOpen=false;res(i);};D.opts.appendChild(b);});
    D.opts.hidden=false;});
}

/* ---------- まど（店・出荷・かばん・地図・なかよし） ---------- */
const M={wrap:$('#modal'),panel:$('#panel')};
function openPanel(title,sub,build,onClose){
  modalOpen=true;M.wrap.hidden=false;
  const render=()=>{M.panel.innerHTML=`<h2>${title}<small>${typeof sub==='function'?sub():sub||''}</small></h2>`;const list=document.createElement('div');list.className='plist';M.panel.appendChild(list);build(list,render);
    const c=document.createElement('button');c.className='close';c.textContent='とじる';c.onclick=close;M.panel.appendChild(c);};
  const close=()=>{M.wrap.hidden=true;modalOpen=false;updHud();onClose&&onClose();};
  render();return close;
}
function row(list,icon,t1,t2,btns){const r=document.createElement('div');r.className='row';
  r.innerHTML=`${icon?`<img alt="" src="${icon}">`:'<span></span>'}<div class="t"><div>${t1}</div>${t2?`<div>${t2}</div>`:''}</div>`;
  const a=document.createElement('div');a.className='acts';(btns||[]).forEach(b=>{const e=document.createElement('button');e.className='pbtn'+(b.sub?' sub':'');e.textContent=b.t;e.disabled=!!b.off;e.onclick=b.f;a.appendChild(e);});r.appendChild(a);list.appendChild(r);return r;}
function openShop(){
  let bought=false;
  return new Promise(res=>{openPanel(shopTitle(),()=>`もちもの ${S.money}G`,(list,re)=>{
    for(const k in CROPS){const c=CROPS[k];
      row(list,ICON[k],`${c.name}の種　${c.seed}G`,`${c.days}日で育つ・売ると${c.sell}G${c.regrow?`・とったあと${c.regrow}日でまた実る`:''}・持っている ${S.seeds[k]}`,[
        {t:'1つ',off:S.money<c.seed,f:()=>{S.money-=c.seed;S.seeds[k]++;bought=true;re();}},
        {t:'5つ',sub:true,off:S.money<c.seed*5,f:()=>{S.money-=c.seed*5;S.seeds[k]+=5;bought=true;re();}}]);}
    const n=document.createElement('p');n.className='note';n.textContent='春の種だけ。お金は作物を出荷箱に入れると、次の朝に入るよ';list.appendChild(n);
  },async()=>{if(bought)await say('shop',DLG.shop.bought);res();});});
}
function openShip(){
  return new Promise(res=>{openPanel('出荷箱',()=>{let v=0;for(const k in S.ship)v+=S.ship[k]*CROPS[k].sell;return v?`あしたの朝 ${v}G`:'入れたものは次の朝にお金になる';},(list,re)=>{
    let any=false;
    for(const k in CROPS){if(!S.inv[k])continue;any=true;const c=CROPS[k];
      row(list,ICON[k],`${c.name}　×${S.inv[k]}`,`1つ ${c.sell}G`,[{t:'1つ',f:()=>{S.inv[k]--;S.ship[k]++;re();}},{t:'全部',sub:true,f:()=>{S.ship[k]+=S.inv[k];S.inv[k]=0;re();}}]);}
    if(!any){const n=document.createElement('p');n.className='note';n.textContent='出荷できる作物を持っていないよ。畑で育てて収穫しよう';list.appendChild(n);}
  },res);});
}
function openBag(){
  openPanel('かばん','',(list)=>{
    for(const k in TOOLS){const lv=(S.tools&&S.tools[k])||1;row(list,HICON[k],`${TOOLS[k].name}　${TOOL_LV[lv]||'Lv'+lv}`,'下の道具の列でえらんで使う。あとで強くできる（次の試作から）');}
    for(const k in ITEM_NAMES){if(!S.inv[k])continue;row(list,ICON[k],`${ITEM_NAMES[k]}　×${S.inv[k]}`,k==='stone'?'改築の材料（クロエの工房）':k==='flower'?'畑のまわりに毎朝さく':'出荷するか、住人にあげよう');}
    for(const k in CROPS){if(!S.seeds[k])continue;row(list,ICON[k],`${CROPS[k].name}の種　×${S.seeds[k]}`,'畑にまく');}
    if(!list.children.length){const n=document.createElement('p');n.className='note';n.textContent='からっぽ';list.appendChild(n);}
  });
}
function pickItem(title){
  return new Promise(res=>{let chosen=null;const close=openPanel(title,'',(list)=>{
    let any=false;for(const k in ITEM_NAMES){if(!S.inv[k])continue;any=true;row(list,ICON[k],`${ITEM_NAMES[k]}　×${S.inv[k]}`,'',[{t:'あげる',f:()=>{chosen=k;close();}}]);}
    if(!any){const n=document.createElement('p');n.className='note';n.textContent='あげられる物を持っていないよ。作物・石・野の花をあげられる';list.appendChild(n);}
  },()=>res(chosen));});
}
function openMap(){
  const go=(k,label)=>({t:'行く',f:async()=>{close();const[m,x,y]=SPOTS[k];await warp(m,x,y);toast(label);}});
  const close=openPanel('地図','行きたい所をタップ',(list)=>{
    row(list,null,'牧場','わたしの家・畑・出荷箱',[go('farmHome','牧場')]);
    row(list,null,'街の広場','噴水のまわり。ルゥがよく遊んでいる',[go('town','街の広場')]);
    row(list,null,'クロエの工房','改築の相談はここ（8時〜18時）',[go('workshop','クロエの工房')]);
    row(list,null,shopTitle(),'春の種を売っている（9時〜17時）',[go('shop','種屋')]);
  });
}
function openFriends(){
  const close=openPanel('なかよし','',(list)=>{
    for(const id of['chloe','luu']){const n=S.npc[id],d=DLG[id];const h=hearts(id);
      const st=n.live?'牧場で一緒に暮らしている':n.pending?'あしたの朝 部屋を見に来る':n.visit?'けさ 部屋を見に来る':!n.met?'まだ会っていない':h>=INVITE_HEARTS?'一緒に住もうと誘えそう':`♥${INVITE_HEARTS}になったら誘える`;
      const r=row(list,null,`${d.name}<span class="kind">　${id==='chloe'?'ドラゴン娘':'スライム娘'}</span>`,`<span class="hearts">${'♥'.repeat(h)}<i>${'♥'.repeat(MAX_HEARTS-h)}</i></span>　${st}`);
      const c=document.createElement('canvas');c.width=16;c.height=16;const g=c.getContext('2d');const sp=SPR[id][0][0];g.drawImage(sp,sp.ox||0,(SPR[id].faceY||0)+(sp.oy||0),16,16,0,1,16,16);r.replaceChild(c,r.firstChild);}
    const hs=S.reno.state===0?`改築：まだ（クロエに${RENO.cost}Gと石${RENO.stone}個）`:S.reno.state===1?`改築：工事中（あと${S.reno.days}日）`:`改築：完成・部屋 ${S.rooms.filter(Boolean).length}/${RENO.rooms}`;
    const n=document.createElement('p');n.className='note';n.innerHTML=`${hs}<br>話す（1日1回）と贈り物（1日1回）で仲よくなれる。${OTHERS.length?`<br>ほかの住人：${OTHERS.join('・')}（次の試作から）`:''}`;list.appendChild(n);
    const rb=document.createElement('button');rb.className='pbtn sub';rb.style.marginTop='8px';rb.textContent='最初からやり直す';let armed=false;
    rb.onclick=()=>{if(!armed){armed=true;rb.textContent='もう一度押すと、データを消して最初から';return;}clearSave();location.reload();};list.appendChild(rb);
  });
}
async function warp(m,x,y){
  Q.length=0;P.path=[];P.task=null;fading=true;const f=$('#fade');f.innerHTML='';f.classList.add('on');await wait(350);
  S.map=m;P.x=x;P.y=y;P.dir=0;setFree(null);await wait(120);f.classList.remove('on');await wait(300);fading=false;
  if(m==='town')hint('town','クロエは工房、ルゥは噴水のまわりにいるよ。タップで話せる');
}
async function dayCard(lines){
  fading=true;const f=$('#fade');f.innerHTML=`<div class="d">春 ${S.day}日（${DOW[(S.day-1)%7]}）</div><div class="l">${lines.join('<br>')}</div>`;f.classList.add('on');
  updHud();await wait(lines.length?1700+lines.length*500:1100);f.classList.remove('on');await wait(350);fading=false;
}
function seasonEnd(){
  const live=['chloe','luu'].filter(id=>S.npc[id].live).map(id=>DLG[id].name);
  modalOpen=true;M.wrap.hidden=false;
  M.panel.innerHTML=`<h2>春がおわった<small>試作1はここまで</small></h2><div class="plist">
  <div class="row"><span></span><div class="t"><div>出荷で ${S.stats.earned}G かせいだ</div><div>出荷した作物 ${S.stats.shipped}こ</div></div></div>
  <div class="row"><span></span><div class="t"><div>一緒に暮らす仲間：${live.length?live.join('・'):'まだいない'}</div><div>クロエ ♥${hearts('chloe')}・ルゥ ♥${hearts('luu')}</div></div></div></div>`;
  const b=document.createElement('button');b.className='close';b.textContent='もう一度 春から';b.onclick=()=>{clearSave();location.reload();};M.panel.appendChild(b);
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));

