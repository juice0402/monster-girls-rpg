/* ---------- 表示のしくみ ---------- */
const cv=$('#cv'),ctx=cv.getContext('2d');const view={w:192,h:300,sc:2};const cam={x:0,y:0};
function resize(){
  const st=$('#stage');const W=st.clientWidth,H=st.clientHeight;
  const sc=Math.max(2,Math.floor(W/176));view.sc=sc;view.w=Math.ceil(W/sc);view.h=Math.ceil(H/sc);
  cv.width=view.w;cv.height=view.h;cv.style.width=view.w*sc+'px';cv.style.height=view.h*sc+'px';ctx.imageSmoothingEnabled=false;
  resizeLayers();
}
const parts=[];
function dust(x,y,c,n){for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-.5)*40,vy:-Math.random()*40-10,g:120,life:.45,c,s:1});}
function splash(x,y){for(let i=0;i<7;i++)parts.push({x:x+(Math.random()-.5)*8,y:y-6,vx:(Math.random()-.5)*20,vy:-Math.random()*30,g:160,life:.5,c:i%2?'#8fd3f5':'#4aa3d8',s:1});}
const fxEl=$('#fx');
function w2s(x,y){return[(x-cam.x)*view.sc,(y-cam.y)*view.sc];}
// 指でなぞると画面が動く（camFree）。指を離したときに動いていなければタップ
let camFree=null,ptr=null;const recBtn=$('#recenter');
function clampCam(x,y){const mw=MW*TS,mh=MH*TS;return[mw<=view.w?(mw-view.w)/2:Math.max(0,Math.min(mw-view.w,x)),mh<=view.h?(mh-view.h)/2:Math.max(0,Math.min(mh-view.h,y))];}
function setFree(v){camFree=v;recBtn.hidden=!v;}
function fxText(x,y,text,cls){const e=document.createElement('div');e.className='ft'+(cls?' '+cls:'');e.textContent=text;const[sx,sy]=w2s(x,y);e.style.left=sx+'px';e.style.top=sy+'px';fxEl.appendChild(e);setTimeout(()=>e.remove(),1300);}
const bubs={};
function bubble(id,text){if(!text)return;let e=bubs[id];if(!e){e=document.createElement('div');e.className='bub';fxEl.appendChild(e);bubs[id]=e;}e.textContent=text;RT[id].bub=2.6;}
let toastT=0;const toastEl=$('#toast');
function toast(t){toastEl.textContent=t;toastEl.classList.remove('off');toastT=2.6;}
function hint(k,t){if(S.flags.hints[k])return;S.flags.hints[k]=1;toast(t);}
const pick=a=>a[(Math.random()*a.length)|0];
const shopTitle=()=>DLG.shop.shopName?`種屋「${DLG.shop.shopName}」`:`${DLG.shop.name}の種屋`;

function castSh(sil,X,Y,ay,kx,ky){shg.setTransform(1,0,-kx,-ky,kx*ay,ay*(1+ky));shg.drawImage(sil,X,Y);}
// 動く物（岩など）の足もとのかげ：地面を少し暗く・光の演出のときは「かげ」の絵も暗く（地面に置いた感じにする）
function footShade(X,Y,W,L){const rows=[[2,-4,.2],[1,-2,.3],[0,0,.34],[1,-2,.22]];
  for(let j=0;j<rows.length;j++){const[a,dw,k]=rows[j],w=W+dw;if(w<1)continue;ctx.fillStyle=`rgba(16,34,12,${k})`;ctx.fillRect(X+a,Y+j,w,1);
    if(L){dctx.globalCompositeOperation='multiply';dctx.fillStyle=`rgb(255,${Math.round(255*(1-k*1.6))},255)`;dctx.fillRect(X+a,Y+j,w,1);dctx.globalCompositeOperation='source-over';}}}
