/* ---------- 街の絵（3枚組で1ドットずつ描く。光の見本 art-samples/hikari.html と同じ描き方） ---------- */
const C3=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const R3=a=>a.map(C3);
function h3(x,y,s){let h=(x|0)*374761393+(y|0)*668265263+((s|0)+1)*1442695041;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967296;}
const sm3=t=>t*t*(3-2*t);
function vn3(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=sm3(x-xi),yf=sm3(y-yi),a=h3(xi,yi,s),b=h3(xi+1,yi,s),c=h3(xi,yi+1,s),d=h3(xi+1,yi+1,s);return a+(b-a)*xf+(c-a)*yf+(a-b-c+d)*xf*yf;}
const BAY4=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const dq=(v,x,y)=>{const lo=Math.floor(v);return(v-lo)>(BAY4[((y&3)<<2)|(x&3)]+.5)/16?lo+1:lo;};
const ci=(i,P)=>Math.max(0,Math.min(P.length-1,i));
// 色の段（影は青むらさき寄り・光は黄色寄り）
const PS={
  stone:[R3(['#4f4655','#6f6468','#8f8279','#ab9d8d','#c8baa5','#e0d4be']),R3(['#4a4a58','#666a72','#848a8c','#a3a8a4','#c0c4ba','#dadcd0']),
         R3(['#544542','#77605a','#957b6f','#b29683','#cdb39c','#e3cdb5']),R3(['#4b4d44','#6b6f5d','#8a8e74','#a8ab8c','#c4c6a6','#dddfc0'])],
  mortar:R3(['#272129','#332b33','#40373d']),curb:R3(['#4f4744','#7a6f66','#a19583','#c3b7a1','#ddd2bb','#f1e8d3']),
  iron:R3(['#15161f','#252838','#3a3f56','#565e7c','#7d86a6']),wood:R3(['#2c1b13','#47301f','#68472c','#8a6038','#ab7c49','#c99a62']),
  plast:R3(['#6f6052','#988670','#bfab8e','#dac8a8','#ece0c4','#f7efdc']),brick:R3(['#3a1d22','#5c2a2c','#80393a','#a24f48','#bf6e5c','#d79479']),
  glass:R3(['#1b1e30','#282d46','#3a4463','#566b8b','#86a3bd','#c4dae5']),water:R3(['#173a63','#1f5181','#296a9d','#3888ba','#53a6d2','#84c8e8','#bfe6f6','#f2fcff']),
  wall:R3(['#3e3b44','#5a5660','#78737a','#958f92','#b2acab','#cdc8c4']),
  roofB:R3(['#182437','#1f324a','#2a4560','#375a76','#4a728b','#6890a2','#93b4bc']),roofS:R3(['#1c1a26','#28263a','#36344c','#46445e','#5a5874','#77758e','#9a98ae']),
  roofG:R3(['#142a1e','#1c3c2a','#285236','#356a42','#4a8452','#6aa066','#93bf86']),roofT:R3(['#11302e','#18443f','#205a52','#2c7266','#3f8c7c','#5ea896','#8cc6b2']),
  roofR:R3(['#3a1a26','#552433','#723044','#904058','#ab5a6e','#c47c8a','#dca6ac']),
  awc:R3(['#8f8167','#c9bb9a','#ebe0c5','#fbf4e2']),awg:R3(['#2f4f37','#46704a','#64935f','#8bb67b']),
  leaf:R3(['#12302d','#1a4434','#265c39','#357640','#4b9146','#6aac50','#93c962','#c3e384']),
  sack:R3(['#5a4128','#86643c','#ad8a55','#cdae74','#e6cf98']),
  flw:[R3(['#8f3553','#d0577a','#f38fa8','#ffc6d3']),R3(['#a06a17','#dea42a','#f6d453','#fff3a3']),R3(['#8a90a8','#cdd2e0','#f1f3f9','#ffffff']),R3(['#6e1b26','#b02f39','#de574d','#f79179'])],
};
/* 1ドットごとに「色・面の向き・高さ/かげ/つや」を持つ絵 */
function Surf3(w,h,base){const col=new Uint8ClampedArray(w*h*4),nrm=new Uint8ClampedArray(w*h*4),dat=new Uint8ClampedArray(w*h*4);
  const o={w,h,col,nrm,dat,base:base===undefined?h-1:base,
    put(x,y,c,n,ao,spec,z){x|=0;y|=0;if(x<0||y<0||x>=w||y>=h||!c)return;const i=(y*w+x)*4,l=Math.hypot(n[0],n[1],n[2])||1;
      col[i]=c[0];col[i+1]=c[1];col[i+2]=c[2];col[i+3]=255;nrm[i]=(n[0]/l*.5+.5)*255;nrm[i+1]=(n[1]/l*.5+.5)*255;nrm[i+2]=(n[2]/l*.5+.5)*255;nrm[i+3]=255;
      const zz=z===undefined?o.base-y:z;dat[i]=Math.max(0,Math.min(255,zz*3));dat[i+1]=(ao===undefined?1:ao)*255;dat[i+2]=(spec||0)*255;dat[i+3]=255;},
    S(x,y,P,v,n,ao,spec,z){o.put(x,y,P[ci(dq(v,x,y),P)],n,ao,spec,z);},
    on(x,y){return x>=0&&y>=0&&x<w&&y<h&&col[(y*w+x)*4+3]>0;},
    clear(){col.fill(0);nrm.fill(0);dat.fill(0);},
    cv(){return{c:bufCanvas(w,h,col),n:bufCanvas(w,h,nrm),d:bufCanvas(w,h,dat)};}};
  return o;}
