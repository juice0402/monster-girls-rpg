/* ---- 牧場の建物の部品（3枚組。家は街と同じ makeBld） ---- */
// 出荷箱：板のふた・たての板の前の面・鉄のかど金具・金色の「入れる」しるし
function makeShipBox(){const s=Surf3(16,16,15),S=s.S,W=PS.woodN;
  for(let y=2;y<=5;y++)for(let x=1;x<=14;x++){const edge=x===1||x===14||y===2,n=y===5?[0,.7,.7]:[x===1?-.4:x===14?.4:0,.3,.95];
    let v=y===5?3:4.4-(y-2)*.25+((x-1)%5===0?-1.2:0)+(h3(x,y,91)-.5)*.4;if(edge)v=Math.min(v,1.6);S(x,y,W,v,n,1,.03);}
  for(let y=6;y<=14;y++)for(let x=1;x<=14;x++){const n=x===1?[-.7,.7,0]:x===14?[.7,.7,0]:NF;let v=3.2+((x-1)%4===0?-1.3:0)+(h3(x,y,92)-.5)*.5-(y-6)*.05;
    if(x===1||x===14||y===14)v=Math.min(v,1.4);S(x,y,W,v,n,y>=13?.8:1,.02);}
  for(const x of[1,2,13,14])for(const y of[6,7,13,14])S(x,y,PS.iron,y===6?3.4:2.4,x<3?[-.6,.7,.3]:[.6,.7,.3],1,.5);
  ['.yyy.','.yyy.','yyyyy','.yyy.','..y..'].forEach((r,j)=>{for(let i=0;i<5;i++)if(r[i]==='y')S(6+i,8+j,PS.gold,j===0?3.2:3.6-j*.15,[0,.6,.8],1,.45);});
  return s;}
// 増築の工事中：柱・足場の板・すじかい・組みかけの壁
function makeScaffold(){const W=64,H=60,s=Surf3(W,H,H-1),S=s.S;
  for(let y=34;y<H-2;y++)for(let x=4;x<=30;x++){const py=(y-34)%4;S(x,y,PS.woodL,py===3?2:3.4+(h3(x>>3,y>>2,95)-.5)*.6,py===0?[0,.75,.65]:NF,1);}
  for(const px of[1,21,41,61])for(let y=6;y<H;y++)for(let x=px;x<px+2;x++)S(x,y,PS.wood,x===px?3.6:2.4,x===px?[-.6,.8,0]:[.6,.8,0],1);
  for(let k=0;k<20;k++){S(2+k,30-k,PS.wood,3,[0,.7,.7],1);S(42+k,50-k,PS.wood,3,[0,.7,.7],1);}
  for(const py of[10,30,50])for(let x=0;x<W;x++){S(x,py,PS.wood,4,[0,.4,.9],1);S(x,py+1,PS.wood,2.6,NF,1);S(x,py+2,PS.wood,1.4,[0,.5,-.85],.6);}
  return s;}

/* ---- 耕した土（となりの土とつながる・16通り×ぬれ） ---- */
const SOILC=[[],[]];
function soilTile(wet,mask){
  const P=wet?{b:'#6c4329',d:'#56341f',l:'#86553a',f:'#5d3a22',o:'#40271a'}:{b:'#9e683b',d:'#80522d',l:'#ba8452',f:'#8b5a33',o:'#62401f'};
  return mk(16,16,g=>{
    g.fillStyle=P.b;g.fillRect(0,0,16,16);
    for(let yy=3;yy<16;yy+=4){g.fillStyle=P.f;g.fillRect(0,yy,16,1);g.fillStyle=P.l;for(let i=0;i<16;i++)if(hash(i,yy+wet*9)>.45)g.fillRect(i,yy-1,1,1);}
    for(let j=0;j<16;j++)for(let i=0;i<16;i++){const h=hash(i+31,j+wet*17);if(h<.06)pset(g,i,j,P.d);else if(h>.97)pset(g,i,j,P.l);}
    if(wet)for(let k=0;k<3;k++)pset(g,2+((hash(k,7)*12)|0),1+((hash(7,k)*13)|0),'#9a6a4a');
    const U=mask&1,R=mask&2,D=mask&4,L=mask&8;
    if(!U){g.fillStyle=P.o;g.fillRect(0,0,16,1);g.fillStyle=P.l;g.fillRect(0,1,16,1);}
    if(!L){g.fillStyle=P.o;g.fillRect(0,0,1,16);g.fillStyle=P.l;g.fillRect(1,U?0:1,1,15);}
    if(!R){g.fillStyle=P.o;g.fillRect(15,0,1,16);g.fillStyle=P.d;g.fillRect(14,U?0:1,1,15);}
    if(!D){g.fillStyle=P.o;g.fillRect(0,15,16,1);g.fillStyle=P.d;g.fillRect(0,14,16,1);}
    if(!U&&!L)g.clearRect(0,0,1,1);if(!U&&!R)g.clearRect(15,0,1,1);if(!D&&!L)g.clearRect(0,15,1,1);if(!D&&!R)g.clearRect(15,15,1,1);
  });
}
for(let w=0;w<2;w++)for(let m=0;m<16;m++)SOILC[w][m]=soilTile(w,m);
function soilMask(x,y){const F=S.farm.soil,s=(xx,yy)=>xx>=0&&yy>=0&&xx<MW&&yy<MH&&F[I(xx,yy)];return(s(x,y-1)?1:0)|(s(x+1,y)?2:0)|(s(x,y+1)?4:0)|(s(x-1,y)?8:0);}

