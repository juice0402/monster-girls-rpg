'use strict';
// ===== ミュウ（スライム娘）の動きとエフェクト =====
// アンカーは character.json。ゲルの道具は assets/engine/fx-gel.js
POOLS=[makePool(BX-118,G+7,34,7,11),makePool(BX-66,G+14,21,5,12),makePool(BX+6,G+10,42,8,13),makePool(BX+66,G+16,17,4,14),makePool(BX-166,G+15,15,4,15)];
const EPOOLS=[makePool(EN.x-58,G+8,46,8,21),makePool(EN.x+44,G+14,38,7,22),makePool(EN.x-4,G+20,24,5,23),makePool(EN.x+102,G+6,18,4,24)];
const MYU_MOTIONS=[
 {id:'P01',name:'待機／立ち絵',short:'ぷるぷる呼吸・髪の毛先からしずく',duration:3.6,seq:[[0,'P01']]},
 {id:'P02',name:'歩行 A',short:'A↔B の2ポーズで歩く（右足から）',duration:2.4,walk:'A'},
 {id:'P03',name:'歩行 B',short:'A↔B の2ポーズで歩く（反対の足から）',duration:2.4,walk:'B'},
 {id:'P04',name:'攻撃予備動作',short:'手のひらにゲルがにじみ出る',duration:1.8,seq:[[0,'P01'],[.14,'P04']]},
 {id:'P05',name:'通常攻撃',short:'ゲル弾を1発・糸を引いてちぎれる',duration:2.5,seq:[[0,'P04'],[.25,'P05'],[.8,'P12']]},
 {id:'P06',name:'チャージ／詠唱',short:'床のスライムだまりから手のひらへ収束',duration:3.0,seq:[[0,'P06']]},
 {id:'P07',name:'必殺技',short:'巨大ゲル弾・はじけて降りそそぐ',duration:3.9,seq:[[0,'P06'],[.30,'P07'],[.84,'P12']]},
 {id:'P08',name:'支援／回復',short:'手のひらからぷるぷるの泡',duration:2.8,seq:[[0,'P08']]},
 {id:'P09',name:'防御／ガード',short:'両手からゲルの膜・弾を受け止める',duration:2.8,seq:[[0,'P09']]},
 {id:'P10',name:'被ダメージ',short:'ぷるんと揺れて、しぶきが落ちる',duration:1.9,seq:[[0,'P01'],[.10,'P10'],[.82,'P01']]},
 {id:'P11',name:'戦闘不能',short:'専用の絵・小さな揺れだけ',duration:3.0,seq:[[0,'P11']]},
 {id:'P12',name:'発動後の余韻',short:'手のひらにゲルの糸が残ってたれる',duration:2.7,seq:[[0,'P12'],[.86,'P01']]},
 {id:'P13',name:'挑発／アピール',short:'あごに手・ぷるんと揺れる',duration:2.8,seq:[[0,'P13']]},
 {id:'P14',name:'セクシー勝利',short:'専用の勝利ポーズ・泡がきらめく',duration:3.2,seq:[[0,'P14']]},
 {id:'SP01',name:'固有技・のびーるアーム',short:'指先からゲルの腕がのびて叩く',duration:3.2,seq:[[0,'P04'],[.18,'SP01'],[.86,'P12']]},
 {id:'SP02',name:'固有技・ゲルバインド',short:'指先のゲルの帯で敵をしばる',duration:3.7,seq:[[0,'P06'],[.15,'SP02']]}];