// 土台に3枚とも写す（地面の高さは0のまま。物の高さは自分の足もとから）
function stamp3(g,o,X,Y){g.drawImage(bufCanvas(o.w,o.h,o.col),X,Y);if(!NB)return;
  for(let y=0;y<o.h;y++)for(let x=0;x<o.w;x++){const i=(y*o.w+x)*4;if(!o.col[i+3])continue;const wx=X+x,wy=Y+y;if(wx<0||wy<0||wx>=NB.w||wy>=NB.h)continue;const j=(wy*NB.w+wx)*4;
    for(let k=0;k<3;k++){NB.n[j+k]=o.nrm[i+k];NB.d[j+k]=o.dat[i+k];}}}
function sil3(o){const d=new Uint8ClampedArray(o.w*o.h*4);for(let i=0;i<o.w*o.h;i++)if(o.col[i*4+3])d[i*4+3]=255;return bufCanvas(o.w,o.h,d);}

/* ---- 家：屋根は手前にかたむいた面、壁は手前向きの面（壁の種類・窓・戸・えんとつ・ひさし・かんばん） ---- */
function makeBld(o){
  const W=o.W,H=o.H,s=Surf3(W,H,H-1),S=s.S,RP=PS[o.roof],ry=o.ry||3,rh=o.rh,sd=o.seed||0;
  const RN=[0,.55,.83],RE=[0,.95,.3],wins=[];
  for(let y=ry;y<=ry+rh;y++)for(let x=1;x<=W-2;x++){let v,n=RN,ao=1;
    if(x<=3||x>=W-4){S(x,y,PS.wood,x===1||x===W-2?1:3.4,x<=3?[-.85,.3,.42]:[.85,.3,.42],1);continue;}   // 屋根の端の板
    if(y===ry){S(x,y,RP,1,[0,-.6,.8],1);continue;}
    if(y<=ry+2){S(x,y,RP,y===ry+1?5:4,[0,-.15,1],1);continue;}       // むね
    const r=Math.floor((y-ry-3)/4),yy=(y-ry-3)%4,off=(r&1)*3,c=Math.floor((x+off)/6),sx=(x+off)%6;
    v=4+(h3(c,r,21+sd)-.5)*.9-yy*.2;
    if(yy===3){v=2;n=RE;ao=.72;}if(sx===0&&yy<3){v=Math.min(v,2.6);ao=.75;}if(h3(x,y,22+sd)<.04)v-=.7;
    S(x,y,RP,v,n,ao);}
  const ey=ry+rh+1;for(let x=0;x<W;x++){S(x,ey,PS.wood,4,[0,.6,.8],1);S(x,ey+1,PS.wood,2.4,NF,.7);S(x,ey+2,PS.wood,1.2,[0,.5,-.85],.5);}     // のき
  if(o.chim){const[cx,cw,ch]=o.chim;for(let y=ry-ch;y<=ry+8;y++)for(let x=cx;x<cx+cw;x++){const course=Math.floor((y-ry+ch)/3),off=(course&1)*2;let v=3.2,n=NF;
    if((y-ry+ch)%3===2||(x+off)%4===0)v=1.3;if(x===cx){n=[-.9,.4,0];v-=.3;}if(x===cx+cw-1)n=[.9,.4,0];
    if(y<=ry-ch+1){S(x,y,PS.iron,y===ry-ch?2.5:1.6,y===ry-ch?NU:NF,1,.2,H-1-y+4);continue;}S(x,y,PS.brick,v,n,1,0,H-1-y+4);}}
  const wT=ey+3,wB=H-7,x0=4,x1=W-5;
  for(let y=wT;y<=wB;y++)for(let x=x0;x<=x1;x++){const top=Math.min(1,.5+(y-wT)*.12);
    if(o.wall==='stone'){const course=Math.floor((y-wT)/5),off=(course&1)*5,bx=Math.floor((x+off)/9),sx=(x+off)%9,sy=(y-wT)%5;
      let v=3+(h3(bx,course,51+sd)-.5)*1.1+(h3(x,y,52)-.5)*.4;const n=[0,1,0];let ao=top;
      if(sy===0){n[2]=.6;v+=.4;}if(sy===4){v=1.2;ao*=.6;}if(sx===0){v=1.3;ao*=.6;}if(sx===1)n[0]=-.5;if(sx===8)n[0]=.5;
      S(x,y,PS.wall,v,n,ao);}
    else if(o.wall==='plank'){const py=(y-wT)%4;let v=3.3+(h3(Math.floor((x+(py*7))/23),Math.floor((y-wT)/4),55+sd)-.5)*.8+(h3(x,y,56)<.05?-.8:0);
      const n=py===0?[0,.75,.65]:py===3?[0,.8,-.6]:NF;S(x,y,PS.wood,py===3?2:v,n,top*(py===3?.75:1));}
    else if(o.wall==='brick'){const course=Math.floor((y-wT)/3),off=(course&1)*3,sx=(x+off)%6,sy=(y-wT)%3;let v=3.4+(h3(Math.floor((x+off)/6),course,57+sd)-.5)*.9;
      let n=NF,ao=top;if(sy===2||sx===0){v=1.2;ao*=.65;}else if(sy===0)n=[0,.7,.7];S(x,y,PS.brick,v,n,ao);}
    else{const v=3.6+(h3(x,y,31+sd)-.5)*.5+(vn3(x/6,y/6,32)-.5)*.6;S(x,y,PS.plast,v,[(vn3(x*.6,y*.6,33)-.5)*.2,1,(vn3(x*.6,y*.6,34)-.5)*.2],top);}}
  if(o.beams){const beam=b=>{for(let y=wT;y<=wB;y++){S(b,y,PS.wood,3.6,[-.75,.65,0],1);S(b+1,y,PS.wood,3.4,NF,1);S(b+2,y,PS.wood,3.1,[.75,.65,0],.85);}};
    o.beams.forEach(beam);const mid=o.belt||Math.round((wT+wB)/2);
    for(let x=x0;x<=x1;x++){S(x,wT,PS.wood,3,[0,.6,-.8],.6);S(x,wT+1,PS.wood,3.3,NF,.75);S(x,mid,PS.wood,3.4,[0,.7,.7],1);S(x,mid+1,PS.wood,3.3,NF,1);S(x,mid+2,PS.wood,3,[0,.6,-.8],.8);}}
  for(let y=H-6;y<H;y++)for(let x=2;x<=W-3;x++){const c=y<H-3?0:1,off=c*5,bx=Math.floor((x+off)/10),sx=(x+off)%10,sy=(y-H+6)%3;      // 土台の石
    let v=3.1+(h3(bx,c,41+sd)-.5)*1;const n=[0,1,0];let ao=1;
    if(sy===0)n[2]=.8;if(sy===2){n[2]=-.6;ao=.7;}if(sx===1)n[0]=-.7;if(sx===9)n[0]=.7;if(sx===0){v=1.2;ao=.5;}if(y===H-1)ao=.5;
    if(o.door&&x>=o.door[0]-2&&x<=o.door[0]+o.door[1]+1&&y<H-3){v+=.6;n[2]+=.6;}S(x,y,PS.stone[2],v,n,ao,0,H-1-y);}
  for(const[wx,wy,box]of(o.wins||[])){               // 窓（木のわく・ガラス・十字・花のプランター）
    for(let y=wy;y<=wy+13;y++)for(let x=wx;x<=wx+13;x++){let v=3.2,n=NF;if(y===wy){n=[0,.6,.8];v=3.6;}if(y===wy+13){n=[0,.3,.95];v=3.8;}
      if(x===wx)n=[-.7,.7,0];if(x===wx+13)n=[.7,.7,0];S(x,y,PS.wood,v,n,1);}
    for(let gy=0;gy<10;gy++)for(let gx=0;gx<10;gx++){const x=wx+2+gx,y=wy+2+gy;
      if(gx===4||gx===5){S(x,y,PS.wood,3,[gx===4?-.6:.6,.8,0],.8);continue;}if(gy===5){S(x,y,PS.wood,3,[0,.6,.8],.8);continue;}
      S(x,y,PS.glass,(gy<2?2.6:1.6)-gy*.05+(gx+gy===3?2:0),NF,.7,.95);}
    wins.push([wx+2,wy+2,10,10]);
    if(box){for(let x=wx-1;x<=wx+14;x++){S(x,wy+14,PS.wood,3.8,[0,.4,.9],1);S(x,wy+15,PS.wood,3.2,NF,1);S(x,wy+16,PS.wood,1.6,[0,.5,-.85],.6);}
      for(let i=0;i<6;i++){const fx=wx+i*2+(h3(i,wx,61+sd)*2|0),P=PS.flw[(h3(i,wy,62+sd)*4)|0];
        S(fx,wy+13,PS.leaf,3.2,[-.3,.5,.8],1);S(fx+1,wy+13,PS.leaf,3.6,[.3,.5,.8],1);S(fx,wy+12,P,2.6,[-.4,.2,.9],1);S(fx+1,wy+12,P,3.2,[.4,.2,.9],1);if(h3(i,1,63+sd)<.6)S(fx,wy+11,P,3,[0,-.2,1],1);}}}
  if(o.door){const[dx,dw]=o.door,dt=H-7-24,d1=dx+dw-1;            // 戸（上は丸い）
    for(let y=dt;y<=H-7;y++){const x0d=y===dt?dx+3:y===dt+1?dx+1:dx,x1d=y===dt?d1-3:y===dt+1?d1-1:d1;for(let x=x0d;x<=x1d;x++){
      let v=3.2,n=NF,ao=1;if(x===x0d||x===x1d||y===dt){v=1.4;ao=.6;}else{const p=(x-dx-1)%4;if(p===0)n=[-.5,.85,0];if(p===3){n=[.5,.85,0];v=2.8;}
        if(y===dt+6||y===dt+18){n=[0,.6,.8];v=3.7;}if(y===dt+7||y===dt+19){n=[0,.6,-.8];v=2.6;}}
      S(x,y,o.doorP?PS[o.doorP]:PS.wood,v,n,ao);}}
    S(d1-3,dt+13,PS.iron,4,[.2,.6,.8],1,.6);S(d1-3,dt+14,PS.iron,2,NF,1,.4);
    if(o.lantern){const lx=d1+3,ly=dt+4;for(let y=ly;y<=ly+5;y++)for(let x=lx;x<=lx+2;x++)S(x,y,PS.iron,y===ly||y===ly+5||x!==lx+1?2:1,cylN(x-lx-1),1,.4);wins.lantern=[lx+1,ly+2];}}
  if(o.awning){const[a0,a1,ay]=o.awning;for(let y=ay;y<=ay+7;y++)for(let x=a0;x<=a1;x++){const st=Math.floor((x-a0)/4),P=st&1?PS.awg:PS.awc,sx=(x-a0)%4;
    if(y===ay+7&&(sx===0||sx===3))continue;if(y===ay){S(x,y,PS.wood,2,[0,-.3,.95],1);continue;}const fr=y>=ay+6;S(x,y,P,sx===0?2.4:3,fr?NF:[(sx-1.5)*.15,.7,.7],fr?.85:1);}}
  if(o.sign){const[sx0,sy0,icon]=o.sign;for(let x=sx0-1;x<=sx0+9;x++)S(x,sy0-2,PS.iron,2.6,[0,.5,.85],1,.4);[[sx0,sy0-1],[sx0+8,sy0-1]].forEach(([x,y])=>S(x,y,PS.iron,2,NF,1));
    for(let y=sy0;y<=sy0+8;y++)for(let x=sx0-2;x<=sx0+10;x++){let v=3.3,n=NF;if(y===sy0)n=[0,.4,.9];if(x===sx0-2)n=[-.7,.7,0];if(x===sx0+10)n=[.7,.7,0];if(y===sy0+8)n=[0,.5,-.85];if(h3(x,y,71)<.1)v-=.5;S(x,y,PS.wood,v,n,1);}
    icon.forEach((r,j)=>{for(let i=0;i<r.length;i++){const ch=r[i];if(ch==='.')continue;const P=ch==='i'?PS.iron:ch==='w'?PS.wood:PS.leaf,v=ch==='i'?3.4:ch==='w'?4.6:3.6;S(sx0+1+i,sy0+1+j,P,v,[0,.7,.7],1,ch==='i'?.6:0);}});}
  return{s,sil:sil3(s),wins};}

