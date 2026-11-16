/* ---------- 牧場と森の景色（3枚組で1ドットずつ）：広葉樹の林と風・さく・岩 ----------
   木は土台に焼きこまず、毎コマ「風でかたむいた絵」をえらんで、人といっしょに奥から順に描く（影もいっしょにゆれる）。
   木の形・大きさ・葉の色・さくの古さ・岩の形は場所で決まる（同じ地図ならいつも同じ）。色の段 PS は town.js */
Object.assign(PS,{
  leafD:R3(['#0e2620','#14362a','#1c4a31','#275f37','#367540','#4a8c4a','#6aa65a','#97c47a']),   // 深い緑（かげの多い林）
  leafF:R3(['#173420','#204a28','#2e6430','#41803a','#5c9c44','#80b852','#a8d066','#d2e68c']),   // あたたかい緑
  leafY:R3(['#1d3a1a','#29521f','#386c26','#4c8830','#66a33a','#88bd48','#afd462','#d9ea92']),   // 若葉（若い木）
  grass:R3(['#2c6224','#3a782c','#468a32','#579d3d','#6db34b','#87c95c','#a6dd73']),
  bark:R3(['#22150f','#372318','#4f3322','#69462d','#835b3a','#9f744b']),
  fruitR:R3(['#4e0e16','#82192a','#b82c32','#de4c3c','#f68564','#ffc29a']),
  fruitO:R3(['#5a2a08','#8c4410','#c06618','#e68c26','#f8b848','#ffe08a']),
  woodN:R3(['#2e1c12','#4a2f1c','#6c4528','#8e5d34','#ae7842','#c99455','#e0b273']),
  woodO:R3(['#2a2624','#403a35','#5a524a','#756b5f','#918675','#ab9f8b','#c6bba6']),
  woodL:R3(['#3e2716','#5e3e22','#83592f','#a8773f','#c99552','#e1b26c','#f0cf92']),
  roofF:R3(['#3a1610','#5c2316','#83321c','#a84726','#c66033','#dc8148','#ecaa72']),
  moss:R3(['#1c3a1c','#295224','#3a6c2c','#538838','#74a446','#9cc05c']),
  ivy:R3(['#10301a','#184420','#235c28','#327634','#4a9240','#70ae52']),
  mush:R3(['#5a1a14','#8a2a1c','#b84a2c','#dc7444','#f2a46a']),
  cap:R3(['#a89c88','#cfc4b0','#e8dfcb','#fbf6ea']),
  gold:R3(['#6a4a10','#a87a1c','#e0b030','#ffe070','#fff6c0']),
});
// 色に焼きこむ光（左上の手前から）。光の演出のときは、これに日の向きの光が重なる
const LDIR=(()=>{const v=[-.5,.22,.84],l=Math.hypot(v[0],v[1],v[2]);return v.map(a=>a/l);})();
const lit3=n=>{const l=Math.hypot(n[0],n[1],n[2])||1;return Math.max(0,(n[0]*LDIR[0]+n[1]*LDIR[1]+n[2]*LDIR[2])/l);};
const mix3=(a,b,k)=>[a[0]*k+b[0]*(1-k),a[1]*k+b[1]*(1-k),a[2]*k+b[2]*(1-k)];
const cl1=v=>Math.max(-1,Math.min(1,v));
// 絵の下のはし（影を落とす線）
function bottomOf(s){let by=0;for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++)if(s.on(x,y)){by=y+1;break;}return by;}
// 動く物の3枚組（blit3 がそのまま使う形）
function sprite3(s){const v=s.cv(),c=v.c;c.nd={n:v.n,d:v.d,sil:sil3(s),by:bottomOf(s)};return c;}