let lpLast=0;
function render(){
  const pm=S?S.map:'farm';
  LIT.act=LIT.ok&&LIT.q>0&&!!G;const L=LIT.act;
  if(!S||!BASE[pm]){ctx.fillStyle='#24351f';ctx.fillRect(0,0,view.w,view.h);
    if(L){gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,glc.width,glc.height);gl.clearColor(.14,.21,.12,1);gl.clear(gl.COLOR_BUFFER_BIT);pctx.clearRect(0,0,pfx.width,pfx.height);}
    return;}
  if(camFree){
    // 指で動かした画面のまま。自分が画面の中を歩いて、はしに近づいたら追いかける
    const px=P.x*TS+8,py=P.y*TS+8,m=28;
    const inView=px>camFree.x&&px<camFree.x+view.w&&py>camFree.y&&py<camFree.y+view.h;
    if(inView&&P.path.length&&!(ptr&&ptr.drag)){
      if(px<camFree.x+m)camFree.x=px-m;else if(px>camFree.x+view.w-m)camFree.x=px-view.w+m;
      if(py<camFree.y+m)camFree.y=py-m;else if(py>camFree.y+view.h-m)camFree.y=py-view.h+m;}
    [camFree.x,camFree.y]=clampCam(camFree.x,camFree.y);cam.x=camFree.x;cam.y=camFree.y;
  }else[cam.x,cam.y]=clampCam(P.x*TS+8-view.w/2,P.y*TS+8-view.h/2);
  const cx=Math.round(cam.x),cy=Math.round(cam.y),B3=BASE3[pm];
  const now=performance.now()/1000;
  ctx.fillStyle='#24351f';ctx.fillRect(0,0,view.w,view.h);
  ctx.drawImage(BASE[pm],-cx,-cy);
  const dyn=[];   // 影を落とす動く物（画面の位置）
  if(L){nctx.fillStyle='rgb(128,128,255)';nctx.fillRect(0,0,view.w,view.h);dctx.fillStyle='rgb(0,255,0)';dctx.fillRect(0,0,view.w,view.h);
    nctx.drawImage(B3.n,-cx,-cy);dctx.drawImage(B3.d,-cx,-cy);eg.clearRect(0,0,view.w,view.h);}
  const E=L?eg:ctx;   // 光る物（光の演出のときは「光る所」の絵に描く）
  if(pm==='farm'){
    const F=S.farm;
    for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=I(x,y),X=x*TS-cx,Y=y*TS-cy;if(X<-16||Y<-16||X>view.w||Y>view.h)continue;
      if(F.soil[i])blit3(SOILC[F.wet[i]?1:0][soilMask(x,y)],'flat',X,Y);
      const c=F.crop[i];if(c){const cd=CROPS[c.id];const stg=c.ready?3:c.d===0?0:c.d<cd.days/2?1:2;
        if(stg>=1){ctx.fillStyle='rgba(40,20,10,.25)';ctx.fillRect(X+4,Y+13,8,2);}
        const o=blit3(cropSprite(stg===3?c.id:'s'+stg,stg>=1?cropLean(x,y,now):0),'round',X,Y);if(o&&stg>=2)dyn.push({sil:o.sil,X,Y,ay:Y+o.by});
        if(c.ready&&((now*2+x+y)|0)%5===0){E.fillStyle='#fffbe0';E.fillRect(X+12,Y+2,1,1);E.fillRect(X+11,Y+3,3,1);E.fillRect(X+12,Y+4,1,1);}}
      if(F.rock[i]){const rs=rockSprite(x,y),fx=rs.nd.fx;footShade(X+fx[0]-1,Y+12,fx[1]-fx[0]+3,L);const o=blit3(rs,'round',X,Y);if(o)dyn.push({sil:o.sil,X,Y,ay:Y+o.by-(o.foot||0)});}
      if(F.flower[i])blit3(FLOWERC[(x+y)%3],'round',X,Y);
    }
    // 池のきらめき（光の演出のときは水のつやで光る）
    if(!L){ctx.fillStyle='#bfe8fb';for(let k=0;k<3;k++){ctx.fillRect(11*TS+4+k*13-cx,21*TS+6+((k*7)%14)-cy,3,1);}}
  }else if(TOWN_OBJ.fountain){
    // 噴水：水（動く）→ まん中の柱と皿
    const X=FN.ox-cx,Y=FN.oy-cy;
    if(X>-FN.W&&Y>-FN.H&&X<view.w&&Y<view.h){const w=fountainWater(now);ctx.drawImage(w.c,X,Y);if(L){nctx.drawImage(w.n,X,Y);dctx.drawImage(w.d,X,Y);}
      if(!FPED)FPED=TOWN_OBJ.fountain.ped.cv();ctx.drawImage(FPED.c,X,Y);if(L){nctx.drawImage(FPED.n,X,Y);dctx.drawImage(FPED.d,X,Y);}}
  }
  // 予約
  E.strokeStyle='rgba(255,246,200,.85)';E.lineWidth=1;
  for(const t of Q)if(t.kind==='field'){const X=t.x*TS-cx,Y=t.y*TS-cy;E.strokeRect(X+1.5,Y+1.5,13,13);}
  for(const m of marks){E.strokeStyle=`rgba(255,255,255,${Math.min(1,m.t*1.6)})`;E.strokeRect(m.x*TS-cx+.5,m.y*TS-cy+.5,15,15);}
  // 人
  const ents=[];
  ents.push({id:'player',x:P.x,y:P.y,dir:P.dir,act:P.act,mov:P.path.length>0,anim:P.anim});
  for(const id in RT){const r=RT[id];if(!r.hidden&&r.map===pm)ents.push({id,x:r.x,y:r.y,dir:r.dir,act:r.act,mov:r.path.length>0,anim:r.anim});}
  // 木（風でゆれる）：画面に入る木は人といっしょに奥から描く。画面の外の木も、光の演出のときは影だけ落とす
  const tm=L?110:0;
  for(const t of TREES[pm]){const X=t.X-cx,Y=t.Y-cy;if(X>view.w+tm||Y>view.h+tm||X+TW<-tm||Y+TH<-tm)continue;
    const f=treeNow(t,now);if(X>view.w||Y>view.h||X+TW<0||Y+TH<0){dyn.push({sil:f.sil,X,Y,ay:Y+TAY});continue;}
    ents.push({tree:f,X,Y,y:t.y-.02});}
  ents.sort((a,b)=>a.y-b.y);
  for(const e of ents){
    if(e.tree){const f=e.tree;ctx.drawImage(f.c,e.X,e.Y);if(L){nctx.drawImage(f.n,e.X,e.Y);dctx.drawImage(f.d,e.X,e.Y);}dyn.push({sil:f.sil,X:e.X,Y:e.Y,ay:e.Y+TAY});continue;}
    const X=Math.round(e.x*TS)-cx,Y=Math.round(e.y*TS)-cy;
    ctx.fillStyle=L?'rgba(0,0,0,.16)':'rgba(0,0,0,.22)';ctx.fillRect(X+3,Y+14,10,2);ctx.fillRect(X+4,Y+13,8,4);
    const fr=e.act?3:e.mov?[1,0,2,0][((e.anim*8)|0)%4]:0;
    const bob=e.id==='luu'&&!e.mov?((now*3)|0)%2:0;
    const sp=SPR[e.id][e.dir][fr],Xs=X-(sp.ox||0),Ys=Y-(sp.height-15)+bob,o=blit3(sp,'body',Xs,Ys);if(o)dyn.push({sil:o.sil,X:Xs,Y:Ys,ay:Ys+o.by});
    // 作業中は道具を持つ
    if(e.id==='player'&&P.act&&P.act.tool){const ic=TOOLC[P.act.tool],up=P.act.t/P.act.dur<.5?-3:1;
      if(e.dir===2){ctx.save();ctx.translate(X-9+16,Y-5+up);ctx.scale(-1,1);ctx.drawImage(ic,0,0);ctx.restore();}
      else{const o=[[5,1],[5,-15],[0,0],[9,-5]][e.dir];ctx.drawImage(ic,X+o[0],Y+o[1]+up);}}
  }
  // 粒
  for(const p of parts){ctx.fillStyle=p.c;ctx.fillRect(Math.round(p.x-cx),Math.round(p.y-cy),p.s,p.s);}
  if(L){
    const PP=paramsAt(S.time/60),vw=view.w,vh=view.h;
    // 日の影：動く物 → 自分には落とさない → 土台の木・家・さく → 物の上はぬきとる（地面だけに落とす）
    shg.setTransform(1,0,0,1,0,0);shg.globalCompositeOperation='source-over';shg.clearRect(0,0,vw,vh);
    if(PP.shA>.01){const kx=PP.shK[0],ky=PP.shK[1];
      for(const d of dyn)castSh(d.sil,d.X,d.Y,d.ay,kx,ky);
      shg.setTransform(1,0,0,1,0,0);shg.globalCompositeOperation='destination-out';for(const d of dyn)shg.drawImage(d.sil,d.X,d.Y);shg.globalCompositeOperation='source-over';
      for(const c of B3.casters){const X=c.x-cx,Y=c.y-cy,ay=c.ay-cy,hh=ay-Y,rx=Math.abs(kx)*hh+2,ry=Math.abs(ky)*hh+2;
        if(X+c.sil.width+rx<0||X-rx>vw||Y-ry>vh||ay+ry<0)continue;castSh(c.sil,X,Y,ay,kx,ky);}
      shg.setTransform(1,0,0,1,0,0);shg.globalCompositeOperation='destination-out';shg.drawImage(B3.mask,-cx,-cy);shg.globalCompositeOperation='source-over';}
    // 夜の窓とランプ
    if(PP.win>.01){eg.globalAlpha=Math.min(1,PP.win);for(const w of WINDOWS[pm]){const X=w[0]-cx,Y=w[1]-cy;if(X<-12||Y<-12||X>vw||Y>vh)continue;
      const ww=w[3]||10,wh=w[4]||9;eg.fillStyle='#ffc46e';eg.fillRect(X,Y,ww,wh);eg.fillStyle='#ffe4a6';eg.fillRect(X+1,Y+1,ww-2,wh-3);
      if(wh===10){eg.clearRect(X+4,Y,2,wh);eg.clearRect(X,Y+5,ww,1);}else{eg.clearRect(X+5,Y,1,wh);eg.clearRect(X,Y+4,ww,1);}}}
    if(PP.lamp>.01)LAMPS[pm].forEach((l,i)=>{if(l[4]==='glow')return;const X=l[0]-cx,Y=l[1]-(l[2]||29)-cy;if(X<-8||Y<-8||X>vw+8||Y>vh+8)return;const f=.9+.07*Math.sin(now*9+i*2)+.04*Math.sin(now*23+i);
      eg.globalAlpha=Math.min(1,PP.lamp*f);if(l[4]==='lan'){eg.fillStyle='#ffd88e';eg.fillRect(X,Y,1,3);return;}eg.fillStyle='#ffd88e';eg.fillRect(X-2,Y,5,6);eg.fillStyle='#fff6d8';eg.fillRect(X-1,Y+1,3,3);});
    eg.globalAlpha=1;
    const fy=camFree?.5:Math.max(.3,Math.min(.7,(P2y()-8-cy)/vh));
    renderGL(PP,lightsFor(pm,PP,now,cx,cy),now,cx,cy,fy);
    drawLP(Math.min(.05,now-lpLast),now,PP,cx,cy);lpLast=now;
  }else{
    // 夕方と夜（光の演出なしのとき）
    const t=S.time;let a=0,col='0,0,0';
    if(t>=1020&&t<1140){a=(t-1020)/120*.18;col='255,140,60';}
    else if(t>=1140){a=Math.min(.5,.18+(t-1140)/120*.3);col='20,24,70';}
    if(a>0){ctx.fillStyle=`rgba(${col},${a})`;ctx.fillRect(0,0,view.w,view.h);
      if(t>=1110){ctx.fillStyle='rgba(255,214,107,.9)';for(const[wx,wy]of WINDOWS[pm])ctx.fillRect(wx-cx,wy-cy,10,9);}}
  }
  // ふきだしの位置
  for(const id in bubs){const e=bubs[id],r=RT[id];if(!r||r.hidden||r.map!==pm||!(r.bub>0)){e.hidden=true;continue;}e.hidden=false;const[sx,sy]=w2s(r.x*TS+8,r.y*TS-11);e.style.left=sx+'px';e.style.top=sy+'px';}
}