/* ---- 小物 ---- */
function makeLamp(){const s=Surf3(9,34,33),S=s.S;
  const rows=["....o....","...ooo...","..ooooo..",".ooooooo.",".o.....o.",".o.....o.",".o.....o.",".o.....o.",".o.....o.",".o.....o.",".ooooooo.","...ooo..."];
  rows.forEach((r,y)=>{for(let x=0;x<9;x++)if(r[x]==='o')S(x,y,PS.iron,2.6,y<=3?sphereN((x-4)/4.5,-.6):cylN((x-4)/4),1,.4);});
  for(let y=4;y<=9;y++)for(let x=2;x<=6;x++)s.put(x,y,C3('#d6e0df'),cylN((x-4)/3),1,.8);
  for(let y=12;y<=29;y++)for(let x=3;x<=5;x++)S(x,y,PS.iron,2.8,cylN((x-4)/1.4),1,.5);
  for(let x=2;x<=6;x++)S(x,20,PS.iron,3,cylN((x-4)/2.4),1,.5);
  for(let y=30;y<=33;y++){const w=y<32?2:3;for(let x=4-w;x<=4+w;x++)S(x,y,PS.iron,2.6,y===30||y===32?[(x-4)/(w+1),.4,.8]:cylN((x-4)/(w+.5)),1,.4);}
  return s;}
