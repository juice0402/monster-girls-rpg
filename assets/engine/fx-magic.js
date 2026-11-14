'use strict';
// ===== 魔法・光のエフェクト（リリスなど）=====
// GPT の絵（character.json の fx）があればそれを使い、なければコードで描く。
// 描いた魔法の素材（ガード・魔弾・着弾・大技）は assets/painted-vfx.js の paintedFX（ページで先に読みこむ）
const MAGIC=[186,88,246];
// 魔法の光（engine の glow より芯が小さい・むらさき）
function mglow(x,y,r,a,col=MAGIC){if(a<=0)return;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(...col,a));g.addColorStop(.24,rgba(...col,a*.44));g.addColorStop(1,rgba(...col,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function mstar(x,y,r,a,color='#f3caff'){star(x,y,r,a,color)}
// 描いた魔法の素材：guard・bolt（魔弾）・burst（着弾）・ultimate（大技）
function vfx(kind,x,y,w,h,a,rot=0){if(a>0&&typeof paintedFX==='function')paintedFX(ctx,kind,x,y,w,h,a,rot)}

// GPT の絵を名前の頭で描く（heart_bits → heart_bits_1 など。なければ何もしない）
function art(base,x,y,w,h,a,rot=0,seed=0){const n=painted(base,seed);return n?sprite(n,x,y,w,h,a,rot):false}

// ===== ハート（GPT の絵 heart_glow・heart_crystal があればそれ、なければコードの単色）=====
const HEART_ART=['heart_glow','heart_crystal'];
function heart(x,y,r,a,rot=0,seed=0){if(a<=0)return;const list=HEART_ART.map(k=>painted(k,seed)).filter(Boolean);
 if(list.length){const name=list[Math.abs(seed|0)%list.length];sprite(name,x,y,r*5,r*5,Math.min(1,a*1.3),rot);return}// GPT の絵はふちが光るので、コードのハートより少し大きく
 ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.globalAlpha=clamp(a,0,1);ctx.shadowColor='#fb7bcf';ctx.shadowBlur=14;ctx.fillStyle='#ff93dd';ctx.beginPath();ctx.moveTo(0,r);ctx.bezierCurveTo(-r*1.65,-r*.1,-r*1.1,-r*.9,0,-r*.22);ctx.bezierCurveTo(r*1.1,-r*.9,r*1.65,-r*.1,0,r);ctx.fill();ctx.restore()}

// ===== 魔法陣 =====
function circleRunes(x,y,rx,ry,a,rot){if(a<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle=rgba(250,180,255,a*.77);ctx.lineWidth=2;ctx.shadowBlur=13;ctx.shadowColor='#d86aff';ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,rx*.75,ry*.75,0,0,TAU);ctx.stroke();
 for(let i=0;i<12;i++){const ang=i*TAU/12;ctx.save();ctx.translate(Math.cos(ang)*rx,Math.sin(ang)*ry);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(3.5,0);ctx.lineTo(0,5);ctx.stroke();ctx.restore()}ctx.restore()}
// 手のひらの魔法陣と回る星（余韻など）
function castHand(x,y,power,t,big=false){mglow(x,y,56+power*18,.5*power);circleRunes(x,y,big?68:42,big?68:42,power*.58,t*.38);for(let k=0;k<7;k++){const a=t*1.8+k*TAU/7;mstar(x+Math.cos(a)*35,y+Math.sin(a)*35,3.2,power*.68)}}
// 床の魔法陣（大きさは変えず、明るさだけ変える）。絵は character.json の fx「floor」
function magicFloor(x,power){if(power<=0)return;mglow(x,G+12,147,power*.15);sprite('floor',x,G+9,345,100,power*.38,0,'screen');for(let i=0;i<8;i++){const a=i*TAU/8;mstar(x+Math.cos(a)*145,G+8+Math.sin(a)*18,3,power*.32)}}
// 舞いあがる光の粒
function dust(power,more=false){for(let k=0;k<(more?40:22);k++){const q=((gt*.07+k*.618)%1+1)%1;const x=150+(k*71)%410+Math.sin(gt*.8+k*4)*19,y=565-q*430,rad=1+(k%4)*.7;const a=power*(.35+.5*Math.sin(q*Math.PI));mglow(x,y,rad*6,a*.23);if(k%4===0)mstar(x,y,rad*2,a*.45)}}
