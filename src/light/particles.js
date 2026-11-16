/* ---- つぶ（花びら・光のちり・ほたる）。地図の上の位置で動く ---- */
const LP=[];const LP_COUNT={petal:7,mote:14,fly:9};
function lpSpawn(kind,cx,cy,init){const p={kind,t:0,ph:Math.random()*6.28},W=view.w,H=view.h;
  if(kind==='petal'){p.x=cx+(init?Math.random()*W:W+4+Math.random()*20);p.y=cy+(init?Math.random()*H:-10+Math.random()*H*.4);p.vx=-(5+Math.random()*9);p.vy=6+Math.random()*7;p.rot=Math.random()*6.28;p.spin=(Math.random()-.5)*5;p.s=.9+Math.random()*.5;}
  else if(kind==='mote'){p.x=cx+Math.random()*W;p.y=cy+Math.random()*H*.85;p.vx=(Math.random()-.5)*2;p.vy=-(1+Math.random()*2);p.life=5+Math.random()*5;p.s=.5+Math.random()*.7;}
  else{p.x=cx+Math.random()*W;p.y=cy+Math.random()*H;p.seed=Math.random()*100;}
  LP.push(p);}
function drawLP(dt,t,P,cx,cy){
  const k=LIT.pk;pctx.setTransform(1,0,0,1,0,0);pctx.clearRect(0,0,pfx.width,pfx.height);
  const mul=LIT.q===1?.5:1,W=view.w,H=view.h;
  const tint=P.sunCol.map((v,i)=>Math.min(1,v*.8+P.sky[i]*1.2+.15));
  for(const kind in LP_COUNT){let n=0;for(const p of LP)if(p.kind===kind)n++;
    const want=Math.round(LP_COUNT[kind]*mul*(kind==='fly'?P.night:kind==='mote'?Math.min(1,P.ray*1.2+.1):1));for(let i=n;i<want;i++)lpSpawn(kind,cx,cy,true);}
  for(let i=LP.length-1;i>=0;i--){const p=LP[i];p.t+=dt;
    const out=p.x<cx-30||p.x>cx+W+40||p.y<cy-40||p.y>cy+H+30;
    if(p.kind==='petal'){p.x+=(p.vx+Math.sin(t*1.7+p.ph)*4)*dt;p.y+=p.vy*dt;p.rot+=p.spin*dt;if(out){LP.splice(i,1);continue;}
      const s=p.s*k,a=.85*(.4+.6*Math.min(1,P.sunAmt+.25));
      pctx.save();pctx.translate((p.x-cx)*k,(p.y-cy)*k);pctx.rotate(p.rot);pctx.scale(1,.25+.75*Math.abs(Math.cos(p.rot*1.3+p.ph)));
      pctx.globalAlpha=a;pctx.fillStyle=`rgb(${255*tint[0]|0},${205*tint[1]|0},${218*tint[2]|0})`;
      pctx.beginPath();pctx.ellipse(0,0,s*1.3,s*.8,0,0,6.283);pctx.fill();pctx.restore();}
    else if(p.kind==='mote'){p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.t>p.life||out){LP.splice(i,1);continue;}
      const a=Math.sin(p.t/p.life*Math.PI)*(.4+.6*Math.sin(t*3+p.ph)**2)*Math.min(1,P.ray*1.3)*.8,r=p.s*k*1.6;if(a<.02)continue;
      const X=(p.x-cx)*k,Y=(p.y-cy)*k,g=pctx.createRadialGradient(X,Y,0,X,Y,r),c=P.rayCol.map(v=>Math.min(255,v*255+40)|0);
      g.addColorStop(0,`rgba(${c[0]},${c[1]},${c[2]},${a})`);g.addColorStop(1,`rgba(${c[0]},${c[1]},${c[2]},0)`);pctx.globalCompositeOperation='lighter';pctx.fillStyle=g;pctx.fillRect(X-r,Y-r,r*2,r*2);pctx.globalCompositeOperation='source-over';}
    else{p.x+=Math.sin(t*.7+p.seed)*6*dt+Math.sin(t*1.9+p.seed*2)*4*dt;p.y+=Math.cos(t*.6+p.seed*1.3)*5*dt;
      if(out||(P.night<.05&&Math.random()<dt)){LP.splice(i,1);continue;}
      const pulse=Math.max(0,Math.sin(t*2.2+p.seed*3)),a=pulse*P.night,r=(2.6+pulse*2.2)*k;if(a<.02)continue;
      const X=(p.x-cx)*k,Y=(p.y-cy)*k,g=pctx.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,`rgba(240,255,170,${a})`);g.addColorStop(.25,`rgba(200,255,120,${a*.55})`);g.addColorStop(1,'rgba(160,255,90,0)');
      pctx.globalCompositeOperation='lighter';pctx.fillStyle=g;pctx.fillRect(X-r,Y-r,r*2,r*2);pctx.globalCompositeOperation='source-over';}}
  pctx.globalAlpha=1;
}
// その地図の光（夜の窓・ランプ）と、ミノリの手もとのあかり
const LAMPS={farm:[],town:[]};
function lightsFor(pm,P,t,cx,cy){const L=[],vw=view.w,vh=view.h;
  const add=(x,y,z,r,c,I)=>{if(I<.01)return;if(x+r<cx||x-r>cx+vw||y-z-r>cy+vh||y+r<cy)return;L.push([x-cx,y-cy,z,r,c[0],c[1],c[2],I]);};
  LAMPS[pm].forEach((l,i)=>{const f=.92+.06*Math.sin(t*9+i*2)+.03*Math.sin(t*23+i);
    if(l[4]==='glow')add(l[0],l[1],l[2],l[3],[.5,.72,1],P.night*.3);else add(l[0],l[1]+1,l[2]||29,l[3]||54,[1,.74,.44],P.lamp*(l[4]==='lan'?.9:1.5)*f);});
  for(const w of WINDOWS[pm])add(w[0]+5,(w[2]||w[1]+20)+3,12,40,[1,.7,.4],P.win*1.25);
  add(P2x(),P2y()+1,16,46,[1,.8,.55],P.night*.55);
  return L;}
const P2x=()=>Math.round(P.x*TS)+8,P2y=()=>Math.round(P.y*TS)+15;