function makeBench(){const W=24,H=13,s=Surf3(W,H,H-1),S=s.S;
  for(let x=2;x<=21;x++){S(x,1,PS.wood,3.4,[0,.5,.85],1);S(x,2,PS.wood,3.2,NF,1);S(x,3,PS.wood,2.8,[0,.6,-.8],.8);S(x,4,PS.wood,3.4,[0,.5,.85],1);S(x,5,PS.wood,3,NF,.9);
    S(x,7,PS.wood,3.5,NU,1);S(x,8,PS.wood,3.3,[0,.5,.85],1);S(x,9,PS.wood,2.8,NF,.85);}
  [3,19].forEach(x=>{for(let y=0;y<=12;y++){if(y>9||y<7){S(x,y,PS.iron,2.4,[-.6,.8,0],1,.3);S(x+1,y,PS.iron,2.2,[.6,.8,0],1,.3);}}});
  for(let x=1;x<=22;x++)S(x,10,PS.wood,1.6,[0,.4,-.9],.5);return s;}
function makeAnvil(){const s=Surf3(16,12,11),S=s.S;
  for(let x=1;x<=14;x++){const tip=x<4?(4-x):0;for(let y=1+Math.floor(tip/2);y<=4;y++)S(x,y,PS.iron,y===1+Math.floor(tip/2)?3.6:y===4?1.4:2.6,y===1+Math.floor(tip/2)?NU:NF,1,.6);}
  for(let y=5;y<=8;y++)for(let x=6;x<=10;x++)S(x,y,PS.iron,2.2,cylN((x-8)/2.6),.85,.4);
  for(let y=9;y<=11;y++)for(let x=4;x<=12;x++)S(x,y,PS.wood,y===9?3.6:2.8,y===9?[0,.5,.85]:cylN((x-8)/4.6),1);return s;}
