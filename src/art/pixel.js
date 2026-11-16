/* ---------- 作物・小物の絵 ---------- */
/* ---- ドット絵の道具 ---- */
function hexRGB(h){const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255];}
function shade(h,f){const t=v=>Math.max(0,Math.min(255,Math.round(f>1?v+(255-v)*(f-1):v*f)));return'#'+hexRGB(h).map(t).map(v=>v.toString(16).padStart(2,'0')).join('');}
function pset(g,x,y,c){g.fillStyle=c;g.fillRect(x,y,1,1);}
// 文字の表で描く（'.'はすき間）
function grid(g,rows,pal,X,Y,flip){for(let y=0;y<rows.length;y++){const r=rows[y];for(let x=0;x<r.length;x++){const c=pal[r[x]];if(!c)continue;g.fillStyle=c;g.fillRect(X+(flip?r.length-1-x:x),Y+y,1,1);}}}
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');fn(g);return c;}
let RBM='farm';   // いま描いている地図

/* ---- 面の向き（ノーマルマップ）と高さ/かげ/つや ----
   絵は「色・面の向き・高さ/かげ/つや」の3枚組。地図の土台は描くときに NB へ1ドットずつ書く。
   面の向き：東=x・南=y・上=z。画面の上は「北と上のあいだ」、手前を向く面は「南と上のあいだ」 */
const NU=[0,0,1],NF=[0,1,0];
const sphereN=(sx,sy)=>{const z=Math.sqrt(Math.max(0,1-sx*sx-sy*sy));return[sx,.7071*(sy+z),.7071*(z-sy)];};
const cylN=u=>{u=Math.max(-1,Math.min(1,u));return[u,Math.sqrt(1-u*u),0];};
let NB=null;      // いま描いている土台の「面の向き(n)」「高さ/かげ/つや(d)」。null のときは色だけ描く
function NBuf(w,h){const n=new Uint8ClampedArray(w*h*4),d=new Uint8ClampedArray(w*h*4);
  for(let i=0;i<w*h*4;i+=4){n[i]=128;n[i+1]=128;n[i+2]=255;n[i+3]=255;d[i+1]=255;d[i+3]=255;}return{w,h,n,d};}
function nput(x,y,n,z,ao,spec){if(!NB)return;x|=0;y|=0;if(x<0||y<0||x>=NB.w||y>=NB.h)return;
  const i=(y*NB.w+x)*4,l=Math.hypot(n[0],n[1],n[2])||1;
  NB.n[i]=(n[0]/l*.5+.5)*255;NB.n[i+1]=(n[1]/l*.5+.5)*255;NB.n[i+2]=(n[2]/l*.5+.5)*255;
  NB.d[i]=Math.max(0,Math.min(255,(z||0)*3));NB.d[i+1]=(ao===undefined?1:ao)*255;NB.d[i+2]=(spec||0)*255;}
// 四角に同じ向き（n は向き か (i,j)=>向き）。zb を渡すと「zb から上へのたかさ」
function nrect(x,y,w,h,n,zb,ao,spec){if(!NB)return;const f=typeof n==='function';
  for(let j=0;j<h;j++)for(let i=0;i<w;i++)nput(x+i,y+j,f?n(i,j):n,zb==null?0:Math.max(0,zb-(y+j)),ao,spec);}