/* ---- 風：日ごとの強さ（おだやか・ふつう・風の日）×時間（昼すぎがいちばん強い）＋ときどき西から通りぬける強い風 ---- */
function windDay(){const d=S?S.day:1,h=h3(d,31,7);return h<.3?.45:h<.75?.7:1;}
function windAt(wx,wy,now){
  const t=S?S.time/60:12,b=windDay()*(.5+.5*Math.max(0,Math.sin((t-5)/16*Math.PI)));
  const sway=Math.sin(now*1.7+wx*.05+wy*.013)*.55+Math.sin(now*3.1+wx*.13-wy*.05)*.2;
  const P=7,k=Math.floor(now/P),gx=(now/P-k)*(MW*TS+240)-120,g=Math.exp(-(((wx-gx)/46)**2))*(h3(k,13,5)<b?1:.25);
  return b*(1.1+sway)+g*1.7*b;}

/* ---- 木の部品 ---- */
function bark(s,cx,y0,y1,w,sd){for(let y=y0;y<=y1;y++){const hw=w/2+(y===y1?1.5:y===y1-1?.8:0);
  for(let x=Math.floor(cx-hw);x<Math.ceil(cx+hw);x++){const n=cylN((x+.5-cx)/hw);
    s.S(x,y,PS.bark,1.4+2.8*lit3(n)+(h3(x,0,sd)<.3?-.7:0)+(h3(x,y,sd+1)<.07?-.6:0),n,y>=y1-1?.7:1,0);}}}
// 葉のかたまり：大きな形（丸の重なり）の中に小さなかたまりをしきつめ、下のかたまりが手前に重なる
function canopy(s,P,o){
  const inB=(x,y)=>{for(const b of o.b)if((x-b[0])**2+((y-b[1])*1.1)**2<=b[2]*b[2])return true;return false;};
  let x0=99,x1=-99,y0=99,y1=-99;for(const b of o.b){x0=Math.min(x0,b[0]-b[2]);x1=Math.max(x1,b[0]+b[2]);y0=Math.min(y0,b[1]-b[2]);y1=Math.max(y1,b[1]+b[2]);}
  const cl=[],st=o.cr*1.2;
  for(let gy=y0,r=0;gy<=y1+st;gy+=st*.75,r++)for(let gx=x0+(r&1)*st*.5;gx<=x1+st;gx+=st){
    const jx=gx+(h3(gx*7|0,gy*5|0,o.sd)-.5)*st*.7,jy=gy+(h3(gy*3|0,gx*11|0,o.sd+1)-.5)*st*.5;
    if(inB(jx,jy))cl.push([jx,jy,o.cr*(.8+h3(jx*13|0,jy*7|0,o.sd+2)*.5)]);}
  for(let y=Math.floor(y0)-1;y<=Math.ceil(y1)+1;y++)for(let x=Math.floor(x0)-1;x<=Math.ceil(x1)+1;x++){
    const px=x+.5,py=y+.5;if(!inB(px,py))continue;
    let best=null,bp=-1e9,bd=1e9,near=cl[0];
    for(const c of cl){const d=Math.hypot(px-c[0],(py-c[1])*1.1);if(d<=c[2]){const p=c[1]+h3(c[0]*9|0,c[1]*9|0,o.sd+3)*1.5;if(p>bp){bp=p;best=c;}}if(d-c[2]<bd){bd=d-c[2];near=c;}}
    const c=best||near,lx=(px-c[0])/c[2],ly=(py-c[1])*1.1/c[2],ld=Math.hypot(lx,ly);
    const n=mix3(sphereN(cl1((px-o.cx)/o.rx*.88),cl1((py-o.cy)/o.ry*.88)),sphereN(cl1(lx*.8),cl1(ly*.8)),.5);
    const L=lit3(n),edge=!inB(px-1,py)||!inB(px+1,py)||!inB(px,py-1)||!inB(px,py+1);
    let v=o.v0+o.vr*L,ao=1;
    if(ld>.72&&ly>.15){v-=1.2;ao=.82;}else if(ld<.45&&ly<0)v+=.35;     // かたまりの下は暗く、上は明るく
    const r=h3(x,y,o.sd+7+(o.fl?41:0));if(r<.06)v-=1;else if(r>.94&&L>.45)v+=1.3;   // 葉のちらつき（fl で入れかわる）
    if(py>o.cy+o.ry*.4)ao*=.86;
    if(edge)v=Math.min(v,o.v0+.5);
    s.S(x,y,P,v,n,ao,.05);}
  return cl;}
