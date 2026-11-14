'use strict';
// ===== モン娘RPG 動きの試しエンジン（全キャラ共通）=====
// キャラごとの動きとエフェクトは CHAR（assets/characters/<id>/motions.js）、アンカーは assets/characters/<id>/character.json
// 手順の正：docs/ART_PIPELINE.md
const canvas=document.querySelector('#scene'),ctx=canvas.getContext('2d');
const W=960,H=700,G=568,BX=282,S=0.68,TAU=Math.PI*2;
const EN={x:748,y:547},TARGET=[742,468];
const rc=document.createElement('canvas');rc.width=W;rc.height=H;const rctx=rc.getContext('2d');
let POSE={},motions=[],FXDEF={};
const images={},FX={},FXLIST={};let loaded=0,totalImg=1e9;
const ok=im=>im&&im.complete&&im.naturalWidth>0;
let selected=0,time=0,last=performance.now(),paused=false,playAll=false,speed=1,gt=0,debug=false;
let enemyHP=100,playerHP=100,emitClock=0;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)},easeOut=t=>1-(1-clamp(t,0,1))**3,easeIn=t=>clamp(t,0,1)**2;
const lerp=(a,b,t)=>a+(b-a)*t,win=(p,a,b)=>clamp((p-a)/(b-a),0,1),bump=(p,a,b)=>Math.sin(Math.PI*win(p,a,b));
function rgba(r,g,b,a){return `rgba(${r},${g},${b},${clamp(a,0,1).toFixed(3)})`}
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

// ===== キャラの変換（アンカーも同じ変換で動く）=====
function xf(pose,o){return {pose,bx:BX+o.dx,by:G+o.dy,rot:o.tilt,sx:S*o.sx,sy:S*o.sy}}
function pt(X,a){const r=POSE[X.pose].root;const x=(a[0]-r[0])*X.sx,y=(a[1]-r[1])*X.sy,c=Math.cos(X.rot),s=Math.sin(X.rot);return [X.bx+x*c-y*s,X.by+x*s+y*c]}
function anchor(X,name){const P=POSE[X.pose];const a=P[name]||P.palm||[P.w*.82,P.h*.45];return pt(X,a)}
function drawActorOn(c,X,alpha=1){const img=images[X.pose];if(!ok(img)||alpha<=0)return;const P=POSE[X.pose];c.save();c.globalAlpha=clamp(alpha,0,1);c.translate(X.bx,X.by);c.rotate(X.rot);c.scale(X.sx,X.sy);c.drawImage(img,-P.root[0],-P.root[1],P.w,P.h);c.restore()}

// ===== 描く道具（共通）=====
function glow(x,y,r,a,col=[120,215,255]){if(a<=0)return;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(...col,a));g.addColorStop(.3,rgba(...col,a*.42));g.addColorStop(1,rgba(...col,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function star(x,y,r,a,color='#dff8ff'){if(a<=0)return;ctx.save();ctx.translate(x,y);ctx.globalAlpha=clamp(a,0,1);ctx.shadowBlur=8;ctx.shadowColor=color;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(0,-r*1.4);ctx.quadraticCurveTo(r*.16,-r*.14,r,0);ctx.quadraticCurveTo(r*.15,r*.15,0,r*1.4);ctx.quadraticCurveTo(-r*.15,r*.15,-r,0);ctx.quadraticCurveTo(-r*.16,-r*.14,0,-r*1.4);ctx.fill();ctx.restore()}
function bubble(x,y,r,a){if(a<=0)return;ctx.save();ctx.globalAlpha=clamp(a,0,1);ctx.fillStyle='rgba(150,225,255,.16)';ctx.strokeStyle='rgba(215,248,255,.75)';ctx.lineWidth=1.1;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x,y,r*.68,-2.6,-1.7);ctx.stroke();ctx.restore()}
function enemyShot(x,y,r,a){if(a<=0)return;glow(x,y,r*2.4,a*.45,[160,90,255]);ctx.save();ctx.globalAlpha=clamp(a,0,1);const g=ctx.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);g.addColorStop(0,'#f2dcff');g.addColorStop(.45,'#9b63e8');g.addColorStop(1,'#4a2484');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore()}
function dmg(x,y,str,a,color='#e9fbff'){if(a<=0)return;ctx.save();ctx.globalAlpha=clamp(a,0,1);ctx.font='bold 31px system-ui,sans-serif';ctx.textAlign='center';ctx.lineWidth=5;ctx.strokeStyle='rgba(8,18,30,.75)';ctx.strokeText(str,x,y);ctx.fillStyle=color;ctx.fillText(str,x,y);ctx.restore()}