// 色の明るさを高さとみなして、1ドットずつのでこぼこを足す（同じ向きの面の中だけ）
function bumpLum(cd,n,d,w,h,k){
  const L=new Float32Array(w*h);for(let i=0;i<w*h;i++){const a=cd[i*4+3];L[i]=a<160?-1:(cd[i*4]*.299+cd[i*4+1]*.587+cd[i*4+2]*.114)/255;}
  const out=new Uint8ClampedArray(n);
  const same=(i,j)=>L[j]>=0&&Math.abs(n[i*4]-n[j*4])<12&&Math.abs(n[i*4+1]-n[j*4+1])<12&&Math.abs(n[i*4+2]-n[j*4+2])<12;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(L[i]<0||d[i*4+2]>140)continue;
    const c=L[i],hl=x>0&&same(i,i-1)?L[i-1]:c,hr=x<w-1&&same(i,i+1)?L[i+1]:c,hu=y>0&&same(i,i-w)?L[i-w]:c,hd=y<h-1&&same(i,i+w)?L[i+w]:c;
    const dx=(hr-hl)*.5,dy=(hd-hu)*.5,nx=n[i*4]/127.5-1,ny=n[i*4+1]/127.5-1,nz=n[i*4+2]/127.5-1;
    const bl=Math.hypot(ny,nz)||1,by=nz/bl,bz=-ny/bl;   // 画面の下へ向かう面の向き（n × 東）
    const ox=nx-k*dx,oy=ny-k*dy*by,oz=nz-k*dy*bz,l=Math.hypot(ox,oy,oz)||1;
    out[i*4]=(ox/l*.5+.5)*255;out[i*4+1]=(oy/l*.5+.5)*255;out[i*4+2]=(oz/l*.5+.5)*255;
    if(c<.2)d[i*4+1]=Math.min(d[i*4+1],200);}   // いちばん暗い線はすこし陰に
  return out;}
function bufCanvas(w,h,data){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),id=g.createImageData(w,h);id.data.set(data);g.putImageData(id,0,0);return c;}
// 影を落とす物（土台に描いた木・家・さく）。sil＝黒いかたち、ay＝地面に立つ線
let CAST=null;
function rectSil(w,h,rects){return mk(w,h,g=>{g.fillStyle='#000';for(const r of rects)g.fillRect(r[0],r[1],r[2],r[3]);});}

/* ---- 草 ---- */
const GR={b:'#6db34b',d:'#579d3d',dd:'#468a32',l:'#87c95c',h:'#a6dd73'};
function tuft(g,x,y,big){
  pset(g,x,y+2,GR.dd);pset(g,x+4,y+2,GR.dd);pset(g,x+1,y+2,GR.d);pset(g,x+2,y+2,GR.dd);pset(g,x+3,y+2,GR.d);
  pset(g,x+1,y+1,GR.l);pset(g,x+3,y+1,GR.l);pset(g,x+2,y+1,GR.d);pset(g,x+2,y,GR.h);
  if(big){pset(g,x,y+1,GR.l);pset(g,x+4,y,GR.h);pset(g,x+4,y+1,GR.l);}
}
function drawGrass(g,x,y,field){
  const X=x*TS,Y=y*TS;g.fillStyle=field?'#74b74f':GR.b;g.fillRect(X,Y,TS,TS);
  for(let j=0;j<16;j++)for(let i=0;i<16;i++){const h=hash(X+i,Y+j);if(h<.018)pset(g,X+i,Y+j,GR.d);}
  const n=field?2:3+((hash(x,y)*2)|0);
  for(let k=0;k<n;k++){const h1=hash(x*3+k*17,y*5+k*31),h2=hash(y*7+k*13,x*11+k*3);tuft(g,X+((h1*12)|0),Y+1+((h2*12)|0),h1>.55);}
  if(field){const h=hash(x+9,y+4);if(h>.55){pset(g,X+((h*13)|0),Y+((h*29)|0)%14,'#a78a55');pset(g,X+((h*13)|0)+1,Y+((h*29)|0)%14,'#8e7246');}}
}