function actorParams(id,t,p,A){let dx=0,dy=0,tilt=0,sx=1,sy=1;const br=Math.sin(gt*1.8);sy+=br*.0065;sx-=br*.0032;sx+=Math.sin(gt*6.3)*.0012;
 const jiggle=(t0,amp)=>{const k=t-t0;if(k<0)return;const e=Math.exp(-k*5.5)*Math.cos(k*30)*amp;sy-=e;sx+=e*.7};
 switch(id){
 case 'P01':dx=Math.sin(gt*.6)*1;break;
 case 'P02':case 'P03':{const u=A.step;dx=Math.sin(t*2.6*Math.PI)*5;dy=-Math.sin(Math.PI*u)*4;tilt=.006*Math.sin(t*2.6*Math.PI);jiggle(A.since<.05?t:t-A.since,.012);break}
 case 'P04':dx=-6*smooth(win(p,.14,.5));tilt=-.016*smooth(win(p,.14,.6));break;
 case 'P05':dx=p<.25?-6:-6+12*smooth(win(p,.27,.36))-4*smooth(win(p,.5,.8));tilt=p<.25?-.016:.012*bump(p,.27,.7);if(p>.27)jiggle(.27*2.5,.018);break;
 case 'P06':dy=-2*Math.sin(t*2.2);break;
 case 'P07':dx=p<.3?0:9*smooth(win(p,.3,.4))-6*smooth(win(p,.6,.84));dy=p<.3?-2*Math.sin(t*2.2):-3*smooth(win(p,.3,.4));if(p>.3)jiggle(.3*3.9,.02);break;
 case 'P08':dy=-2*Math.sin(p*Math.PI);break;
 case 'P09':tilt=-.012*smooth(p/.25);dx=-7*bump(p,.45,.6);if(p>.45)jiggle(.45*2.8,.02);break;
 case 'P10':{if(p>=.10){dx=-15*smooth(win(p,.10,.2))*(1-smooth(win(p,.6,.82)));tilt=-.05*smooth(win(p,.1,.18))*(1-smooth(win(p,.55,.8)));jiggle(.10*1.9,.06)}break}
 case 'P11':{const s=smooth(p/.3);dy=3*s+Math.sin(gt*.9)*.5;tilt=Math.sin(gt*.8)*.003;break}
 case 'P12':dx=-2+2*smooth(p);tilt=.01*(1-p);break;
 case 'P13':tilt=Math.sin(t*2)*.016;dy=Math.sin(t*1.7)*1.6;jiggle(.35,.025);break;
 case 'P14':tilt=Math.sin(t*1.4)*.014;dy=Math.sin(t*1.9)*1.4;jiggle(.2,.02);break;
 case 'SP01':dx=p<.18?-6*smooth(p/.18):-6+6*smooth(win(p,.18,.3));tilt=.012*bump(p,.42,.6);if(p>.43)jiggle(.43*3.2,.015);break;
 case 'SP02':tilt=p>.4&&p<.86?-.014-.004*Math.sin(t*9):0;dx=p>.4&&p<.86?-4:0;break;
 }
 return {dx,dy,tilt,sx,sy}}
function enemyState(id,t,p){const e={hit:0,sx:1,sy:1,dx:0,flash:0,shake:0};
 switch(id){
 case 'P05':e.hit=bump(p,.62,.76);e.sx=1+.08*e.hit;e.sy=1-.08*e.hit;e.flash=e.hit*.35;break;
 case 'P07':e.hit=bump(p,.62,.82);e.sx=1+.12*e.hit;e.sy=1-.12*e.hit;e.flash=e.hit*.7;e.shake=9*bump(p,.62,.7);break;
 case 'SP01':e.hit=bump(p,.43,.53);e.dx=12*e.hit;e.sx=1-.14*e.hit;e.flash=e.hit*.4;e.shake=5*bump(p,.43,.48);break;
 case 'SP02':{const b=smooth(win(p,.42,.5))*(1-smooth(win(p,.86,.96)));e.sx=1-.1*b+.012*Math.sin(t*14)*b;e.sy=1+.05*b;e.hit=.25*b*(.5+.5*Math.sin(t*6));break}
 case 'P09':e.dx=-8*bump(p,.26,.34);break;
 case 'P10':e.dx=-8*bump(p,0,.08);break;
 }
 return e}