function fruitDots(s,P,cl,n,sd,cy,ry){let k=0;
  for(let i=0;i<cl.length*2&&k<n;i++){const c=cl[(i*7+sd)%cl.length];if(c[1]<cy-ry*.4)continue;
    const fx=Math.round(c[0]+(h3(i,sd,5)-.5)*3),fy=Math.round(c[1]+c[2]*.35);
    if(!s.on(fx,fy)||!s.on(fx+1,fy+1)||!s.on(fx+1,fy)||!s.on(fx,fy+1))continue;
    s.S(fx,fy,P,4.6,[-.5,-.2,.85],1,.55);s.S(fx+1,fy,P,3.4,[.5,-.2,.85],1,.45);s.S(fx,fy+1,P,2.6,[-.5,.6,.6],1,.35);s.S(fx+1,fy+1,P,1.8,[.5,.6,.6],1,.3);k++;}}
// 枝（幹の上から葉のかたまりへ。葉のすきまから見える）
function limb(s,x0,y0,x1,y1,w){const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)));
  for(let i=0;i<=n;i++){const t=i/n,x=x0+(x1-x0)*t,y=Math.round(y0+(y1-y0)*t),hw=Math.max(.5,w*(1-t*.6)/2);
    for(let xx=Math.floor(x-hw);xx<Math.ceil(x+hw);xx++){const nn=cylN((xx+.5-x)/hw);s.S(xx,y,PS.bark,1.1+2.6*lit3(nn),nn,.8,0);}}}

/* ---- 木の形：広葉樹（形4つ×大きさ3つ×葉の色）と低木。実のなる木は畑に植える木で使う予定 ---- */
const TW=48,TH=58,TAX=24,TAY=54;           // 木の絵の大きさと足もと（足もと＝マスの上から14ドット）
const TAMP={oak:1,fruit:.9,bush:.55};
const LEAFP=()=>[PS.leafD,PS.leaf,PS.leafF,PS.leafY];
// 広葉樹：sd＝形（まるい・片がわに広がった・横に広い・かたまりが分かれた）＋4×大きさ＋12×葉の色
function oakModel(s,cx,b,R,sd,fl){const shape=sd%4,size=((sd/4)|0)%3,P=LEAFP()[((sd/12)|0)%4],k=[.78,1,1.2][size];
  let r,th,cy,B,rx,ry,nx=0;
  if(shape===0){r=(8+R(1)*1.6)*k;th=6+((R(2)*3)|0);cy=b-th-r*.85;
    B=[[cx,cy,r],[cx-r*.5,cy+r*.3,r*.58],[cx+r*.5,cy+r*.25,r*.6],[cx+(R(5)-.5)*r*.7,cy-r*.5,r*.62]];rx=r*1.15;ry=r*1.05;}
  else if(shape===1){const sd2=R(5)<.5?-1:1;r=(7.6+R(1)*1.4)*k;th=6+((R(2)*3)|0);cy=b-th-r*.85;nx=sd2*r*.3;   // 片がわに広がった形
    B=[[cx+sd2*r*.35,cy,r],[cx-sd2*r*.55,cy+r*.35,r*.6],[cx+sd2*r*1.05,cy+r*.3,r*.6],[cx+sd2*r*.1,cy-r*.55,r*.7]];rx=r*1.4;ry=r*1.05;}
  else if(shape===2){r=(7.6+R(1)*1.4)*k;th=5+((R(2)*3)|0);cy=b-th-r*.8;
    B=[[cx,cy,r],[cx-r*.95,cy+r*.28,r*.72],[cx+r*.95,cy+r*.22,r*.75],[cx-r*.45,cy-r*.5,r*.62],[cx+r*.5,cy-r*.42,r*.6]];rx=r*1.75;ry=r;}
  else{r=(7.4+R(1)*1.4)*k;th=7+((R(2)*3)|0);cy=b-th-r*.9;
    B=[[cx-r*.64,cy+r*.18,r*.6],[cx+r*.66,cy+r*.3,r*.56],[cx+(R(5)-.5)*r*.5,cy-r*.62,r*.64]];if(R(6)<.4)B.push([cx+(R(7)-.5)*r*.5,cy+r*.75,r*.36]);rx=r*1.3;ry=r*1.1;}
  const top=Math.floor(cy+r*(shape===3?.5:.2)),tw=(shape===2?3.8:3.1)+R(4)*.8+size*.4;
  bark(s,cx,top,b,tw,sd);
  for(const c of B)if(c!==B[0]||shape===3)limb(s,cx+(c[0]>cx?.6:-.6),top+1,c[0],c[1]+c[2]*.2,tw*.62);   // 枝
  return canopy(s,P,{b:B,cx:cx+nx,cy,rx,ry,cr:3.2+size*.2,v0:.5,vr:4.9,sd:sd*13+1,fl});}
