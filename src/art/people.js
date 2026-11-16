// 絵の枠は体（16×32）のまわりに、横4・上4ドットのゆとり（帽子のつばなどがはみ出せる）
const PADX=4,PADY=4;
function charFrame(id,view,f,flip,wear){
  const C=CHARS[id],v=C.views[view],pal=C.pal,W=16+PADX*2,H=32+PADY,E='.'.repeat(PADX);
  let rows=Array(PADY).fill('.'.repeat(W)).concat(v.rows.concat(v.legs[f]).map(r=>E+r+E)),hatc=null;
  // 着せかえ：身につけた物（帽子など）を上に重ねる。'.' はすけて下の体が見える
  // 部品の rows はゆとりこみの枠（横24）で、y 段目から。c は帽子のふくらみの丸 [x,y,半径]
  for(const k in(wear||{})){const it=wear[k]&&C.items&&C.items[wear[k]],L=it&&it.views[view];if(!L)continue;if(L.c)hatc=L.c;
    rows=rows.map((r,y)=>{const o=L.rows[y-L.y];if(!o)return r;let t='';for(let x=0;x<W;x++)t+=o[x]!=='.'?o[x]:r[x];return t;});}
  if(flip)rows=rows.map(r=>[...r].reverse().join(''));
  const col=new Uint8ClampedArray(W*H*4),n=new Uint8ClampedArray(W*H*4),d=new Uint8ClampedArray(W*H*4),em=new Uint8ClampedArray(W*H*4),NN=[];
  const at=(x,y)=>x<0||y<0||x>=W||y>=H||rows[y][x]==='.'?null:pal[rows[y][x]];
  const hx=(flip?15-C.head[0]:C.head[0])+PADX,hy=C.head[1]+PADY,hr=C.head[2];let hasEm=false;
  const cl=v=>Math.max(-.98,Math.min(.98,v));
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p=at(x,y);if(!p)continue;const i=y*W+x,c=hexRGB(p[0]);
    col[i*4]=c[0];col[i*4+1]=c[1];col[i*4+2]=c[2];col[i*4+3]=255;const pt=p[1];let N=null;
    if(pt==='hc'&&hatc){const cx=flip?W-hatc[0]:hatc[0];N=sphereN(cl((x+.5-cx)/hatc[2]),cl((y+.5-hatc[1])/hatc[2]));}   // 帽子のふくらみは帽子の丸で
    else if(pt==='hd'||pt==='hc')N=sphereN(cl((x+.5-hx)/hr),cl((y+.5-hy)/hr));
    else if(pt==='hn')N=sphereN(cl((x+.5-hx)/hr),-.75);
    else if(pt==='hb')N=[(x+.5-8)/8*.35,.32,.9];
    else if(pt==='em'){N=NF;hasEm=true;em[i*4]=255;em[i*4+1]=240;em[i*4+2]=150;em[i*4+3]=170;}
    else if(pt!=='ol'){let a0=x,a1=x;while(a0>0&&at(a0-1,y)&&at(a0-1,y)[1]===pt)a0--;while(a1<W-1&&at(a1+1,y)&&at(a1+1,y)[1]===pt)a1++;
      const u=(x+.5-(a0+a1+1)/2)/((a1-a0+1)/2+.6);
      if(pt==='wg')N=[u*.5,.45,.75];
      else{let top=0;if(pt==='tr'){let k=0;while(y-k-1>=0&&at(x,y-k-1)&&at(x,y-k-1)[1]==='tr')k++;top=k<2?(2-k)*.35:0;}
        N=[u*.8,Math.sqrt(Math.max(0,1-u*u*.64))*.95,(pt==='sk'?.05:.18)+top];}}
    NN[i]=N;d[i*4]=Math.min(255,(H-y)*3);d[i*4+1]=255;d[i*4+2]=(p[2]||0)*255;d[i*4+3]=255;}
  // 線：となりの面の向き＋外向き
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p=at(x,y);if(!p||p[1]!=='ol')continue;const i=y*W+x;let s=[0,0,0],k=0,ox=0,oy=0;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const q=at(x+dx,y+dy);if(q&&q[1]!=='ol'&&NN[(y+dy)*W+x+dx]){const m=NN[(y+dy)*W+x+dx];s[0]+=m[0];s[1]+=m[1];s[2]+=m[2];k++;}else if(!q){ox-=dx;oy-=dy;}}
    const N=k?[s[0]/k,s[1]/k,s[2]/k]:[0,.7,.7];NN[i]=[N[0]+ox*.45,N[1]+Math.max(0,oy)*.2,N[2]-Math.min(0,oy)*.45];d[i*4+1]=185;}
  for(let i=0;i<W*H;i++){const N=NN[i];if(!N)continue;const l=Math.hypot(N[0],N[1],N[2])||1;n[i*4]=(N[0]/l*.5+.5)*255;n[i*4+1]=(N[1]/l*.5+.5)*255;n[i*4+2]=(N[2]/l*.5+.5)*255;n[i*4+3]=255;}
  const nb=bumpLum(col,n,d,W,H,.9),c=bufCanvas(W,H,col);
  c.nd={n:bufCanvas(W,H,nb),d:bufCanvas(W,H,d),sil:silOf(c),by:H};c.ox=PADX;c.oy=PADY;if(hasEm)c.em=bufCanvas(W,H,em);
  return c;}
const SPR={};
// wear：身につける物（例 {hat:'straw'}）。着せかえたら makeSprites(id) をもう一度
function makeSprites(id){const w=CHARS[id].wear,fr=(d,f)=>d===0?charFrame(id,'front',f,false,w):d===1?charFrame(id,'back',f,false,w):charFrame(id,'side',f,d===2,w);
  SPR[id]=[0,1,2,3].map(d=>{const a=[0,1,2].map(f=>fr(d,f));a[3]=a[0];return a;});SPR[id].faceY=CHARS[id].faceY;}

