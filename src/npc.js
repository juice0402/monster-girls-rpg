/* ---------- 住人の1日 ---------- */
function schedule(id){
  const t=S.time,n=S.npc[id];
  if(id==='chloe'){
    if(S.reno.state===1&&t>=420&&t<1020)return{map:'farm',mode:'build',x:9,y:6};
    if(n.live){
      if(t<420)return{map:'farm',mode:'idle',x:5,y:7};
      if(t<720)return{map:'farm',mode:'rocks'};
      if(t<1020)return{map:'town',mode:'idle',x:4,y:6,anim:true};
      if(t<1260)return{map:'farm',mode:'wander',area:[4,6,14,7]};
      return{hidden:true};
    }
    if(t<480||t>=1260)return{hidden:true};
    if(t<1080)return{map:'town',mode:'idle',x:4,y:6,anim:true};
    return{map:'town',mode:'wander',area:[3,8,6,10]};
  }
  if(id==='luu'){
    if(n.live){if(t>=1140)return{hidden:true};return{map:'farm',mode:'water'};}
    if(t<420||t>=1140)return{hidden:true};
    return{map:'town',mode:'wander',area:[5,8,10,13]};
  }
  if(t<540||t>=1020)return{hidden:true};
  return{map:'town',mode:'idle',x:13,y:6};
}
function spawnFor(id,sc){
  if(sc.x!=null&&!sc.wander)return id==='chloe'&&sc.map==='town'?[3,6]:[sc.x,sc.y];
  if(sc.map==='farm')return S.reno.state===2?[8,6]:[3,6];
  if(id==='luu')return[7,21];
  return[4,8];
}
function randTile(m,a){for(let k=0;k<20;k++){const x=a[0]+((Math.random()*(a[2]-a[0]+1))|0),y=a[1]+((Math.random()*(a[3]-a[1]+1))|0);if(!blocked(m,x,y))return[x,y];}return null;}
function npcPath(r,goal){const res=bfs(r.map,Math.round(r.x),Math.round(r.y),goal);if(res){r.path=res.path;return res;}return null;}
const DBGN={};   // 試す用：人をその場に立たせる
function updNpc(id,dt){
  const r=RT[id],sc=schedule(id);
  if(DBGN[id]){const q=DBGN[id];Object.assign(r,{map:q[0],x:q[1],y:q[2],dir:q[3],hidden:false,path:[],act:null,task:null});return;}
  if(sc.hidden){r.hidden=true;r.path=[];r.task=null;r.act=null;return;}
  if(r.hidden||r.map!==sc.map){r.hidden=false;r.map=sc.map;const sp=spawnFor(id,sc);r.x=sp[0];r.y=sp[1];r.path=[];r.task=null;r.act=null;}
  if(r.bub>0)r.bub-=dt;
  if(r.wait>0){r.wait-=dt;if(r.path.length>1)r.path=r.path.slice(0,1);moveAlong(r,dt,r.speed);return;}
  if(r.act){r.act.t+=dt;if(r.act.t>=r.act.dur){const a=r.act;r.act=null;a.done&&a.done();}return;}
  if(moveAlong(r,dt,r.speed))return;
  r.idle=(r.idle||0)-dt;
  const m=sc.mode;
  if(m==='idle'||m==='build'){
    if(r.x!==sc.x||r.y!==sc.y){if(!npcPath(r,(x,y)=>x===sc.x&&y===sc.y)){r.x=sc.x;r.y=sc.y;}return;}
    if(m==='build'){r.dir=1;if(r.idle<=0){r.idle=.7;r.act={t:0,dur:.35,done:()=>dust(10*TS,5*TS+8,'#c8925a',4)};}}
    else{r.dir=0;if(sc.anim&&r.idle<=0){r.idle=2+Math.random()*3;r.dir=3;r.act={t:0,dur:.4,done:()=>dust(5*TS+8,6*TS+6,'#ffb347',3)};}}
    return;
  }
  if(m==='wander'){if(r.idle<=0){const t=randTile(r.map,sc.area);if(t)npcPath(r,(x,y)=>x===t[0]&&y===t[1]);r.idle=2+Math.random()*4;}return;}
  if(m==='rocks'||m==='water'){
    const isT=m==='rocks'?(x,y)=>S.farm.rock[I(x,y)]===1:(x,y)=>{const c=S.farm.crop[I(x,y)];return c&&!c.ready&&!S.farm.wet[I(x,y)];};
    if(r.task){const[tx,ty]=r.task;
      if(!isT(tx,ty)){r.task=null;return;}
      faceTo(r,tx,ty);
      if(m==='rocks'){r.hits=(r.hits||0)+1;r.act={t:0,dur:.45,done:()=>{dust(tx*TS+8,ty*TS+8,'#9d978a',5);
        if(r.hits>=3){r.hits=0;r.task=null;S.farm.rock[I(tx,ty)]=0;S.inv.stone+=2;fxText(tx*TS+8,ty*TS,'+2 石');if(Math.random()<.35)bubble(id,pick(DLG.chloe.work));}}};}
      else{r.act={t:0,dur:.5,done:()=>{splash(tx*TS+8,ty*TS+8);S.farm.wet[I(tx,ty)]=1;r.task=null;if(Math.random()<.15)bubble(id,pick(DLG.luu.work));}};}
      return;
    }
    if(r.idle>0)return;
    const res=bfs(r.map,Math.round(r.x),Math.round(r.y),(x,y)=>{for(const[dx,dy]of DIRS)if(isT(x+dx,y+dy))return true;return m==='water'&&isT(x,y);});
    if(res){r.path=res.path;const[ex,ey]=res.end;if(m==='water'&&isT(ex,ey))r.task=[ex,ey];else for(const[dx,dy]of DIRS)if(isT(ex+dx,ey+dy)){r.task=[ex+dx,ey+dy];break;}}
    else{const t=randTile(r.map,m==='rocks'?[4,6,14,7]:[8,21,10,22]);if(t)npcPath(r,(x,y)=>x===t[0]&&y===t[1]);r.idle=3+Math.random()*4;}
  }
}