function treeModel(kind,sd,fl){const s=Surf3(TW,TH,TAY),R=k=>h3(sd,k,kind.length*7+3),cx=TAX+.5,b=TAY;
  if(kind==='oak')oakModel(s,cx,b,R,sd,fl);
  else if(kind==='fruit'){const r=7.8+R(1)*2,th=5+((R(2)*3)|0),cy=b-th-r*.9;
    bark(s,cx,Math.floor(cy),b,3,sd);
    const cl=canopy(s,PS.leafF,{b:[[cx,cy,r],[cx-r*.48,cy+r*.35,r*.58],[cx+r*.48,cy+r*.35,r*.58]],cx,cy,rx:r*1.15,ry:r,cr:3.2,v0:.8,vr:4.6,sd:sd*17+5,fl});
    fruitDots(s,R(6)<.6?PS.fruitR:PS.fruitO,cl,5+((R(7)*4)|0),sd,cy,r);}
  else{const r=5.5+R(1)*2,cy=b-r*1.1;      // 低木（手前のふち）。sd＝葉の色＋3×形
    const cl=canopy(s,LEAFP()[sd%3],{b:[[cx,cy,r],[cx-r*.95,cy+r*.35,r*.72],[cx+r*.95,cy+r*.3,r*.75],[cx+(R(2)-.5)*r,cy-r*.45,r*.65]],cx,cy,rx:r*1.9,ry:r,cr:2.8,v0:.7,vr:4.8,sd:sd*19+7,fl});
    if(R(4)<.55){const F=PS.flw[(R(5)*4)|0];let k=0;
      for(let i=0;i<cl.length&&k<6;i++){const c=cl[(i*5+sd)%cl.length],fx=Math.round(c[0]),fy=Math.round(c[1]-c[2]*.2);if(s.on(fx,fy)){s.S(fx,fy,F,2.8,[0,.3,.95],1,.1);k++;}}}}
  let top=TH;for(let y=0;y<TH&&top===TH;y++)for(let x=0;x<TW;x++)if(s.on(x,y)){top=y;break;}
  s.top=top;return s;}
// 風でかたむいた絵（lean＝てっぺんが東へ何ドット。-1〜3）。行ごとにずらすので、根もとは動かない
const TREEM={};
function treeFrame(kind,sd,lean,fl){
  const key=kind+sd+'_'+fl;const M=TREEM[key]||(TREEM[key]={rest:treeModel(kind,sd,fl),fr:{}});
  if(M.fr[lean])return M.fr[lean];
  const r=M.rest,W=r.w,H=r.h,s=Surf3(W,H,r.base),amp=TAMP[kind];
  for(let y=0;y<H;y++){const t=Math.max(0,Math.min(1,(r.base-y)/(r.base-r.top))),sh=Math.round(lean*amp*Math.pow(t,1.5));
    for(let x=0;x<W;x++){const sx=x-sh;if(sx<0||sx>=W)continue;const i=(y*W+sx)*4;if(!r.col[i+3])continue;const j=(y*W+x)*4;
      for(let k=0;k<4;k++){s.col[j+k]=r.col[i+k];s.nrm[j+k]=r.nrm[i+k];s.dat[j+k]=r.dat[i+k];}}}
  const c=s.cv();return M.fr[lean]={c:c.c,n:c.n,d:c.d,sil:sil3(s)};}
