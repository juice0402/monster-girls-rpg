/* ---- 建物の部品 ---- */
function roof(g,X,Y,w,h,c,cd){
  const o=shade(c,.5),l=shade(c,1.22),hl=shade(c,1.45);
  g.fillStyle=o;g.fillRect(X-3,Y-1,w+6,h+2);g.fillStyle=c;g.fillRect(X-2,Y,w+4,h);
  for(let ry=0,ri=0;ry<h-2;ry+=5,ri++){const yy=Y+ry;g.fillStyle=l;g.fillRect(X-2,yy,w+4,1);g.fillStyle=cd;g.fillRect(X-2,yy+4,w+4,1);
    const off=(ri%2)*5;g.fillStyle=cd;for(let sx=X-2+off;sx<X+w+2;sx+=10)g.fillRect(sx,yy+1,1,3);
    for(let sx=X-2+off+2;sx<X+w+2;sx+=10)if(hash(sx,yy)>.6){g.fillStyle=hl;g.fillRect(sx,yy+1,2,1);}}
  g.fillStyle=o;g.fillRect(X-3,Y+h-1,w+6,2);g.fillStyle=shade(c,.72);g.fillRect(X-2,Y+h-2,w+4,1);
}
function wall(g,X,Y,w,h,c,cd){
  const l=shade(c,1.1),o=shade(c,.55);
  g.fillStyle=c;g.fillRect(X,Y,w,h);
  for(let yy=Y+5;yy<Y+h-4;yy+=6){g.fillStyle=cd;g.fillRect(X,yy,w,1);g.fillStyle=l;g.fillRect(X,yy+1,w,1);}
  for(let k=0;k<w*h/180;k++){const kx=X+((hash(X+k,Y)*w)|0),ky=Y+3+((hash(Y,X+k*3)*(h-8))|0);pset(g,kx,ky,cd);}
  g.fillStyle='rgba(40,20,10,.28)';g.fillRect(X,Y,w,3);g.fillStyle='rgba(40,20,10,.14)';g.fillRect(X,Y+3,w,2);
  g.fillStyle=o;g.fillRect(X,Y,1,h);g.fillRect(X+w-1,Y,1,h);g.fillStyle=cd;g.fillRect(X+1,Y,2,h);g.fillRect(X+w-3,Y,2,h);
  // 土台の石
  const sy=Y+h-4;g.fillStyle='#6f6a63';g.fillRect(X-1,sy,w+2,4);
  for(let sx=X-1,k=0;sx<X+w+1;sx+=6,k++){g.fillStyle=k%2?'#a39d93':'#b1aba1';g.fillRect(sx,sy,5,3);g.fillStyle='#c9c4ba';g.fillRect(sx,sy,5,1);}
}
function door(g,X,Y){
  g.fillStyle='#3b2416';g.fillRect(X+1,Y-1,14,19);g.fillStyle='#7a4a2a';g.fillRect(X+2,Y,12,18);
  g.fillStyle='#93603a';for(let i=0;i<4;i++)g.fillRect(X+2+i*3,Y,2,18);
  g.fillStyle='#5e381f';g.fillRect(X+2,Y+5,12,1);g.fillRect(X+2,Y+12,12,1);
  g.fillStyle='#ffd25e';g.fillRect(X+11,Y+9,2,2);g.fillStyle='#b8862a';pset(g,X+12,Y+10,'#b8862a');
  g.fillStyle='#8f8a82';g.fillRect(X,Y+18,16,2);g.fillStyle='#b9b3a8';g.fillRect(X,Y+18,16,1);
}
function win(g,X,Y,glass){
  g.fillStyle='#3b2416';g.fillRect(X-1,Y-1,14,13);g.fillStyle='#f1e2c2';g.fillRect(X,Y,12,11);
  const gl=glass||'#86c9ea';g.fillStyle=gl;g.fillRect(X+1,Y+1,10,9);
  g.fillStyle=shade(gl,.8);g.fillRect(X+1,Y+1,10,2);
  g.fillStyle='rgba(255,255,255,.55)';pset(g,X+2,Y+7,'rgba(255,255,255,.55)');g.fillRect(X+3,Y+5,1,2);g.fillRect(X+4,Y+3,1,2);g.fillRect(X+8,Y+6,1,2);
  g.fillStyle='#f1e2c2';g.fillRect(X+6,Y+1,1,9);g.fillRect(X+1,Y+5,10,1);
  // 花のプランター
  g.fillStyle='#3b2416';g.fillRect(X-2,Y+11,16,4);g.fillStyle='#8a5a32';g.fillRect(X-1,Y+12,14,2);g.fillStyle='#a8743f';g.fillRect(X-1,Y+12,14,1);
  for(let k=0;k<5;k++){const fx=X-1+k*3;g.fillStyle='#4f9a37';g.fillRect(fx,Y+10,2,2);g.fillStyle=k%2?'#ff8fb8':'#ffd25e';pset(g,fx+(k%2),Y+9,g.fillStyle);}
}
function shipBox(g,X,Y){
  grid(g,[
    '................','................','.oooooooooooooo.','obhhhhhhhhhhhhbo','obbbbbbbbbbbbbbo','oddddddddddddddo','oooooooooooooooo','obbbbbyybbbbbbbo',
    'oblbbbyybbbblbbo','oblbbbbbbbbblbbo','odddddddddddddd o'.replace(' ',''),'oblbbbbbbbbblbbo','oblbbbbbbbbblbbo','oddddddddddddddo','.oooooooooooooo.','................'],
    {o:'#3b2416',b:'#a8733f',h:'#c99158',l:'#bf8a52',d:'#7d5130',y:'#ffd25e'},X,Y);
  g.fillStyle='rgba(25,60,20,.35)';g.fillRect(X+1,Y+15,14,1);
  nrect(X,Y+2,16,4,[0,.35,.94],Y+15,1,.03);nrect(X,Y+6,16,9,(i)=>[i<1?-.6:i>14?.6:0,1,0],Y+15,1,.03);
  if(CAST)CAST.push({sil:rectSil(16,16,[[1,2,14,13]]),x:X,y:Y,ay:Y+15});
}

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
function cropSprite(key){if(CROPC[key])return CROPC[key];const a=CROP_ART[key];
  return CROPC[key]=mk(16,16,g=>grid(g,a.r,Object.assign({},LEAF,a.p||{}),0,a.y));}