// エフェクト（layer='back' は敵より奥、'front' はキャラの前）
function effects(layer,m,t,p,X,es){const id=m.id,d=m.duration;
 if(layer==='back'){
  if(id==='SP02'){const b=smooth(win(p,.38,.5))*(1-smooth(win(p,.86,1)));if(b>0)bindRings(t,p,b,'back')}
  return}
 const palm=anchor(X,'palm');
 switch(id){
 case 'P04':{const k=smooth(win(p,.2,.8));gel(palm[0]+5,palm[1]+2,3+9*k,.9*k,{seed:1});break}
 case 'P05':{
  if(p<.25){const k=smooth(win(p,.04,.24));gel(palm[0]+5,palm[1]+2,3+10*k,.92*k,{seed:1})}
  else{const launch=palm,q=easeIn(win(p,.33,.62)),sw=smooth(win(p,.25,.33));
   if(p<.33){gel(launch[0]+10,launch[1],14+5*sw,1,{seed:2})}
   else if(p<.63){const bx=lerp(launch[0]+8,TARGET[0]-22,q),by=lerp(launch[1],TARGET[1],q)-Math.sin(Math.PI*q)*36;const dist=Math.hypot(bx-launch[0],by-launch[1]);
    if(dist<95){strand(launch[0],launch[1],bx-10,by,8,12,.95,8,.72)}
    else{const tail=1-smooth(win(dist,95,180));if(tail>0){const tl=26*tail;strand(launch[0],launch[1],launch[0]+tl,launch[1]+tl*.35,7,3,.9*tail,0,.3);bead(launch[0]+tl,launch[1]+tl*.35,2.6,tail)}}
    const vx=(TARGET[0]-launch[0]),vy=(TARGET[1]-launch[1])-Math.cos(Math.PI*q)*36*Math.PI;const ang=Math.atan2(vy,vx);
    for(let k=1;k<4;k++){const qq=Math.max(0,q-k*.045);const xx=lerp(launch[0]+8,TARGET[0]-22,qq),yy=lerp(launch[1],TARGET[1],qq)-Math.sin(Math.PI*qq)*36;if(q>k*.05)bead(xx,yy,6-k*1.4,.8-k*.18)}
    gel(bx,by,19,1,{stretch:1.25+.35*q,angle:ang,seed:2})}
   splat(TARGET[0]-14,TARGET[1]-6,t-.62*d,1,1);
   if(p>.62)dmg(TARGET[0],395-46*smooth(win(p,.62,.9)),'− 180',bump(p,.62,.98)*1.4)}
  break}
 case 'P06':{const k=smooth(win(p,.05,.85))*(1-smooth(win(p,.92,1)));gel(palm[0]+6,palm[1]-4,5+15*k,.85*k,{seed:4,wob:1.3});chargeDrops(p,.08,.82,palm,6);break}
 case 'P07':{
  if(p<.3){const k=smooth(win(p,.04,.3));gel(palm[0]+6,palm[1]-4,5+16*k,.88*k,{seed:4,wob:1.3});chargeDrops(p,.05,.29,palm,7)}
  else{const orbC=[palm[0]+12,palm[1]-30],grow=smooth(win(p,.3,.4));const q=easeOut(win(p,.41,.6));const ox=lerp(orbC[0],EN.x-10,q),oy=lerp(orbC[1],300,q)-Math.sin(Math.PI*q)*60;const r=22+26*grow;
   if(p<.41){strand(palm[0],palm[1],orbC[0],orbC[1]+r*.6,10,16,.95,0,.55);gel(orbC[0],orbC[1],r,1,{seed:5,wob:1.4})}
   else if(p<.61){const tail=1-smooth(win(p,.41,.47));if(tail>0)strand(palm[0],palm[1],lerp(palm[0],ox,.3*tail),lerp(palm[1],oy,.3*tail),9,4,tail,0,.4);gel(ox,oy,r,1,{seed:5,wob:1.6,stretch:1.15})}
   rain(t,p,d);
   splat(TARGET[0]-10,TARGET[1]-12,t-.63*d,1.55,7,.45);
   if(p>.63)dmg(TARGET[0],380-50*smooth(win(p,.63,.95)),'− 520',bump(p,.63,1)*1.4,'#d9fbff')}
  break}
 case 'P08':{const k=bump(p,.05,.95);gel(palm[0]+4,palm[1]-6,6+4*k,.6*k,{seed:6});if(p>.55)dmg(BX+10,240-40*smooth(win(p,.55,.95)),'+ 120',bump(p,.55,1)*1.3,'#c8ffe9');for(let i=0;i<6;i++){const a=i*TAU/6+gt*.5;star(BX+Math.cos(a)*120,G-200+Math.sin(a)*150,3.2,k*.55)}break}
 case 'P09':{const f=smooth(win(p,.04,.24))*(1-smooth(win(p,.84,1)));const c=anchor(X,'guard'),p1=anchor(X,'palm'),p2=anchor(X,'palm2');
  if(f<.98){strand(p1[0],p1[1],c[0],c[1]-40,8,10,.8*(1-f),0,.5);strand(p2[0],p2[1],c[0],c[1]+30,8,10,.8*(1-f),0,.5)}
  const hitAge=p>=.45?(t-.45*d):-1;const hp=[c[0]+40,c[1]-10];
  membrane(c[0],c[1],46*f,128*f,.95*f,hitAge,hp[0]-10,hp[1]);
  if(p>.28&&p<.47){const q=win(p,.28,.45);enemyShot(lerp(710,hp[0],q),lerp(452,hp[1],q)-Math.sin(Math.PI*q)*30,11,1)}
  if(p>=.45&&p<.7){const q=win(p,.45,.7);enemyShot(hp[0]-12*q,hp[1],11*(1-q),(1-q)*.8);for(let i=0;i<6;i++){const a=-1.2+i*.5;bead(hp[0]+Math.cos(a)*60*q,hp[1]+Math.sin(a)*60*q+90*q*q,3.4*(1-q),1-q)}}
  if(p>.47)dmg(c[0]+20,c[1]-150-30*smooth(win(p,.47,.85)),'GUARD',bump(p,.47,.9)*1.2,'#c9f3ff');break}
 case 'P10':{const hp=anchor(X,'hit');if(p<.11){const q=win(p,0,.11);enemyShot(lerp(712,hp[0],q),lerp(450,hp[1],q),12,1)}
  if(p>=.1){const age=t-.1*d;if(age<.9){const R=rng(41);for(let i=0;i<9;i++){const a=Math.PI*(.85+R()*.75),v=140+R()*160;const x=hp[0]+Math.cos(a)*v*age,y=hp[1]+Math.sin(a)*v*age+700*age*age;if(y<landY(x))bead(x,y,2.5+R()*3,1-age/.9)}}
   dmg(hp[0]+70,hp[1]-150-40*smooth(win(p,.1,.6)),'− 95',bump(p,.1,.7)*1.3,'#ffd0dc')}break}
 case 'P12':{const k=1-smooth(win(p,.1,.8));glow(palm[0]+10,palm[1],60,.25*k);break}
 case 'P14':{for(let i=0;i<8;i++){const a=i*TAU/8+gt*.2;star(BX+Math.cos(a)*170,G-230+Math.sin(a)*170,4.2,.45+.3*Math.sin(gt*2+i))}break}
 case 'SP01':{
  if(p<.18){const k=smooth(win(p,.02,.18));gel(palm[0]+5,palm[1]+2,3+9*k,.9*k,{seed:1})}
  else{const tip=anchor(X,'tip'),ext=easeOut(win(p,.22,.43))*(1-smooth(win(p,.56,.8)));const end=[lerp(tip[0],TARGET[0]-42,ext),lerp(tip[1],TARGET[1]-6,ext)];
   if(ext>.02){gelArm(tip,end,ext)}
   splat(TARGET[0]-26,TARGET[1]-4,t-.43*d,.9,3);
   if(p>.43)dmg(TARGET[0],392-44*smooth(win(p,.43,.8)),'− 260',bump(p,.43,.92)*1.4)}
  break}
 case 'SP02':{if(p<.15){const k=smooth(win(p,.02,.15));gel(palm[0]+6,palm[1]-4,4+8*k,.8*k,{seed:4})}
  else{const tip=anchor(X,'tip');const rel=1-smooth(win(p,.86,1));const H3=[[EN.x-40,430],[EN.x-56,470],[EN.x-44,510]];
   H3.forEach((h,i)=>{const s=easeOut(win(p,.18+i*.04,.36+i*.04));if(s<=0)return;const e=[lerp(tip[0],h[0],s),lerp(tip[1],h[1],s)];const taut=smooth(win(p,.4,.5));strand(tip[0]-2+i*3,tip[1]+i*4,e[0],e[1],13,17,.95*rel,(1-taut)*Math.sin(gt*6+i)*26+taut*8,.15,.14);if(s<1)gel(e[0],e[1],7,1,{seed:30+i})});
   const b=smooth(win(p,.38,.5))*(1-smooth(win(p,.86,1)));if(b>0)bindRings(t,p,b,'front');
   if(p>.5)dmg(EN.x,370-26*smooth(win(p,.5,.85)),'拘束！',bump(p,.5,.92)*1.3,'#c9f3ff')}
  break}
 }}