function makeLogs(){const s=Surf3(22,14,13),S=s.S;
  const log=(cx,cy)=>{for(let y=-3;y<=3;y++)for(let x=-3;x<=3;x++){const d=Math.hypot(x,y*1.1);if(d>3.3)continue;S(cx+x,cy+y,d>2.4?PS.wood:PS.sack,d>2.4?2:3.4-d*.25,[x*.12,.85,y*.12],1);}};
  for(let y=4;y<=12;y++)for(let x=1;x<=20;x++)S(x,y,PS.wood,3,cylN((y-8)/5).map((v,i)=>i===0?0:v),y>10?.7:1);
  [[4,8],[11,8],[18,8],[7,3],[14,3]].forEach(([x,y])=>log(x,y));return s;}
function makeBarrel(){const W=12,H=15,s=Surf3(W,H,H-1),S=s.S;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const bulge=(y>2&&y<12)?0:1;if(x<bulge||x>W-1-bulge)continue;const u=(x-5.5)/(6-bulge);
    if(y<3){S(x,y,PS.wood,y===0?3:4,[u*.3,.2,.95],1);continue;}if(y===4||y===10){S(x,y,PS.iron,2.4,cylN(u),1,.4);continue;}const n=cylN(u);if(y>11)n[2]=-.4;
    S(x,y,PS.wood,3.1+(x%3===0?-.5:0),n,y===H-1?.6:1);}return s;}
function makeSacks(){const W=15,H=11,s=Surf3(W,H,H-1),S=s.S;
  const sack=(ox,oy,w,h)=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++){const nx=(x-w/2+.5)/(w/2),ny=(y-h/2)/(h/2);if(nx*nx+ny*ny*.7>1.05)continue;
    S(ox+x,oy+y,PS.sack,3+(h3(ox+x,oy+y,81)-.5)*.6,sphereN(Math.max(-1,Math.min(1,nx*.95)),Math.max(-1,Math.min(1,ny*.9))),nx*nx+ny*ny*.7>.8?.8:1);}
    S(ox+(w>>1),oy,PS.sack,1.4,NU,.7);S(ox+(w>>1)-1,oy+1,PS.sack,3.4,[-.5,0,.8],1);S(ox+(w>>1)+1,oy+1,PS.sack,2.8,[.5,0,.8],1);};
  sack(0,2,9,9);sack(6,1,9,10);return s;}

/* ---- 噴水（地面の丸と同じ角度：横16・たて11.5＝0.72、ふちの高さ6） ---- */
const FN={W:36,H:35,cx:18,rimY:16,rx:16,ry:11.5,wall:6,ox:110,oy:156};
const FW={ri:13.7,rj:9.8,wy:FN.rimY+1.5};
const inWaterF=(x,y)=>((x-FN.cx)/FW.ri)**2+((y-FW.wy)/FW.rj)**2<=1;
function makeFountain(){
  const{W,H,cx,rimY,rx,ry,wall}=FN,s=Surf3(W,H,H-1),ped=Surf3(W,H,H-1),S=s.S;
  const ri=rx-2.3,rj=ry-1.7,qO=(x,y)=>((x-cx)/rx)**2+((y-rimY)/ry)**2,qI=(x,y)=>((x-cx)/ri)**2+((y-rimY)/rj)**2;
  for(let x=0;x<W;x++){const ex=(x-cx)/rx;if(Math.abs(ex)>1)continue;const yl=Math.floor(rimY+ry*Math.sqrt(1-ex*ex));
    for(let k=1;k<=wall;k++){const y=yl+k;if(y>=H)continue;const course=Math.floor((k-1)/3),off=course*3,sx=(x+off)%6,sy=(k-1)%3;
      let v=3.2+(h3(Math.floor((x+off)/6),course,91)-.5)*.6,n=cylN(ex),ao=1;
      if(sx===0){v=1.6;ao=.6;}if(sy===0&&k>1)n=[ex*.6,.6,.6];if(k===1)ao=.55;if(k>=wall)ao*=.75;
      S(x,y,PS.curb,v,n,ao,0,wall-k);}}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const qo=qO(x,y);if(qo>1)continue;const qi=qI(x,y);
    const rl=Math.hypot((x-cx)/rx,(y-rimY)/ry)||1,ux=(x-cx)/rx/rl,uy=(y-rimY)/ry/rl;
    if(qi>1){const a=Math.atan2((y-rimY)/ry,(x-cx)/rx),seg=((a+Math.PI)/(Math.PI*2)*12)%1;
      let n=NU,v=3.9+(h3(x,y,92)-.5)*.5;if(qo>.8)n=[ux*.55,uy*.55,.8];else if(qi<1.15)n=[-ux*.45,-uy*.45,.85];if(seg<.08)v=2.6;
      S(x,y,PS.curb,v,n,1,.1,wall);continue;}
    if(!inWaterF(x,y))S(x,y,PS.curb,2.2,[-ux,-uy*.2+.2,0],.5,0,wall-1);}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!s.on(x,y))continue;if(!s.on(x,y+1)&&!inWaterF(x,y+1))S(x,y,PS.curb,.6,NF,.6,0,0);}
  const bowlY=4,brx=6.5,bry=4.7;
  for(let y=bowlY+3;y<=FW.wy;y++)for(let x=cx-2;x<=cx+2;x++){let v=3.2,ao=1;const n=cylN((x-cx)/2.6);if(y===bowlY+7){n[2]=.6;v=3.6;}if(y===bowlY+8){n[2]=-.5;ao=.7;}if(y>=FW.wy-1)ao=.7;
    if(x===cx-2||x===cx+2)v=Math.min(v,1.8);ped.S(x,y,PS.curb,v,n,ao,0,wall-1+(FW.wy-y));}
  for(let y=0;y<=bowlY+bry+2;y++)for(let x=cx-8;x<=cx+8;x++){const e=((x-cx)/brx)**2+((y-bowlY)/bry)**2,ux=(x-cx)/brx,uy=(y-bowlY)/bry,rl=Math.hypot(ux,uy)||1;
    if(e<=1){if(e>.42)ped.S(x,y,PS.curb,e>.85?3.2:4.2,e>.85?[ux/rl*.6,uy/rl*.6,.7]:[-ux/rl*.3,-uy/rl*.3,.9],1,.1,17);else ped.S(x,y,PS.water,uy<-.3?2.4:3.2,[(h3(x,y,98)-.5)*.6,(h3(y,x,98)-.5)*.6,1],1,1,16.5);continue;}
    const exb=(x-cx)/brx;if(Math.abs(exb)<=1){const yl=bowlY+bry*Math.sqrt(1-exb*exb);if(y>yl&&y<=yl+2)ped.S(x,y,PS.curb,2.6,[exb*.7,.3,-.6],.7,0,16-(y-yl));}}
  const sc=document.createElement('canvas');sc.width=W;sc.height=H;const g=sc.getContext('2d');g.drawImage(bufCanvas(W,H,s.col),0,0);g.fillStyle='#000';g.beginPath();g.ellipse(cx,rimY,rx,ry,0,0,6.283);g.fill();g.drawImage(bufCanvas(W,H,ped.col),0,0);
  return{s,ped,sil:silOf(sc)};}