// 地図の木（T のマス）。全部広葉樹の林：奥のふちは大きい木、手前のふちは低木が多い。
// 葉の色は近くの木どうしで似せる（林のまとまり）。若い小さい木はときどき若葉の色
const TREES={farm:[],town:[]};
function treeAt(m,x,y){const z=m==='town'?57:0,h=h3(x,y,11+z),h2=h3(y,x,23+z),jx=Math.round((h3(x,y,31+z)-.5)*5),jy=Math.round((h3(x,y,37+z)-.5)*3);
  const g=vn3(x*.3,y*.3,91+z),pal=g<.38?0:g<.68?1:2,o={x,y,X:x*TS+8-TAX+jx,Y:y*TS+14-TAY+jy,lean:0,ph:h2*7};
  if(y===MH-1&&h<.7)return Object.assign(o,{kind:'bush',sd:pal+3*((h2*2)|0)});
  const size=y===0?(h2<.7?2:1):y===MH-1?0:(h2<.25?0:h2<.72?1:2),shape=(h3(x,y,43+z)*4)|0;
  return Object.assign(o,{kind:'oak',sd:shape+4*size+12*(size===0&&h3(x,y,47+z)<.45?3:pal)});}
function treeNow(t,now){const w=windAt(t.X+TAX,t.Y+TAY,now);
  if(Math.abs(w-t.lean)>.62)t.lean=Math.max(-1,Math.min(3,Math.round(w)));
  const fl=w>.85?(Math.floor(now*(1.5+w*1.6)+t.ph)&1):0;   // 風が強いと葉がちらちら
  return treeFrame(t.kind,t.sd,t.lean,fl);}
// 木の下の地面（少し暗く・落ち葉）
function drawForestFloor(g,x,y){const X=x*TS,Y=y*TS;g.fillStyle='rgba(18,40,24,.3)';g.fillRect(X,Y,TS,TS);
  for(let k=0;k<5;k++){const h=h3(x*5+k,y,61);pset(g,X+((h*16)|0),Y+((h3(y*5+k,x,62)*16)|0),h<.5?'#8a6f3a':'#4f7a30');}
  contactAO(X+1,Y+8,14,8,.55);}