/* ---- 作物（育ち3段＋実り） ---- */
const LEAF={G:'#2f6a2b',g:'#55a63f',l:'#86cf5a',s:'#3f8a33'};
const CROP_ART={
  s0:{y:7,r:['....b.....b.....','....a.....a.....','.......b........','.......a........'],p:{b:'#e6d39c',a:'#5a3a20'}},
  s1:{y:7,r:['.....GG..GG.....','....GllGGllG....','....GlgGGglG....','.....GGssGG.....','.......ss.......','.......sG.......']},
  s2:{y:4,r:['.......GG.......','..GG..GllG..GG..','.GllG.GlgG.GllG.','.GlggGGggGGgglG.','..GgggGggGgggG..','...GGgGsGgGGG...','.....GGssGG.....','.......ss.......','.......sG.......']},
  kabu:{y:0,r:['................','....GG....GG....','...GllG..GllG...','...GlgG..GglG...','....GgGGGGgG....','.....GggggG.....','......GggG......','......OppO......',
    '....OOpqppOO....','...OppqqpppPO...','...OwWwwwwwvO...','...OwWwwwwvvO...','....OwwwwvvO....','.....OvvvvO.....','......OOOO......','.......vv.......'],
    p:{O:'#5b3f63',p:'#a956b8',q:'#cf86dc',P:'#8a3f99',w:'#f3edf1',W:'#ffffff',v:'#d3c6d4'}},
  jaga:{y:0,r:['................','......GGGG......','...GGGllggGGG...','..GllgggfggllG..','.GlggfFfgggglgG.','.GggggfgglggggG.','..GgglgggggfgG..','.GgggggggfFfggG.',
    '..GGgggggggfgG..','...GGGggggGGG...','....uUUGsGuUU...','...uUUUuGuUUUu..','...uUUUu.uUUu...','....uuu...uu....'],
    p:{f:'#fbf6e6',F:'#f2c94c',u:'#7a5230',U:'#c9975a'}},
  ichigo:{y:0,r:['................','................','.....GG..GG.....','....GllGGllG....','..GGglgggglgGG..','.GllggGgGggglG..','.GgggGGsGGgggG..','..GGGG.s.GGGG...',
    '...RR..s...RR...','..RkrR.s..RkrR..','..RryR.RR.RryR..','...RR.RkrR.RR...','......RryR......','.......RR.......'],
    p:{R:'#a8243a',r:'#e23a4c',k:'#ff9aa6',y:'#ffd98a'}},
};
const CROPC={};
// 文字の表の絵を3枚組に：色はそのまま、面の向きは「部分ごとにふくらんだ形」（ふちほど外を向く）。lean＝風で上を東へ
function pillow3(rows,pal,y0,part,specOf,lean){
  const W=16,H=16,s=Surf3(W,H,15),C=[];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const r=rows[y-y0],ch=r&&r[x];C.push(ch&&pal[ch]?part(ch):null);}
  const at=(x,y)=>x<0||y<0||x>=W||y>=H?null:C[y*W+x];
  const D=C.map((c,i)=>{if(c==null)return 0;const x=i%W,y=(i/W)|0;for(let k=1;k<=3;k++)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(at(x+dx*k,y+dy*k)!==c)return k;return 4;});
  const g=(x,y,c)=>at(x,y)===c?D[y*W+x]:0;
  let top=H,base=0;C.forEach((c,i)=>{if(c!=null){top=Math.min(top,(i/W)|0);base=Math.max(base,(i/W)|0);}});
  for(let y=0;y<H;y++){const t=Math.max(0,(base-y)/Math.max(1,base-top)),sh=lean?Math.round(lean*Math.pow(t,1.3)*1.2):0;
    for(let x=0;x<W;x++){const c=at(x,y);if(c==null)continue;const ch=rows[y-y0][x];
      const n=sphereN(cl1(-(g(x+1,y,c)-g(x-1,y,c))*.3),cl1(-(g(x,y+1,c)-g(x,y-1,c))*.3));
      s.put(x+sh,y,C3(pal[ch]),n,1,specOf(ch),base-y);}}
  return s;}
