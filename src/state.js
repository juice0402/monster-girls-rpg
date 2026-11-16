/* ---------- 状態 ---------- */
let S=null;
function newState(){
  const s={v:1,day:1,time:DAY_START,money:300,stamina:100,maxSt:100,map:'farm',px:3,py:6,dir:0,
    seeds:{kabu:15,jaga:0,ichigo:0},hand:'hoe',tools:{hoe:1,can:1,pick:1},
    inv:{kabu:0,jaga:0,ichigo:0,stone:0,flower:0},ship:{kabu:0,jaga:0,ichigo:0},
    farm:{soil:Array(MW*MH).fill(0),wet:Array(MW*MH).fill(0),crop:Array(MW*MH).fill(null),rock:Array(MW*MH).fill(0),flower:Array(MW*MH).fill(0)},
    reno:{state:0,days:0},rooms:[null,null],
    npc:{chloe:{pts:0,met:false,talked:false,gifted:false,live:false,pending:false,tc:0},luu:{pts:0,met:false,talked:false,gifted:false,live:false,pending:false,tc:0},shop:{pts:0,met:false,talked:false,gifted:false,live:false,pending:false,tc:0}},
    stats:{earned:0,shipped:0},flags:{intro:false,hints:{},banterDay:0,banterIdx:0,renoTold:false},over:false};
  const R=rng(7);let n=0;
  while(n<30){const x=3+((R()*10)|0),y=9+((R()*11)|0);if(y<=10&&(x===7||x===8))continue;const i=I(x,y);if(!s.farm.rock[i]){s.farm.rock[i]=1;n++;}}
  fixRocks(s.farm);
  return s;
}
// 畑のどのマスにも歩いて行けるように、道をふさぐ岩を間引く
function fixRocks(F){
  const open=(x,y)=>{const t=tile('farm',x,y);return !(BLOCK.has(t)||t==='A')&&!F.rock[I(x,y)];};
  for(let guard=0;guard<80;guard++){
    const seen=new Uint8Array(MW*MH);const q=[I(7,8)];seen[q[0]]=1;
    while(q.length){const c=q.pop();const cx=c%MW,cy=(c/MW)|0;for(const[dx,dy]of DIRS){const nx=cx+dx,ny=cy+dy,ni=I(nx,ny);if(!seen[ni]&&open(nx,ny)){seen[ni]=1;q.push(ni);}}}
    let bad=-1;for(let y=9;y<=19&&bad<0;y++)for(let x=3;x<=12;x++){const i=I(x,y);if(!F.rock[i]&&!seen[i]){bad=i;break;}}
    if(bad<0)return;
    // ふさがれた場所のまわりの岩を1つどける（外とつながる岩を優先）
    const reg=new Uint8Array(MW*MH);const st=[bad];reg[bad]=1;const rocks=[];
    while(st.length){const c=st.pop();const cx=c%MW,cy=(c/MW)|0;for(const[dx,dy]of DIRS){const nx=cx+dx,ny=cy+dy,ni=I(nx,ny);if(reg[ni])continue;if(F.rock[ni]){reg[ni]=1;rocks.push(ni);}else if(open(nx,ny)){reg[ni]=1;st.push(ni);}}}
    const good=rocks.find(ri=>DIRS.some(([dx,dy])=>seen[I(ri%MW+dx,((ri/MW)|0)+dy)]));
    F.rock[good!=null?good:rocks[0]]=0;
    if(!rocks.length)return;
  }
}
function save(){try{S.px=Math.round(P.x);S.py=Math.round(P.y);S.dir=P.dir;localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}}
function loadSave(){try{const t=localStorage.getItem(SAVE_KEY);if(!t)return null;const s=JSON.parse(t);return s&&s.v===1?s:null;}catch(e){return null;}}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}
const hearts=id=>Math.min(MAX_HEARTS,Math.floor(S.npc[id].pts/HEART));
function addPts(id,v){const n=S.npc[id];const before=hearts(id);n.pts=Math.max(0,Math.min(MAX_HEARTS*HEART,n.pts+v));const r=RT[id];
  if(v>0&&r)fxText(r.x*TS+8,r.y*TS-10,'♥','heart');
  if(hearts(id)>before)toast(`${DLG[id].name}との なかよし が ♥${hearts(id)} になった`);}

/* ---------- 動くもの ---------- */
const P={x:3,y:6,path:[],dir:0,speed:5,anim:0,act:null,task:null,tries:0};
const RT={};
const Q=[];
function moveAlong(e,dt,speed){
  if(!e.path.length)return false;
  const [tx,ty]=e.path[0];const dx=tx-e.x,dy=ty-e.y;const d=Math.hypot(dx,dy);const step=speed*dt;
  if(Math.abs(dx)>Math.abs(dy))e.dir=dx>0?3:2;else if(dy!==0)e.dir=dy>0?0:1;
  if(step>=d){e.x=tx;e.y=ty;e.path.shift();}else{e.x+=dx/d*step;e.y+=dy/d*step;}
  e.anim+=dt;return true;
}
function bfs(m,sx,sy,isGoal){
  const prev=new Int16Array(MW*MH).fill(-1),seen=new Uint8Array(MW*MH);const st=I(sx,sy);const q=[st];seen[st]=1;let h=0;
  while(h<q.length){const c=q[h++];const cx=c%MW,cy=(c/MW)|0;
    if(isGoal(cx,cy)){const path=[];let k=c;while(k!==st){path.push([k%MW,(k/MW)|0]);k=prev[k];}return{path:path.reverse(),end:[cx,cy]};}
    for(const[dx,dy]of DIRS){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const ni=I(nx,ny);if(seen[ni]||blocked(m,nx,ny))continue;seen[ni]=1;prev[ni]=c;q.push(ni);}
  }
  return null;
}
const near=(ax,ay,bx,by,d)=>Math.abs(ax-bx)+Math.abs(ay-by)<=d;
function faceTo(e,tx,ty){const dx=tx-e.x,dy=ty-e.y;if(Math.abs(dx)>Math.abs(dy))e.dir=dx>0?3:2;else if(dy!==0)e.dir=dy>0?0:1;}