/* ---- さく（場所ごとに新しい板・古い板・欠け・つた・足もとの草やきのこ） ---- */
function drawFence(g,m,x,y){const X=x*TS,Y=y*TS;drawGrass(g,x,y);
  const F=(xx,yy)=>tile(m,xx,yy)==='F',L=F(x-1,y),R=F(x+1,y),U=F(x,y-1),D=F(x,y+1);
  const h=h3(x,y,71),h2=h3(y,x,73),old=h<.34,W=old?PS.woodO:PS.woodN,s=Surf3(16,16,14),S=s.S,sd=x*31+y*17;
  const gate=L!==R&&!U&&!D,vert=(U||D)&&!L&&!R,pt=gate?0:1+(h2<.4?1:0),pb=vert?12:14;        // 道のよこの杭は高い・ほかの杭も少しずつ高さがちがう
  const nx=((h2*40)|0)%10+3,broken=old&&h2<.16?((h2*60)|0)%4+1:0;
  const board=(x0,x1,y0,lower)=>{for(let xx=x0;xx<=x1;xx++){
    if(lower&&broken&&(L?xx<broken*2:xx>15-broken*2))continue;            // 下の板が欠けて落ちた
    const notch=old&&h2>.6&&!lower&&(xx===nx||xx===nx+1);                  // 古い板の欠け
    for(let k=0;k<3;k++){if(notch&&k===0)continue;
      const n=k===0?[0,.35,.94]:k===1?NF:[0,.55,-.8];let v=(k===0?4.4:k===1?3.2:1.5)+(h3(xx>>2,y0+k,sd)-.5)*.7+(h3(xx,y0+k,sd+1)<.06?-.9:0);
      if(notch)v=1.6;S(xx,y0+k,W,v,n,k===2?.65:1,.02);}}};
  g.fillStyle='rgba(25,60,20,.25)';if(L||R)g.fillRect(X+(L?0:6),Y+14,(R?16:10)-(L?0:6),2);
  if(L){board(0,7,4,0);board(0,7,9,1);}if(R){board(8,15,4,0);board(8,15,9,1);}
  const vrail=(y0,y1)=>{for(let yy=y0;yy<=y1;yy++){S(7,yy,W,4,[-.5,.3,.8],1);S(8,yy,W,2.8,[.6,.5,.6],.9);}};   // たてのさくの板（杭より細い）
  if(U&&pt>0)vrail(0,pt-1);if(D)vrail(pb+1,15);
  for(let yy=pt;yy<=pb;yy++)for(let xx=6;xx<=9;xx++){         // 杭（てっぺんは切り口）
    if(yy===pt){S(xx,yy,W,xx===6||xx===9?2.4:4.6,NU,1,.03);continue;}
    const n=cylN((xx-7.5)/2.2);S(xx,yy,W,2.7+2.4*lit3(n)-(yy===pt+1?.6:0)+(h3(xx,yy,sd+2)<.1?-.7:0),n,yy>=pb-1?.7:1,.02);}
  if(gate)for(let xx=6;xx<=9;xx++)S(xx,2,W,1.4,[0,.6,-.7],.7);    // 高い杭の帯
  if(h2>.78&&!gate){                                            // つた
    for(let yy=pt+2;yy<=pb;yy++){const vx=7+((yy+sd)%3===0?1:0);S(vx,yy,PS.ivy,2.4,NF,1,.05);
      if(h3(yy,sd,7)<.4){const lx=vx+(h3(sd,yy,8)<.5?-1:1);S(lx,yy,PS.ivy,4,[lx<vx?-.4:.4,.6,.7],1,.06);S(lx,yy-1,PS.ivy,3.2,[0,.5,.85],1,.06);}}
    for(const[bx,by]of[[4,5],[11,10],[3,10],[12,4]])if(h3(bx,by,sd)<.7&&s.on(bx,by)){S(bx,by,PS.ivy,3.6,[0,.5,.85],1,.06);S(bx+1,by,PS.ivy,2.6,NF,1,.05);}}
  const d=h3(x,y,79);
  if(d<.12){const mx=d<.06?11:3;S(mx,13,PS.cap,1.4,NF,.8);S(mx,12,PS.cap,2.2,NF,1);              // きのこ
    for(let i=-1;i<=1;i++)S(mx+i,11,PS.mush,i<0?3.4:i>0?1.8:2.8,[i*.6,.4,.7],1,.25);S(mx,10,PS.mush,4,NU,1,.3);S(mx-1,11,PS.cap,2.6,[-.6,.4,.7],1,.2);}
  else if(d<.5){const gx=d<.3?1:12;for(let i=0;i<3;i++){const bh=2+((h3(i,sd,3)*3)|0);for(let k=0;k<bh;k++)S(gx+i,14-k,PS.leaf,3+k*.6,[0,.6,.8],1,.03);}}  // のびた草
  stamp3(g,s,X,Y);contactAO(X,Y+12,16,4,.7);
  if(CAST)CAST.push({sil:sil3(s),x:X,y:Y,ay:Y+14});}

/* ---- 岩（6つの形×4つの色。こけつき・ひび入り）：どれも下重心 ----
   1つの石は「底（地面の線）がいちばん広く、上へいくほど丸くせまくなる」形（お椀を伏せた形）。底に近いほど暗く → 足もとに暗い草 → はしに草のふさ */