function gelArm(a,e,ext){const sag=-Math.sin(Math.PI*ext)*16;strand(a[0]-6,a[1]+2,e[0],e[1],22,40,1,sag,.1,.18);const R=rng(9);for(let i=0;i<3;i++){const u=.3+i*.22;const x=lerp(a[0],e[0],u),y=lerp(a[1],e[1],u)+sag*2*u*(1-u)*2+8;const len=6+10*Math.sin(gt*2+i)**2;strand(x,y-4,x+1,y+len,6,5,.85,0,.5);bead(x+1,y+len+2,3.2,.9)}gel(e[0],e[1],18+8*ext,1,{seed:8,stretch:1.18,angle:Math.atan2(e[1]-a[1],e[0]-a[0]),wob:1.4})}
function chargeDrops(p,a,b,palm,n){for(let i=0;i<n;i++){const P=POOLS[i%POOLS.length];const st=a+(b-a)*(i/n)*.8,q=win(p,st,st+(b-a)*.35);if(q<=0||q>=1)continue;const sx=P.x+(i%2?-P.rx*.3:P.rx*.25),sy=P.y-P.ry*.4;const cx=(sx+palm[0])/2-30,cy=Math.min(sy,palm[1])-90;const u=easeIn(q);const x=(1-u)**2*sx+2*(1-u)*u*cx+u*u*palm[0],y=(1-u)**2*sy+2*(1-u)*u*cy+u*u*palm[1];if(q<.14){strand(sx,sy+2,x,y,7,6,.85,0,.5)}bead(x,y,5.4-1.8*u,1)}}
function rain(t,p,d){const R=rng(77);for(let i=0;i<24;i++){const st=.6+R()*.05,q=win(p,st,st+.1);const x0=EN.x-10+(R()-.5)*30,x1=EN.x-120+R()*230;const y1=R()<.6?430+R()*90:G+4;if(q<=0)continue;if(q<1){const u=easeIn(q);const x=lerp(x0,x1,u),y=lerp(300,y1,u)-Math.sin(Math.PI*u)*40*(1-u);teardrop(x,y,5+R()*4,600*u,1)}else{const age=t-(st+.1)*d;if(age<.7)splat(x1,y1,age,.32,i+20,0)}}
 const pp=smooth(win(p,.66,.8));EPOOLS.forEach(P=>pool(P,pp*.8))}