function drawCrop(g,id,stage,x,y){
  const key=stage===3?id:'s'+stage;
  if(stage>=1){g.fillStyle='rgba(40,20,10,.25)';g.fillRect(x+4,y+13,8,2);}
  g.drawImage(cropSprite(key),x,y);
}

/* ---- 岩・野の花 ---- */
const ROCK=mk(16,16,g=>{g.fillStyle='rgba(20,40,15,.35)';g.fillRect(2,14,12,2);
  grid(g,['................','................','................','................','................','.....OOOOOO.....','...OOhhllllOO...','..OhhlllllmmmO..',
    '..OhllllllmmmO..','.OllllllmmmmmdO.','.OlllmmmmmmmddO.','.OmmmmmmmmmdddO.','.OdmmmmmmddddO..','..OddddddddOO...','...OOOOOOOO.....'],
    {O:'#3e3b39',h:'#d6d1cb',l:'#b3ada7',m:'#8f8984',d:'#6c6763'},0,0);
  pset(g,9,8,'#6c6763');pset(g,8,9,'#6c6763');pset(g,8,10,'#6c6763');});
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
  const glass=(from,zb)=>{for(let i=from;i<WINDOWS[m].length;i++){const w=WINDOWS[m][i];w[2]=zb;nGlass(w[0],w[1],zb);}};
  if(m==='farm'){
    // 家（x1..6, y2..5）
    let X=1*TS,Y=2*TS;roof(g,X,Y,96,28,'#b5533c','#8e3e2c');wall(g,X,Y+28,96,36,'#d8b07a','#b88a55');
    door(g,X+32,Y+46);win(g,X+10,Y+36);win(g,X+70,Y+36);WINDOWS.farm.push([X+11,Y+37],[X+71,Y+37]);
    g.fillStyle='#8e3e2c';g.fillRect(X+78,Y+4,8,10);g.fillStyle='#6b2e20';g.fillRect(X+78,Y+4,8,2);
    glass(0,nHouse(X,Y,96,28,36));nrect(X+78,Y+4,8,10,(i,j)=>j<2?NU:[i<1?-.6:i>6?.6:0,1,0],Y+59);
    // 増築（x7..10）
    X=7*TS;
    if(S.reno.state===2){roof(g,X,Y+4,64,24,'#c56a4a','#9c4e35');wall(g,X,Y+28,64,36,'#dcb886','#bc9260');
      const occ=S.rooms;win(g,X+8,Y+38,occ[0]?ROOM_COLOR[occ[0]]:null);win(g,X+44,Y+38,occ[1]?ROOM_COLOR[occ[1]]:null);door(g,X+24,Y+46);
      WINDOWS.farm.push([X+9,Y+39],[X+45,Y+39]);glass(WINDOWS.farm.length-2,nHouse(X,Y+4,64,24,36));}
    else if(S.reno.state===1){g.fillStyle='#a07040';for(let i=0;i<=64;i+=16)g.fillRect(X+Math.min(i,62),Y+10,2,54);g.fillRect(X,Y+12,64,2);g.fillRect(X,Y+34,64,2);g.fillRect(X,Y+56,64,2);g.fillStyle='#d8b07a';g.fillRect(X+4,Y+40,24,24);g.fillStyle='#b88a55';g.fillRect(X+4,Y+46,24,1);g.fillRect(X+4,Y+53,24,1);}
    // 出荷箱
    X=12*TS;Y=5*TS;shipBox(g,X,Y);
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
  drawBuildings(g,m);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(tile(m,x,y)==='T'){drawTree(g,x,y);
    // 森のふちの木だけ影を落とす（中の木の影はとなりの木にかくれる）
    if(tile(m,x-1,y)!=='T'||tile(m,x+1,y)!=='T'||tile(m,x,y-1)!=='T'||tile(m,x,y+1)!=='T'){const X=x*TS,Y=y*TS,keep=NB;NB=null;
      const tc=mk(32,34,tg=>{tg.translate(8-X,10-Y);drawTree(tg,x,y);});NB=keep;CAST.push({sil:silOf(tc),x:X-8,y:Y-10,ay:Y+15});}}
  // 色の明るさから1ドットずつのでこぼこを足して、3枚組にする
  const cd=g.getImageData(0,0,W,H).data,nn=bumpLum(cd,NB.n,NB.d,W,H,2.4),mask=new Uint8ClampedArray(W*H*4);
  for(let i=0;i<W*H;i++)if(NB.d[i*4]>0)mask[i*4+3]=255;
  BASE3[m]={n:bufCanvas(W,H,nn),d:bufCanvas(W,H,NB.d),mask:bufCanvas(W,H,mask),casters:CAST};
  NB=null;CAST=null;
  BASE[m]=c;
}
const ROOM_COLOR={chloe:'#7a56a8',luu:'#9adb6e'};