function cropSprite(key,lean){lean=lean|0;const k=key+lean;if(CROPC[k])return CROPC[k];const a=CROP_ART[key],pal=Object.assign({},LEAF,a.p||{});
  return CROPC[k]=sprite3(pillow3(a.r,pal,a.y,ch=>LEAF[ch]?0:1,ch=>LEAF[ch]?.04:.35,lean));}
const cropLean=(x,y,now)=>windAt(x*TS+8,y*TS+8,now)>1.35?1:0;   // 風の日は畑に風の波が通る
function drawCrop(g,id,stage,x,y){
  const key=stage===3?id:'s'+stage;
  if(stage>=1){g.fillStyle='rgba(40,20,10,.25)';g.fillRect(x+4,y+13,8,2);}
  g.drawImage(cropSprite(key),x,y);
}

/* ---- 野の花 ---- */
// 岩は src/art/scenery.js の rockSprite
const FLOWERC=['#ff8fb8','#ffd25e','#ffffff'].map(pc=>mk(16,16,g=>grid(g,['................','................','................','................',
  '.......p........','......pkp.......','.....pkykp......','......pkp.......','.......p..p.....','.......s.pkp....','..l....s..p.....','..ll...s.ls.....','...ll..sll......','....lllsl.......'],
  {p:pc,k:shade(pc,1.3),y:'#f2a93b',s:'#3f8a33',l:'#5fae45'},0,0)));

function itemIcon(id){
  const c=document.createElement('canvas');c.width=16;c.height=16;const g=c.getContext('2d');
  if(CROPS[id])drawCrop(g,id,3,0,1);
  else if(id==='stone'){g.fillStyle='#8f8a86';g.fillRect(3,6,10,7);g.fillRect(4,5,8,1);g.fillStyle='#b5b0aa';g.fillRect(4,6,4,2);g.fillStyle='#6b6662';g.fillRect(3,12,10,1);}
  else if(id==='flower'){g.fillStyle='#4f9a37';g.fillRect(7,8,2,6);g.fillStyle='#ff9ec1';g.fillRect(5,4,6,4);g.fillRect(6,3,4,6);g.fillStyle='#ffe066';g.fillRect(7,5,2,2);}
  return c;
}
// 道具と種袋の絵（16×16）
const TOOLC={};
function toolIcon(id){
  const c=document.createElement('canvas');c.width=16;c.height=16;const g=c.getContext('2d');
  const r=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  if(id==='hoe'){
    for(let k=0;k<9;k++){r(3+k,13-k,2,1,'#a8733f');r(3+k,14-k,1,1,'#6e4426');}
    r(10,2,5,2,'#c9d1d8');r(12,4,3,3,'#c9d1d8');r(12,7,3,1,'#7d868d');r(10,2,2,1,'#eef2f5');r(14,4,1,3,'#9aa3aa');r(11,4,1,1,'#7d868d');
  }else if(id==='can'){
    r(3,7,8,6,'#5a9fd0');r(3,12,8,1,'#3d77a3');r(4,8,2,3,'#9fd0ef');r(2,7,1,5,'#3d77a3');r(11,7,1,6,'#3d77a3');
    r(4,4,1,3,'#3d77a3');r(4,3,5,1,'#3d77a3');r(8,4,1,3,'#3d77a3');
    for(let k=0;k<4;k++)r(11+k,8-k,1,2,'#5a9fd0');r(14,3,2,2,'#3d77a3');
  }else if(id==='pick'){
    for(let k=0;k<8;k++){r(5+k,14-k,2,1,'#a8733f');r(5+k,15-k,1,1,'#6e4426');}
    r(2,3,9,4,'#8f969c');r(2,3,9,1,'#c9d1d8');r(2,6,9,1,'#5d6368');r(3,4,2,2,'#b5bcc2');r(9,2,3,6,'#6f767c');r(9,2,3,1,'#9aa3aa');
  }else if(CROPS[id]){
    const band={kabu:'#a45bb5',jaga:'#c9965a',ichigo:'#e8384f'}[id]||'#8a5a35';
    r(4,5,8,9,'#e8d3a0');r(3,6,1,7,'#c9ad72');r(12,6,1,7,'#c9ad72');r(4,13,8,1,'#b8955a');
    r(5,3,6,2,'#d6bd85');r(6,2,4,1,'#b8955a');r(7,4,2,1,'#8a6a3a');
    r(5,8,6,3,band);r(6,9,1,1,'#fff6e0');r(9,9,1,1,'#fff6e0');r(7,10,2,1,'rgba(255,255,255,.35)');
  }
  return c;
}
const ICON={};
['kabu','jaga','ichigo','stone','flower'].forEach(k=>ICON[k]=itemIcon(k).toDataURL());
const HICON={};
HOTBAR().forEach(k=>{TOOLC[k]=toolIcon(k);HICON[k]=TOOLC[k].toDataURL();});