function bindRings(t,p,b,layer){const tight=smooth(win(p,.38,.52));[[430,1],[470,.92],[510,.84]].forEach(([y,s],i)=>{const rx=(150-34*tight)*s,ry=20*s;const a0=layer==='back'?Math.PI:0,a1=layer==='back'?TAU:Math.PI;ctx.save();ctx.globalAlpha=clamp(b,0,1)*(layer==='back'?.55:.95);ctx.lineCap='round';ctx.strokeStyle='rgba(110,200,250,.75)';ctx.lineWidth=11;ctx.beginPath();ctx.ellipse(EN.x+4,y+Math.sin(gt*5+i)*1.5,rx,ry,0,a0,a1);ctx.stroke();ctx.strokeStyle='rgba(225,250,255,.85)';ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(EN.x+4,y-3,rx,ry,0,a0,a1);ctx.stroke();ctx.restore();if(layer==='front'&&tight>.9){bead(EN.x+4+rx*.55,y+ry*.9+6+Math.sin(gt*3+i)*2,3.4,b)}})}


const CHAR={
 data:'./assets/characters/myu/character.json',
 motions:MYU_MOTIONS,actorParams,enemyState,effects,
 hp(id,p){const e=id==='P05'?(p>.62?82:100):id==='P07'?(p>.63?48:100):id==='SP01'?(p>.43?74:100):100;const pl=id==='P10'?(p>.1?72:100):id==='P11'?0:id==='P08'?(p>.55?100:70):100;return {enemy:e,player:pl}},
 step(m,t,p,X,A,dt){const rate=m.id==='P11'?.45:['P05','P07','SP01','SP02','P06'].includes(m.id)?1.25:1;stepDrips(X,dt,rate,A.art==='P12');stepDrops(dt);const P=POSE[X.pose];
  if(m.id==='P08'&&p>.08&&p<.8&&emitClock>.1){emitClock=0;const pl=anchor(X,'palm');emit(pl[0]+4,pl[1]-8,1,{vx:-30,jx:50,vy:-60,jy:40,r:4,rr:6,life:1.3})}
  if(m.id==='P13'&&emitClock>.45){emitClock=0;const a=pt(X,P.drips[0]);emit(a[0],a[1]-20,1,{vx:-6,vy:-40,r:3,rr:4,life:1.6})}
  if(m.id==='P14'&&emitClock>.22){emitClock=0;const a=pt(X,P.drips[(Math.random()*P.drips.length)|0]);emit(a[0],a[1]-10,1,{vx:10,jx:40,vy:-50,r:3,rr:6,life:1.8})}},
 floor(m){const pw=m.id==='P11'?.7:['P06','P07','P04','P05','SP01','SP02'].includes(m.id)?1:.88;POOLS.forEach(P=>pool(P,pw))},
 reflection(id,t,p){let r=0;if(['P06','P07'].includes(id))r=.25+.35*Math.sin(Math.PI*p);if(['P04','P05','SP01','SP02'].includes(id))r=.2*bump(p,0,1);if(id==='P08')r=.45*bump(p,.05,.95);if(id==='P09')r=.3*smooth(win(p,.05,.25))*(1-smooth(win(p,.84,1)));if(id==='P14')r=.22;const out=[[r,[110,220,255]]];if(id==='P10'&&p>.1)out.push([.5*Math.exp(-(t-.1*1.9)*6),[255,140,170]]);return out},
 body(m,t,p,X,A){drawHanging(X,A.art==='P12');drawDrops()}
};