const ROCKC={},RGY=13;
function rockSprite(x,y){const k=(h3(x,y,83)*6)|0,pi=(h3(y,x,89)*4)|0,key=k+'_'+pi;
  if(ROCKC[key])return ROCKC[key];
  const s=Surf3(16,16,14),P=PS.stone[pi],sd=k*7+pi+1;
  // cx＝まん中・gb＝底の段・rx＝底の半分の幅・ry＝高さ
  const lump=(cx,gb,rx,ry,o)=>{const ex=o&&o.flat?3.4:2.6;
    const wAt=yy=>{const u=(gb+1-(yy+.5))/ry;if(u<=0||u>1)return 0;const w=rx*Math.pow(1-Math.pow(u,ex),.45),a=sd+yy;
      return w*(1+(Math.sin(a*1.7)*.07+Math.sin(a*2.9)*.05)*u);};          // でこぼこは上ほど大きく・底はまっすぐ広い
    for(let yy=Math.floor(gb-ry);yy<=gb;yy++){const w=wAt(yy),u=(gb+1-(yy+.5))/ry;if(w<=0)continue;
      for(let xx=Math.floor(cx-w);xx<=Math.ceil(cx+w);xx++){const px=xx+.5-cx;if(Math.abs(px)>w)continue;
        let n=sphereN(cl1(px/rx*.92),cl1(-u*.92));
        if(o&&o.flat&&u>.45)n=[n[0]*.3,n[1]*.3+.15,1];                    // 平らな上の面
        const q=n.map(v=>Math.round(v*3.2)/3.2);if(Math.hypot(q[0],q[1],q[2])>.3)n=q;    // 面を少しかくばらせる
        const L=lit3(n),edge=Math.abs(px)>w-1||Math.abs(px)>wAt(yy-1),sink=Math.max(0,yy-(gb-1.5));
        let v=.7+3.5*L+(h3(xx,yy,sd)-.5)*.6-sink*.6,P2=P;if(edge)v=Math.min(v,1.6);
        if(o&&o.moss&&n[2]>.6&&sink<1&&h3(xx,yy,sd+4)<.85){P2=PS.moss;v=1+3.6*L+(h3(xx,yy,sd+5)-.5);}
        s.S(xx,yy,P2,v,n,Math.max(.35,1-sink*.16),.08);}}};
  if(k===0)lump(8,RGY,6.2,6.2);
  else if(k===1)lump(8,RGY,7,3.8,{flat:1});
  else if(k===2){lump(6,RGY,5,6.2);lump(11.8,RGY,3.2,3.2);}
  else if(k===3){lump(9.8,RGY-1,4,3.8);lump(5.4,RGY,3.6,3);lump(10.4,RGY,2.8,2.2);}   // 小石のかたまり（大きい1つは1段奥）
  else if(k===4)lump(8,RGY,6.2,6,{moss:1});
  else{lump(8,RGY,6.4,6.4);let cx=6+(sd%3);for(let yy=8;yy<=12;yy++){cx+=(yy&1)?(h3(yy,sd,9)<.5?-1:1):0;if(s.on(cx,yy))s.S(cx,yy,P,.3,[0,.5,.8],.6,0);}}   // ひび
  // 足もと：どの列も石のいちばん下のすぐ下に暗い草（地面にめりこんだかげ）。はしは少し明るく
  let x0=16,x1=-1;for(let xx=0;xx<16;xx++)if(s.on(xx,RGY)){x0=Math.min(x0,xx);x1=Math.max(x1,xx);}
  for(let xx=0;xx<16;xx++){let yb=-1;for(let yy=RGY;yy>=0;yy--)if(s.on(xx,yy)){yb=yy;break;}if(yb>=0&&!s.on(xx,yb+1))s.S(xx,yb+1,PS.grass,.3,NU,.45,0,0);}
  for(const xx of[x0-1,x1+1]){s.S(xx,RGY+1,PS.grass,1.2,NU,.7,0,0);s.S(xx,RGY,PS.grass,1.6,NU,.75,0,0);}
  // 両はしの根もとに草のふさ（岩のはしに少しかぶさる）
  for(const[gx,dir]of[[x0,1],[x1,-1]]){if(h3(gx,sd,13)<.3)continue;const bh=2+((h3(sd,gx,12)*2)|0);
    for(let j=0;j<bh;j++)s.S(gx+(j===bh-1?-dir:0),RGY+1-j,PS.grass,2.2+j*1.2,[0,.55,.83],1,.03,j*.5);
    s.S(gx+dir,RGY+1,PS.grass,2.4,[0,.55,.83],1,.03,0);s.S(gx-dir,RGY,PS.grass,3,[0,.55,.83],1,.03,.5);}
  const c=sprite3(s);c.nd.foot=3;c.nd.fx=[x0,x1];return ROCKC[key]=c;}