// 噴水の水（動く：1秒に12回だけ描きかえる）
const FWS=Surf3(FN.W,FN.H,FN.H-1);let FWC=null,FWT=-1,FPED=null;
function fountainWater(t){const k=Math.floor(t*12);if(k===FWT&&FWC)return FWC;FWT=k;t=k/12;FWS.clear();const cx=FN.cx;
  const hgt=(X,Y)=>{const a=(X-cx)/FW.ri,b=(Y-FW.wy)/FW.rj,rr=Math.sqrt(a*a+b*b);return Math.sin(rr*12-t*3.1)*.5+Math.sin(a*6+t*1.3+b*3)*.25+Math.sin(b*8-t*2.1)*.2;};
  for(let y=0;y<FN.H;y++)for(let x=0;x<FN.W;x++){if(!inWaterF(x,y))continue;const nx=(x-cx)/FW.ri,ny=(y-FW.wy)/FW.rj,r=Math.sqrt(nx*nx+ny*ny);
    const gx=hgt(x+1,y)-hgt(x-1,y),gy=hgt(x,y+1)-hgt(x,y-1);
    if(r<.22){FWS.put(x,y,PS.water[6+(h3(x,(t*8)|0,97)<.5?1:0)],[gx,gy,1],1,.3,5);continue;}
    let v=3.4-ny*.6;if(r>.88)v-=.7;FWS.S(x,y,PS.water,v,[-gx*1.4,-gy*1.4,1],r>.88?.7:1,1,5);}
  for(const side of[-1,1])for(let k2=0;k2<=7;k2++){const y=9+k2,x=cx+side*(5+Math.floor(k2/4));const ph=((k2-t*22+side*3)%5+5)%5;FWS.put(x,y,PS.water[ph<2?7:ph<3.5?5:4],[side*.4,.9,.2],1,.7,14-k2);}
  for(let y=0;y<=5;y++){const ph=((y+t*18)%4+4)%4;FWS.put(cx-1,y,PS.water[ph<2?7:6],[-.3,.9,.3],1,.8,22-y);FWS.put(cx,y,PS.water[ph<1.5?6:5],[.3,.9,.3],1,.8,22-y);}
  if(!FWC)FWC={c:document.createElement('canvas'),n:document.createElement('canvas'),d:document.createElement('canvas')};
  for(const[k3,a]of[['c',FWS.col],['n',FWS.nrm],['d',FWS.dat]]){const cv2=FWC[k3];cv2.width=FN.W;cv2.height=FN.H;const g=cv2.getContext('2d'),id=g.createImageData(FN.W,FN.H);id.data.set(a);g.putImageData(id,0,0);}
  return FWC;}

