/* ---------- 光のしくみ ---------- */
/* ---------- 光のしくみ（WebGL） ----------
   1コマごとに、色(cv)・面の向き・高さ/かげ/つや・影・光る所 の5枚を「画面のドットの大きさ」で描き、
   光の計算は1ドットずつ（軽い）。仕上げ（ぼかし・にじむ光・光の筋・霧・色の調子）だけ画面の大きさで。
   霧と光の筋は「地図の上の位置」で描くので、カメラが動いてもずれない */
const LIGHT_KEY='monmusu-farm-light';
const LIT={q:2,act:false,ok:false,pk:2,dts:[],auto:true};
try{const v=localStorage.getItem(LIGHT_KEY);if(v!==null){LIT.q=Math.max(0,Math.min(3,+v|0));LIT.auto=false;}}catch(e){}
const glc=$('#gl'),pfx=$('#pfx'),pctx=pfx.getContext('2d');
const layer=()=>{const c=document.createElement('canvas');c.width=c.height=1;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return{c,g};};
const LN=layer(),LD=layer(),LS=layer(),LE=layer();
const nctx=LN.g,dctx=LD.g,shg=LS.g,eg=LE.g;
const BASE3={};
// 動く物の「面の向き」：色の絵から1ドットずつ作っておく（kind: flat＝地面・round＝丸い物・body＝人）
const NCACHE=new WeakMap();
function silOf(c){const w=c.width,h=c.height,d=c.getContext('2d').getImageData(0,0,w,h).data,o=new Uint8ClampedArray(w*h*4);for(let i=0;i<w*h;i++)if(d[i*4+3]>=160)o[i*4+3]=255;return bufCanvas(w,h,o);}
function sprN(src,kind){if(src.nd)return src.nd;let o=NCACHE.get(src);if(o)return o;
  const w=src.width,h=src.height,cd=src.getContext('2d').getImageData(0,0,w,h).data;
  const n=new Uint8ClampedArray(w*h*4),d=new Uint8ClampedArray(w*h*4);
  let x0=w,x1=-1,y0=h,y1=-1;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(cd[(y*w+x)*4+3]>=160){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  const cxm=(x0+x1+1)/2,cym=(y0+y1+1)/2,rx=Math.max(1,(x1-x0+1)/2),ry=Math.max(1,(y1-y0+1)/2);
  const put=(i,N,z,ao,spec)=>{const l=Math.hypot(N[0],N[1],N[2])||1;n[i*4]=(N[0]/l*.5+.5)*255;n[i*4+1]=(N[1]/l*.5+.5)*255;n[i*4+2]=(N[2]/l*.5+.5)*255;n[i*4+3]=255;
    d[i*4]=Math.max(0,Math.min(255,z*3));d[i*4+1]=ao*255;d[i*4+2]=spec*255;d[i*4+3]=255;};
  for(let y=0;y<h;y++){let a0=w,a1=-1;for(let x=0;x<w;x++)if(cd[(y*w+x)*4+3]>=160){if(x<a0)a0=x;a1=x;}
    for(let x=0;x<w;x++){const i=y*w+x;if(cd[i*4+3]<160)continue;
      if(kind==='flat')put(i,NU,0,1,0);
      else if(kind==='round')put(i,sphereN((x+.5-cxm)/rx*.85,(y+.5-cym)/ry*.85),(y1+1-y)*.8,1,.06);
      else{const u=(x+.5-(a0+a1+1)/2)/Math.max(1.5,(a1-a0+1)/2),top=Math.max(0,1-(y-y0)/4);
        put(i,[u*.8,Math.sqrt(Math.max(0,1-u*u*.64))*(1-top*.55),.22+top*.85],y1+1-y,1,.08);}}}
  const nn=bumpLum(cd,n,d,w,h,kind==='flat'?2.2:1.1);
  o={n:bufCanvas(w,h,nn),d:bufCanvas(w,h,d),sil:silOf(src),by:y1+1};NCACHE.set(src,o);return o;}
// 色と面の向きを同じ所に重ねて描く
function blit3(src,kind,X,Y){ctx.drawImage(src,X,Y);if(!LIT.act)return null;const o=sprN(src,kind);nctx.drawImage(o.n,X,Y);dctx.drawImage(o.d,X,Y);if(src.em)eg.drawImage(src.em,X,Y);return o;}