/* ---------- 地面と建物（地図ごとに1枚に描いておく） ---------- */
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hash(x,y){let h=x*374761393+y*668265263;h=(h^(h>>13))*1274126177;return((h^(h>>16))>>>0)/4294967296;}
const BASE={};
const WINDOWS={farm:[],town:[]};
function drawBuildings(g,m){
  WINDOWS[m]=[];
  if(m==='farm'){
    LAMPS.farm=[];
    const B=(o,X,Y)=>{stamp3(g,o.s,X,Y);CAST.push({sil:o.sil,x:X,y:Y,ay:Y+o.s.h-1});contactAO(X+2,Y+o.s.h,o.s.w-4,4,.55);
      for(const w of o.wins)WINDOWS.farm.push([X+w[0],Y+w[1],Y+o.s.h,w[2],w[3]]);if(o.wins.lantern)LAMPS.farm.push([X+o.wins.lantern[0],Y+o.wins.lantern[1]+26,26,30,'lan']);};
    // 家（x1..6, y2..5）：赤茶の瓦・明るい板の壁・えんとつ・戸のよこのランタン（戸は道 x3 の上）
    B(makeBld({W:96,H:76,roof:'roofF',rh:22,wall:'plank',wallP:'woodL',door:[32,16],wins:[[8,36,1],[70,36,1]],chim:[74,8,9],lantern:1,seed:13}),TS,96-76);
    // 増築（x7..10）：部屋の窓には住んでいる子の色のカーテン
    const X=7*TS;
    if(S.reno.state===2){const cur=id=>id?R3([shade(ROOM_COLOR[id],.5),shade(ROOM_COLOR[id],.75),ROOM_COLOR[id],shade(ROOM_COLOR[id],1.25)]):null;
      B(makeBld({W:64,H:72,roof:'roofF',rh:20,wall:'plank',wallP:'woodL',door:[24,16],wins:[[6,36,1,cur(S.rooms[0])],[44,36,1,cur(S.rooms[1])]],seed:17}),X,96-72);}
    else if(S.reno.state===1){const sc=makeScaffold();stamp3(g,sc,X,96-sc.h);CAST.push({sil:sil3(sc),x:X,y:96-sc.h,ay:95});}
    // 出荷箱
    const sb=makeShipBox();stamp3(g,sb,12*TS,5*TS);CAST.push({sil:sil3(sb),x:12*TS,y:5*TS,ay:5*TS+15});contactAO(12*TS+1,6*TS,14,2,.6);
  }else drawTownThings(g);
}
function renderBase(m){
  RBM=m;const W=MW*TS,H=MH*TS,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
  NB=NBuf(W,H);CAST=[];
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
    const t=tile(m,x,y);
    if(m==='town'){drawGrass(g,x,y);continue;}
    if(t==='p'||t==='k')drawPath(g,x,y);else if(t==='w')drawWater(g,x,y);else if(t==='F')drawFence(g,m,x,y);
    else drawGrass(g,x,y);
    if(t==='f')drawGrass(g,x,y,true);
  }
  if(m==='town')drawTownGround(g);
  // 木は土台に描かず、毎コマ風でゆらして描く（scenery.js）。ここでは木の下の地面と一覧だけ
  TREES[m]=[];for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(tile(m,x,y)==='T'){drawForestFloor(g,x,y);TREES[m].push(treeAt(m,x,y));}
  drawBuildings(g,m);
  // 色の明るさから1ドットずつのでこぼこを足して、3枚組にする
  const cd=g.getImageData(0,0,W,H).data,nn=bumpLum(cd,NB.n,NB.d,W,H,2.4),mask=new Uint8ClampedArray(W*H*4);
  for(let i=0;i<W*H;i++)if(NB.d[i*4]>0)mask[i*4+3]=255;
  BASE3[m]={n:bufCanvas(W,H,nn),d:bufCanvas(W,H,NB.d),mask:bufCanvas(W,H,mask),casters:CAST};
  NB=null;CAST=null;
  BASE[m]=c;
}
const ROOM_COLOR={chloe:'#7a56a8',luu:'#8fd3f5'};