/* ---- 街の地面：石だたみ（ボロノイで石の形。ふちを丸め、ひとつずつ少しふくらませる）と、噴水のまわりのふち石 ---- */
const FC={x:128,y:172,rx:23,ry:16.6};
const isPlazaT=t=>t==='s'||t==='O'||t==='b'||t==='l';
function drawTownGround(g){
  const W=MW*TS,H=MH*TS,m='town',img=g.getImageData(0,0,W,H),px=img.data;
  const plaza=(x,y)=>{const t=tile(m,x>>4,y>>4);if(isPlazaT(t)){                         // 広場のかどは丸く
      const L=3*TS,R=13*TS-1,T=7*TS,B=16*TS-1,r=12;const cx=Math.min(Math.max(x,L+r),R-r),cy=Math.min(Math.max(y,T+r),B-r);
      return Math.hypot(x-cx,y-cy)<=r+(vn3(x*.35,y*.35,3)-.5)*2.4;}
    if(t==='p'||t==='k'){const lx=x&15,ly=y&15,w1=(vn3(y*.25,x>>4,5)-.5)*3,w2=(vn3(x*.25,y>>4,6)-.5)*3;
      const nb=(dx,dy)=>{const q=tile(m,(x>>4)+dx,(y>>4)+dy);return q==='p'||q==='k'||isPlazaT(q);};
      return(lx>=2+w1||nb(-1,0))&&(lx<=13+w2||nb(1,0))&&(ly>=2+w1||nb(0,-1))&&(ly<=13+w2||nb(0,1));}
    return false;};
  const mask=new Uint8Array(W*H);for(let y=0;y<H;y++)for(let x=0;x<W;x++)mask[y*W+x]=plaza(x,y)?1:0;
  const M=(x,y)=>x>=0&&y>=0&&x<W&&y<H?mask[y*W+x]:0;
  const ringAt=(x,y)=>{const ex=(x-FC.x)/FC.rx,ey=(y-FC.y)/FC.ry,q=Math.sqrt(ex*ex+ey*ey);if(q<.97||q>1.22)return null;const a=Math.atan2(ey,ex);return{rp:(q-.97)/.25,seg:Math.floor((a+Math.PI)/(Math.PI*2)*22),a};};
  const CW=7,CH=6,NX=Math.ceil(W/CW)+4,NY=Math.ceil(H/CH)+3,seeds=[];
  for(let cy=0;cy<NY;cy++)for(let cx=0;cx<NX;cx++){const off=(cy&1)?CW/2:0,t=h3(cx,cy,13);
    seeds.push({x:(cx-2)*CW+off+CW/2+(h3(cx,cy,11)-.5)*3.4,y:(cy-1)*CH+CH/2+(h3(cx,cy,12)-.5)*2.6,t:t<.6?0:t<.9?1:t<.98?2:3,v:h3(cx,cy,17)});}
  const lab=new Int32Array(W*H).fill(-2),typ=new Uint8Array(W*H),cen=new Float32Array(W*H*2);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!mask[y*W+x])continue;const rg=ringAt(x,y);
    if(rg){const sf=((rg.a+Math.PI)/(Math.PI*2)*22)%1;lab[y*W+x]=(rg.rp<.08||rg.rp>.92||sf<.11)?-1:100000+rg.seg;typ[y*W+x]=9;
      const ac=((rg.seg+.55)/22)*Math.PI*2-Math.PI,qm=1.095;cen[(y*W+x)*2]=FC.x+Math.cos(ac)*FC.rx*qm;cen[(y*W+x)*2+1]=FC.y+Math.sin(ac)*FC.ry*qm;continue;}
    const gx=Math.floor(x/CW)+2,gy=Math.floor(y/CH)+1;let d1=1e9,d2=1e9,k1=-1;
    for(let j=gy-1;j<=gy+1;j++)for(let i=gx-2;i<=gx+2;i++){if(i<0||j<0||i>=NX||j>=NY)continue;const sd=seeds[j*NX+i],dx=x-sd.x,dy=(y-sd.y)*1.12,d=Math.sqrt(dx*dx+dy*dy);
      if(d<d1){d2=d1;d1=d;k1=j*NX+i;}else if(d<d2)d2=d;}
    lab[y*W+x]=(d2-d1<1.15)?-1:k1;typ[y*W+x]=seeds[k1].t;cen[(y*W+x)*2]=seeds[k1].x;cen[(y*W+x)*2+1]=seeds[k1].y;}
  const LB=(x,y)=>x>=0&&y>=0&&x<W&&y<H?lab[y*W+x]:-2;
  const nearGrass=(x,y,r)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(!M(x+i,y+j))return true;return false;};
  const grassC=[C3(GR.dd),C3(GR.d),C3(GR.b),C3(GR.l)];
  const put=(x,y,c,n,ao,spec)=>{const i=(y*W+x)*4;px[i]=c[0];px[i+1]=c[1];px[i+2]=c[2];px[i+3]=255;nput(x,y,n,0,ao,spec);};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!mask[y*W+x])continue;const l=lab[y*W+x],ao=1;
    if(l===-1){if(nearGrass(x,y,3)&&h3(x,y,22)<.55){put(x,y,grassC[1+((h3(x,y,23)*2)|0)],[(vn3(x*.45,y*.45,61)-.5)*.6,(vn3(x*.45,y*.45,62)-.5)*.6,1],.85,0);continue;}
      const P=PS.mortar;put(x,y,P[ci(dq(1.4+(h3(x,y,21)-.5)*.8,x,y),P)],NU,.55,0);continue;}
    const P=typ[y*W+x]===9?PS.curb:PS.stone[typ[y*W+x]];
    const up=LB(x,y-1)!==l,lf=LB(x-1,y)!==l,dn=LB(x,y+1)!==l,rt=LB(x+1,y)!==l;
    const v=3.05+(l>=100000?.35:(seeds[l].v-.5)*.55)+(h3(x,y,24)<.07?(h3(x,y,25)<.5?-.7:.7):0)+(vn3(x/14,y/14,26)-.5)*.5;
    const cx=cen[(y*W+x)*2],cy=cen[(y*W+x)*2+1];
    put(x,y,P[ci(dq(v,x,y),P)],[(x-cx)*.09+(lf?-.75:0)+(rt?.75:0),(y-cy)*.1+(up?-.75:0)+(dn?.75:0),1],up||lf||dn||rt?.9:1,.08);
    if(nearGrass(x,y,1)&&h3(x,y,27)<.33)put(x,y,grassC[2+((h3(x,y,28)*2)|0)],NU,1,0);}
  g.putImageData(img,0,0);}