// ===== 泡など（ふわっと出て消えるもの）=====
const floaters=[];
function emit(x,y,n,o={}){for(let i=0;i<n;i++){const R=Math.random;floaters.push({x:x+(R()-.5)*(o.spread||8),y:y+(R()-.5)*(o.spread||8),vx:(o.vx||-12)+(R()-.5)*(o.jx||22),vy:(o.vy||-55)-R()*(o.jy||35),r:(o.r||5)+R()*(o.rr||5),age:0,life:(o.life||1.3)+R()*.5,seed:R()*9})}}
function drawFloaters(){for(const f of floaters){const k=f.age/f.life;const a=smooth(k/.12)*(1-smooth((k-.75)/.25));bubble(f.x,f.y,f.r*(1+k*.15),a*.9);if(k>.86)star(f.x,f.y,f.r*.55,(1-k)*5)}}

function stepFloaters(dt){for(let i=floaters.length-1;i>=0;i--){const f=floaters[i];f.age+=dt;f.x+=f.vx*dt+Math.sin(gt*3+f.seed)*.3;f.y+=f.vy*dt;if(f.age>f.life)floaters.splice(i,1)}}
// ===== 背景・敵 =====
function background(flash){const im=images.bg;if(ok(im)){const sw=im.naturalWidth,sh=im.naturalHeight,sy=95,cropH=Math.min(sh-sy,650);ctx.drawImage(im,0,sy,sw,cropH,0,0,W,H)}else{const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#152a40');g.addColorStop(1,'#0a111c');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
 ctx.fillStyle='rgba(6,14,26,.36)';ctx.fillRect(0,0,W,H);const fl=ctx.createLinearGradient(0,470,0,700);fl.addColorStop(0,'rgba(10,22,36,.3)');fl.addColorStop(1,'rgba(8,16,26,.85)');ctx.fillStyle=fl;ctx.fillRect(0,470,W,230);if(flash>0){ctx.fillStyle=rgba(170,235,255,flash*.16);ctx.fillRect(0,0,W,H)}}
function enemy(es){const img=images.enemy;const wig=1+Math.sin(gt*2.4)*.015;glow(750,535,90,.12,[150,110,255]);ctx.save();ctx.globalAlpha=.6;ctx.fillStyle='#070d18';ctx.beginPath();ctx.ellipse(754,G,112,17,0,0,TAU);ctx.fill();ctx.restore();if(ok(img)){ctx.save();ctx.translate(EN.x+(es.dx||0)+Math.sin(gt*2)*2,EN.y);ctx.scale(wig*(es.sx||1),(es.sy||1)/wig);ctx.drawImage(img,-115,-165,230,165);if(es.hit>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=es.hit*.33;ctx.drawImage(img,-115,-165,230,165)}ctx.restore()}}

// ===== 体に映る光（シルエットで切りぬく・L35）=====
function reflect(X,pow,col=[110,220,255]){if(pow<=.01||!ok(images[X.pose]))return;rctx.setTransform(1,0,0,1,0,0);rctx.globalCompositeOperation='source-over';rctx.clearRect(0,0,W,H);drawActorOn(rctx,X,1);rctx.globalCompositeOperation='source-in';const g=rctx.createLinearGradient(0,G,0,G-340);g.addColorStop(0,rgba(...col,.8));g.addColorStop(.5,rgba(...col,.22));g.addColorStop(1,rgba(...col,0));rctx.fillStyle=g;rctx.fillRect(0,0,W,H);ctx.save();ctx.globalAlpha=clamp(pow,0,1);ctx.globalCompositeOperation='screen';ctx.drawImage(rc,0,0);ctx.restore()}

// ===== GPT が描いたエフェクトの絵（character.json の fx）=====
// 名前の最後が _1 _2 … のものは同じ種類のちがう形。painted('gel_ball',seed) で1つえらぶ
function painted(base,seed=0){const l=FXLIST[base];return l&&l.length?l[Math.abs(Math.round(seed))%l.length]:null}
function sprite(name,x,y,w,h,a=1,rot=0,blend){const im=FX[name];if(!ok(im)||a<=0)return false;const d=FXDEF[name]||{};ctx.save();ctx.globalAlpha=clamp(a,0,1);ctx.globalCompositeOperation=blend||d.blend||'source-over';ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();return true}

// ===== 動きの切りかえ（seq の時刻でポーズを切りかえ、0.09秒だけ前のポーズを重ねる）=====
function artAt(m,t){if(m.walk){const rate=2.6,s=t*rate+(m.walk==='B'?1:0),k=Math.floor(s);return {art:k%2?'P03':'P02',prev:t*rate>=1||m.walk==='B'?(k%2?'P02':'P03'):null,since:(s-k)/rate,step:s-k}}
 const p=t/m.duration;let i=0;for(let j=0;j<m.seq.length;j++)if(p>=m.seq[j][0])i=j;return {art:m.seq[i][1],prev:i>0?m.seq[i-1][1]:null,since:t-m.seq[i][0]*m.duration}}
// ===== 1コマ（順番は仕様書6章のレイヤー）=====
function render(dt){const m=motions[selected],t=time,p=clamp(t/m.duration,0,1);
 const A=artAt(m,t);const o=CHAR.actorParams(m.id,t,p,A);const X=xf(A.art,o);const es=Object.assign({hit:0,sx:1,sy:1,dx:0,flash:0,shake:0},CHAR.enemyState(m.id,t,p));
 const hp=CHAR.hp?CHAR.hp(m.id,p):{enemy:100,player:100};enemyHP=hp.enemy;playerHP=hp.player;
 document.querySelector('#enemyBar').style.width=enemyHP+'%';document.querySelector('#playerBar').style.width=playerHP+'%';
 if(dt>0){emitClock+=dt;CHAR.step&&CHAR.step(m,t,p,X,A,dt);stepFloaters(dt)}
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,W,H);if(es.shake>0)ctx.translate((Math.random()-.5)*es.shake,(Math.random()-.5)*es.shake);
 background(es.flash);
 CHAR.floor&&CHAR.floor(m,t,p,X);
 ctx.save();ctx.globalAlpha=.5;ctx.fillStyle='#050a14';ctx.beginPath();ctx.ellipse(BX+o.dx,G+6,105,13,0,0,TAU);ctx.fill();ctx.restore();
 CHAR.effects('back',m,t,p,X,es);enemy(es);
 drawActorOn(ctx,X,1);if(A.prev&&A.since<.09&&A.since>=0){drawActorOn(ctx,xf(A.prev,o),(1-A.since/.09)*.9)}
 (CHAR.reflection?CHAR.reflection(m.id,t,p):[]).forEach(r=>reflect(X,r[0],r[1]));
 CHAR.body&&CHAR.body(m,t,p,X,A);
 CHAR.effects('front',m,t,p,X,es);drawFloaters();
 if(debug)drawAnchors(X)}