/* ---- 土の道（草とのさかいめは草がかぶさる） ---- */
const DIRT={b:'#d4a66b',d:'#bd8d55',dd:'#9e7140',l:'#e6c18a'};
const isPathT=(m,x,y)=>{const t=tile(m,x,y);return t==='p'||t==='k';};
function drawPath(g,x,y){
  const X=x*TS,Y=y*TS,m=RBM;g.fillStyle=DIRT.b;g.fillRect(X,Y,TS,TS);
  for(let j=0;j<16;j++)for(let i=0;i<16;i++){const h=hash(X+i+500,Y+j);if(h<.06)pset(g,X+i,Y+j,DIRT.d);else if(h>.96)pset(g,X+i,Y+j,DIRT.l);}
  for(let k=0;k<2;k++){const h=hash(x*5+k*7+300,y*3+k);if(h<.5)continue;const px=X+2+((h*97)|0)%11,py=Y+2+((h*53)|0)%11;
    g.fillStyle=DIRT.dd;g.fillRect(px,py+1,3,1);g.fillStyle='#c9ad86';g.fillRect(px,py,3,1);pset(g,px+1,py,'#e8d6b6');}
  const edge=(side)=>{for(let k=0;k<16;k++){const d=1+(hash(X+k*3+side,Y+side*7)>.55?1:0)+(hash(X+side,Y+k*5)>.88?1:0);
    for(let s=0;s<=d;s++){const c=s<d?(s===d-1&&hash(k,side+s)>.5?GR.l:GR.b):DIRT.dd;
      const [px,py]=side===0?[X+k,Y+s]:side===1?[X+k,Y+15-s]:side===2?[X+s,Y+k]:[X+15-s,Y+k];pset(g,px,py,c);}}};
  if(!isPathT(m,x,y-1))edge(0);if(!isPathT(m,x,y+1))edge(1);if(!isPathT(m,x-1,y))edge(2);if(!isPathT(m,x+1,y))edge(3);
}

/* 木・さく・岩は src/art/scenery.js */

/* ---- 水（池） ---- */
const WAT={b:'#3e92d2',d:'#2f78b8',l:'#62afe6',h:'#a8dcf6',rim:'#2a5f8f'};
function drawWater(g,x,y){
  const X=x*TS,Y=y*TS,m=RBM;g.fillStyle=WAT.b;g.fillRect(X,Y,TS,TS);
  for(let j=0;j<16;j++)for(let i=0;i<16;i++){const w=Math.sin((X+i)*.55+(Y+j)*1.3)+Math.sin((X+i)*.21-(Y+j)*.9);if(w>1.45)pset(g,X+i,Y+j,WAT.l);else if(w<-1.5)pset(g,X+i,Y+j,WAT.d);}
  const W=(xx,yy)=>tile(m,xx,yy)==='w';
  if(NB)for(let j=0;j<16;j++)for(let i=0;i<16;i++){const a=(X+i)*.55+(Y+j)*1.3,b=(X+i)*.21-(Y+j)*.9;nput(X+i,Y+j,[-(.55*Math.cos(a)+.21*Math.cos(b))*.13,-(1.3*Math.cos(a)-.9*Math.cos(b))*.13,1],0,1,.85);}
  if(!W(x,y-1))nrect(X,Y,TS,3,[0,.75,.66],null,.85,0);if(!W(x-1,y))nrect(X,Y,2,TS,[.7,0,.7],null,.9,0);if(!W(x+1,y))nrect(X+15,Y,1,TS,[-.7,0,.7],null,.85,0);if(!W(x,y+1))nrect(X,Y+14,TS,2,NU,null,.9,0);
  if(!W(x,y-1)){g.fillStyle=WAT.rim;g.fillRect(X,Y,TS,2);g.fillStyle=WAT.h;g.fillRect(X,Y+2,TS,1);}
  if(!W(x-1,y)){g.fillStyle=WAT.rim;g.fillRect(X,Y,1,TS);g.fillStyle=WAT.l;g.fillRect(X+1,Y,1,TS);}
  if(!W(x+1,y)){g.fillStyle=WAT.rim;g.fillRect(X+15,Y,1,TS);}
  if(!W(x,y+1)){g.fillStyle=WAT.d;g.fillRect(X,Y+14,TS,1);g.fillStyle=WAT.rim;g.fillRect(X,Y+15,TS,1);}
}

