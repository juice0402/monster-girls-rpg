/* ---------- ループ ---------- */
let started=false,ff=1,last=performance.now(),saveT=0;
function update(dt){
  if(toastT>0){toastT-=dt;if(toastT<=0)toastEl.classList.add('off');}
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.life-=dt;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.life<=0)parts.splice(i,1);}
  for(let i=marks.length-1;i>=0;i--){marks[i].t-=dt;if(marks[i].t<=0)marks.splice(i,1);}
  if(busy())return;
  S.time+=dt*GMIN_PER_SEC*ff;
  if(S.time>=DAY_END){passOut();return;}
  if(S.time>=1320&&!S.flags['late'+S.day]){S.flags['late'+S.day]=1;toast('もう22時。そろそろ家に帰って寝よう');}
  updPlayer(dt);
  for(const id in RT)updNpc(id,dt);
  updClock();
  if((saveT+=dt)>20){saveT=0;save();}
}
function loop(now){const raw=(now-last)/1000,dt=Math.min(.05,raw);last=now;if(S)update(dt);const t0=performance.now();render();LIT.ms=(LIT.ms||0)*.95+(performance.now()-t0)*.05;watchSpeed(raw);LIT.fr=(LIT.fr||[]).slice(-59);LIT.fr.push(raw);requestAnimationFrame(loop);}

/* ---------- はじまり ---------- */
function initRT(){for(const id of['chloe','luu','shop']){RT[id]={map:'town',x:0,y:0,path:[],dir:0,anim:0,act:null,task:null,hidden:true,speed:id==='luu'?3.2:2.8,wait:0,idle:0,bub:0};}}
async function begin(fresh){
  $('#title').hidden=true;
  if(fresh){clearSave();S=newState();}
  if(!S.hand)S.hand='hoe';if(!S.tools)S.tools={hoe:1,can:1,pick:1};delete S.sel;
  P.x=S.px;P.y=S.py;P.dir=S.dir||0;setFree(null);
  renderBase('farm');renderBase('town');updHud();updClock();started=true;
  if(!S.flags.intro){S.flags.intro=true;
    const intro=DLG.intro&&DLG.intro.length?DLG.intro:[{who:'narr',text:'モン娘だけが暮らす街の、はずれの牧場。'},{who:'player',text:'今日からここが、わたしの牧場。がんばろう！'}];
    await scene(intro);toast('下の道具からクワをえらんで、畑のマスをタップ。指でなぞると見わたせるよ');save();}
  await runVisits();
}
async function boot(){
  LIT.ok=initGL();
  resize();addEventListener('resize',resize);
  $('#lightBtn').onclick=()=>{LIT.q=LIT.q===0?3:LIT.q-1;LIT.auto=false;try{localStorage.setItem(LIGHT_KEY,String(LIT.q));}catch(e){}applyLight();};
  await loadDLG();
  ['player','chloe','luu','shop'].forEach(makeSprites);
  OTHERS=(DLG.others||[]).map(o=>o.name||o);
  initRT();
  // タイトルの絵
  const tg=$('#tcv').getContext('2d');tg.imageSmoothingEnabled=false;
  for(let x=0;x<6;x++)drawGrass(tg,x,2);tg.drawImage(SPR.chloe[0][0],20,14);tg.drawImage(SPR.player[0][0],40,14);tg.drawImage(SPR.luu[0][0],60,14);
  drawCrop(tg,'kabu',3,4,28);drawCrop(tg,'ichigo',3,78,28);
  const sv=loadSave();if(sv){S=sv;$('#contBtn').hidden=false;}
  $('#newBtn').onclick=()=>begin(true);$('#contBtn').onclick=()=>begin(false);
  cv.addEventListener('pointerdown',e=>{if(ptr||!e.isPrimary)return;const b=cv.getBoundingClientRect();
    ptr={id:e.pointerId,sx:e.clientX,sy:e.clientY,bx:b.left,by:b.top,drag:false,cx:cam.x,cy:cam.y};try{cv.setPointerCapture(e.pointerId);}catch(_){}});
  cv.addEventListener('pointermove',e=>{if(!ptr||e.pointerId!==ptr.id)return;const dx=e.clientX-ptr.sx,dy=e.clientY-ptr.sy;
    if(!ptr.drag&&Math.hypot(dx,dy)>10)ptr.drag=true;
    if(ptr.drag&&S&&started){const[x,y]=clampCam(ptr.cx-dx/view.sc,ptr.cy-dy/view.sc);setFree({x,y});}});
  const endPtr=(e,cancel)=>{if(!ptr||e.pointerId!==ptr.id)return;const p=ptr;ptr=null;
    if(p.drag){if(S&&started)hint('pan','もどるときは右下の「自分にもどる」');}else if(!cancel)onTap(p.sx-p.bx,p.sy-p.by);};
  cv.addEventListener('pointerup',e=>endPtr(e,false));cv.addEventListener('pointercancel',e=>endPtr(e,true));
  recBtn.onclick=()=>setFree(null);
  $('#bagBtn').onclick=()=>{if(!busy())openBag();};
  $('#mapBtn').onclick=()=>{if(!busy())openMap();};
  $('#friendBtn').onclick=()=>{if(!busy())openFriends();};
  $('#ffBtn').onclick=e=>{ff=ff===1?8:1;e.currentTarget.setAttribute('aria-pressed',ff>1?'true':'false');e.currentTarget.textContent=ff>1?'早送り×8':'早送り';};
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&S&&started)save();});
  if(!sv)S=null;
  requestAnimationFrame(loop);
  window.__game={get S(){return S;},P,RT,Q,onTap,sleep,openNpc,view,cam,canAct,LIT,
    fps(){const a=LIT.fr||[];return a.length?Math.round(a.length/a.reduce((x,y)=>x+y,0)):0;},
    debug(o){if(o.time!=null)S.time=o.time;if(o.map)S.map=o.map;if(o.cam&&o.cam[0]>=0)setFree({x:o.cam[0],y:o.cam[1]});if(o.light!=null){LIT.q=o.light;applyLight();}if(o.pos){P.x=o.pos[0];P.y=o.pos[1];P.path=[];}if(o.npc)Object.assign(DBGN,o.npc);if(o.pdir!=null)P.dir=o.pdir;}};
}
boot();