function drawAnchors(X){const P=POSE[X.pose];const dot=(a,c)=>{const [x,y]=pt(X,a);ctx.save();ctx.fillStyle=c;ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,5,0,TAU);ctx.fill();ctx.stroke();ctx.restore()};dot(P.root,'#3f6');['palm','palm2','tip','guard','hit'].forEach(k=>P[k]&&dot(P[k],'#f33'));P.drips.forEach(a=>dot(a,'#ff3'));ctx.save();ctx.strokeStyle='rgba(80,255,120,.6)';ctx.beginPath();ctx.moveTo(0,G);ctx.lineTo(W,G);ctx.stroke();ctx.restore()}

// ===== 操作 =====
function buildButtons(){const g1=document.querySelector('#motionGrid'),g2=document.querySelector('#specialGrid');motions.forEach((m,i)=>{const el=document.createElement('button');el.className='motion';el.dataset.index=i;el.innerHTML=`<span class="num">${m.id}</span><b>${m.name}</b><small>${m.short}</small>`;el.addEventListener('click',()=>select(i));(m.id.startsWith('SP')?g2:g1).appendChild(el)})}
function setActive(){document.querySelectorAll('.motion').forEach(b=>b.classList.toggle('selected',+b.dataset.index===selected));const m=motions[selected];document.querySelector('#phaseName').textContent=m.id+' · '+m.name;document.querySelector('#phaseDesc').textContent=m.short;document.querySelector('#stageCounter').textContent=`MOTION ${String(selected+1).padStart(2,'0')} / ${motions.length}`}
function select(i){selected=i;time=0;floaters.length=0;setActive()}
function frame(ts){let dt=Math.min(.06,(ts-last)/1000);last=ts;if(paused)dt=0;else{dt*=speed;gt+=dt;time+=dt;const m=motions[selected];if(time>=m.duration){if(playAll)select((selected+1)%motions.length);else{time=0;floaters.length=0}}}render(dt);requestAnimationFrame(frame)}
function loadImage(key,src,store){const im=new Image();im.decoding='async';im.onload=im.onerror=()=>{loaded++;if(loaded>=totalImg)document.querySelector('#loading').classList.add('done')};im.src=src;store[key]=im}
async function startMotionPage(){
 const data=await fetch(CHAR.data).then(r=>r.json());POSE=data.poses;FXDEF=data.fx||{};motions=CHAR.motions;
 const dir=CHAR.data.replace(/[^/]*$/,'');const web=data.webFile;
 const list=[['bg','./assets/stage/battle_bg_moon.webp'],['enemy','./assets/stage/enemy_moon_slime.png']];
 Object.keys(POSE).forEach(k=>list.push([k,dir+web.replace('{id}',k)]));
 const fxl=Object.entries(FXDEF);totalImg=list.length+fxl.length;
 list.forEach(([k,s])=>loadImage(k,s,images));
 fxl.forEach(([k,d])=>{loadImage(k,dir+'fx/'+d.file,FX);const base=k.replace(/_\d+$/,'');(FXLIST[base]=FXLIST[base]||[]).push(k)});
 document.querySelector('#replay').onclick=()=>select(selected);
 document.querySelector('#all').onclick=e=>{playAll=!playAll;e.currentTarget.textContent=playAll?'■ 連続再生を止める':`▶ 全${motions.length}種類を連続再生`;e.currentTarget.classList.toggle('on',playAll);if(playAll)select(0)};
 document.querySelector('#pause').onclick=e=>{paused=!paused;e.currentTarget.textContent=paused?'▶ 再開':'⏸ 一時停止'};
 document.querySelector('#debug').onclick=e=>{debug=!debug;e.currentTarget.classList.toggle('on',debug)};
 document.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>{speed=+b.dataset.speed;document.querySelectorAll('[data-speed]').forEach(x=>x.classList.toggle('active',x===b))});
 buildButtons();
 // 点検用：?m=P05&t=1.2 で、その動きのその時刻で止める（&debug=1 でアンカー表示）。tools/shots.py が使う
 const qs=new URLSearchParams(location.search);const qm=motions.findIndex(m=>m.id===qs.get('m'));select(qm>=0?qm:0);if(qs.get('debug')==='1'){debug=true;document.querySelector('#debug').classList.add('on')}
 if(qs.has('t')){const target=+qs.get('t');const warm=()=>{if(loaded<totalImg)return setTimeout(warm,50);const step=1/60;time=0;gt=0;for(let k=0;k<target/step;k++){time+=step;gt+=step;render(step)}paused=true;document.querySelector('#pause').textContent='▶ 再開';document.querySelector('#loading').style.display='none';window.__ready=true;requestAnimationFrame(frame)};warm()}else requestAnimationFrame(frame)}