// 物の足もとを暗く（地面の「かげ」）
function contactAO(x0,y0,w,h,k){if(!NB)return;for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){if(x<0||y<0||x>=NB.w||y>=NB.h)continue;const i=(y*NB.w+x)*4;if(NB.d[i]>0)continue;
  const t=(y-y0)/h;NB.d[i+1]=Math.min(NB.d[i+1],255*(k+(1-k)*t));}}

/* ---- 街の建物と小物を置く（地図の上の位置） ---- */
const TOWN_OBJ={fountain:null};
function drawTownThings(g){
  const B=(o,X,Y)=>{stamp3(g,o.s,X,Y);CAST.push({sil:o.sil,x:X,y:Y,ay:Y+o.s.h-1});contactAO(X+2,Y+o.s.h,o.s.w-4,4,.55);
    for(const w of o.wins)WINDOWS.town.push([X+w[0],Y+w[1],Y+o.s.h,w[2],w[3]]);if(o.wins.lantern)LAMPS.town.push([X+o.wins.lantern[0],Y+o.wins.lantern[1]+26,26,30,'lan']);};
  LAMPS.town=[];
  const HAMMER=['..iiii.','..iiii.','...w...','...w...','...w...','...w...'],SPROUT=['.gg.gg.','gggggg.','..gg...','...w...','..www..','.wwwww.'];
  // 工房（クロエ）：石の壁・暗い屋根・大きな戸・えんとつ・金づちのかんばん
  B(makeBld({W:88,H:80,roof:'roofS',rh:23,wall:'stone',door:[34,20],wins:[[7,40,0],[66,40,0]],chim:[66,8,9],sign:[23,36,HAMMER],seed:3}),12,16);
  // 種屋「こぼれ種」（ネリネ）：しっくいと木わく・緑の屋根・ひさし・窓の花・芽のかんばん・戸のよこのランタン
  B(makeBld({W:88,H:80,roof:'roofG',rh:23,wall:'plaster',beams:[4,30,55,81],door:[36,16],doorP:'wood',wins:[[10,40,1],[64,40,1]],awning:[30,57,34],sign:[66,31,SPROUT],lantern:1,seed:5}),156,16);
  // 下の家3つ
  B(makeBld({W:72,H:76,roof:'roofB',rh:21,wall:'plaster',beams:[4,40,65],door:[20,16],wins:[[46,38,1]],chim:[50,7,8],seed:7}),12,260);
  B(makeBld({W:72,H:76,roof:'roofT',rh:21,wall:'plank',door:[20,16],wins:[[46,38,1]],seed:9}),92,260);
  B(makeBld({W:72,H:76,roof:'roofR',rh:21,wall:'brick',door:[20,16],wins:[[46,38,1]],chim:[14,7,8],seed:11}),172,260);
  // 噴水（ふちと柱は土台、水は毎コマ）
  const F=makeFountain();stamp3(g,F.s,FN.ox,FN.oy);CAST.push({sil:F.sil,x:FN.ox,y:FN.oy,ay:FN.oy+FN.H-1});TOWN_OBJ.fountain=F;
  contactAO(FN.ox+1,FN.oy+FN.H-1,FN.W-2,3,.5);
  // 街灯（広場のよすみ）
  const Lp=makeLamp(),lsil=sil3(Lp);
  LAMPS.town.push([FC.x,FC.y,14,36,'glow']);
  for(const[tx,ty]of[[3,7],[12,7],[3,15],[12,15]]){const X=tx*TS+4,ay=ty*TS+12;stamp3(g,Lp,X,ay-33);CAST.push({sil:lsil,x:X,y:ay-33,ay});LAMPS.town.push([X+4,ay,29,54,'lamp']);}
  // ベンチ・金床・材木・たる・袋
  const Bn=makeBench(),bsil=sil3(Bn);for(const[tx,ty]of[[4,9],[11,9]]){const X=tx*TS-4,Y=ty*TS+3;stamp3(g,Bn,X,Y);CAST.push({sil:bsil,x:X,y:Y,ay:Y+12});contactAO(X+2,Y+11,20,3,.6);}
  const An=makeAnvil();stamp3(g,An,5*TS,6*TS+3);CAST.push({sil:sil3(An),x:5*TS,y:6*TS+3,ay:6*TS+14});
  const Lg=makeLogs();stamp3(g,Lg,6*TS+2,5*TS+2);CAST.push({sil:sil3(Lg),x:6*TS+2,y:5*TS+2,ay:5*TS+15});
  const Ba=makeBarrel();stamp3(g,Ba,13*TS+2,6*TS);CAST.push({sil:sil3(Ba),x:13*TS+2,y:6*TS,ay:6*TS+14});
  const Sa=makeSacks();stamp3(g,Sa,14*TS-3,6*TS+4);CAST.push({sil:sil3(Sa),x:14*TS-3,y:6*TS+4,ay:6*TS+14});
}

