'use strict';
// ===== リリス（サキュバスの魔導士）の動きとエフェクト =====
// 前の lilith-motions.html（いまは lilith-motions-old.html）の動きとエフェクトをそのまま引っ越し（2026-11-14）
// アンカーは character.json、魔法の道具は assets/engine/fx-magic.js、描いた魔法の素材は assets/painted-vfx.js
const LILITH_MOTIONS=[
 {id:'P01',name:'待機／立ち絵',short:'呼吸・翼の微動',duration:3.3,seq:[[0,'P01']]},
 {id:'P02',name:'歩行 A',short:'右脚の一歩目',duration:1.4,seq:[[0,'P02']]},
 {id:'P03',name:'歩行 B',short:'反対脚の二歩目',duration:1.4,seq:[[0,'P03']]},
 {id:'P04',name:'攻撃予備動作',short:'詠唱の構え',duration:1.7,seq:[[0,'P04']]},
 {id:'P05',name:'通常攻撃',short:'魔弾を1発放つ',duration:2.1,seq:[[0,'P05']]},
 {id:'P06',name:'チャージ／詠唱',short:'魔力を収束',duration:3.2,seq:[[0,'P06']]},
 {id:'P07',name:'必殺技',short:'紫の大技・着弾',duration:3.5,seq:[[0,'P07']]},
 {id:'P08',name:'支援／回復',short:'回復の光を広げる',duration:2.7,seq:[[0,'P08']]},
 {id:'P09',name:'防御／ガード',short:'防御結界を張る',duration:2.6,seq:[[0,'P09']]},
 {id:'P10',name:'被ダメージ',short:'衝撃を受けてのけぞる',duration:1.8,seq:[[0,'P10']]},
 {id:'P11',name:'戦闘不能',short:'専用絵の自然な揺れ・形状維持',duration:3.1,seq:[[0,'P11']]},
 {id:'P12',name:'発動後の余韻',short:'ポーズを戻して残光',duration:2.9,seq:[[0,'P12']]},
 {id:'P13',name:'挑発／アピール',short:'ハートと魅了の動作',duration:2.8,seq:[[0,'P13']]},
 {id:'P14',name:'セクシー勝利',short:'専用の勝利立ち絵',duration:3.1,seq:[[0,'P14']]},
 {id:'SP01',name:'固有技・魅惑の月蝕',short:'蝶と魅了光の大技',duration:3.8,seq:[[0,'SP01']]},
 {id:'SP02',name:'固有技・魔力吸収',short:'敵から魔力を回収',duration:3.5,seq:[[0,'SP02']]}];

// 体の動き（前のページの数字のまま。拡大はふつう1.07倍、P07は1.05倍、SP01は1.06倍）
function actorParams(id,t,p){let dx=0,dy=0,tilt=0,sx=1,sy=1,scale=1.07;const br=Math.sin(gt*1.7)*.004;sy+=br;sx-=br*.18;
 switch(id){
 case 'P01':dx=Math.sin(gt*.65)*1.1;dy=Math.sin(gt*1.1)*.8;break;
 case 'P02':dx=Math.sin(t*5)*13+8;dy=-Math.abs(Math.sin(t*5))*5;tilt=.012*Math.sin(t*5);break;
 case 'P03':dx=Math.sin(t*5+Math.PI)*13+7;dy=-Math.abs(Math.sin(t*5+Math.PI))*5;tilt=-.012*Math.sin(t*5);break;
 case 'P04':dx=-8*smooth(p/.4);tilt=-.026*smooth(p/.6);break;
 case 'P05':dx=-8+18*smooth((p-.38)/.18);tilt=.018*Math.sin(Math.PI*p);break;
 case 'P06':dy=-2*Math.sin(t*2.2);sx+=.003*Math.sin(t*2);break;
 case 'P07':dx=10*smooth((p-.30)/.2);dy=-3*smooth((p-.3)/.3);scale=1.05;break;
 case 'P08':dy=-2*Math.sin(p*Math.PI);break;
 case 'P09':tilt=-.025*smooth(p/.25);break;
 case 'P10':tilt=-.10*smooth(p/.18)*(1-smooth((p-.7)/.24));dx=-17*smooth(p/.19)*(1-smooth((p-.73)/.22));break;
 case 'P11':{const s=smooth(p/.28);dx=-2*s;dy=7*s+Math.sin(gt*.9)*.6;tilt=-.014*s+Math.sin(gt*.8)*.003;break}
 case 'P12':dx=-3+3*smooth((p-.2)/.65);tilt=.018*(1-p);break;
 case 'P13':tilt=Math.sin(t*2.0)*.021;dy=Math.sin(t*1.7)*2;break;
 case 'P14':tilt=Math.sin(t*1.4)*.018;dy=Math.sin(t*1.9)*1.4;break;
 case 'SP01':dy=-2-Math.sin(t*2)*2;scale=1.06;break;
 case 'SP02':tilt=.018;dy=-3*Math.sin(t*1.7);break;}
 const k=scale/1.07;return {dx:dx-1,dy,tilt,sx:sx*k,sy:sy*k}}// -1：前のページの立ち位置（281）にそろえる

// 敵に当たったとき（flash＝画面のピンクの光と、敵の光・数字）
const hitAt=(p,a,len)=>p>a&&p<a+len?Math.sin(Math.PI*smooth((p-a)/len)):0;
function enemyState(id,t,p){return {hit:0,flash:['P05','P07','SP01'].includes(id)?hitAt(p,.73,.22):0}}
function hp(id,p){
 if(['P05','P07','SP01'].includes(id))return {enemy:Math.round(100-60*smooth((p-.75)/.06)),player:100};
 if(id==='P10'||id==='P11')return {enemy:100,player:Math.round(100-55*smooth((p-.22)/.14))};
 if(id==='P08')return {enemy:100,player:Math.round(55+45*smooth((p-.5)/.22))};
 return {enemy:100,player:100}}

// 背景（むらさきの夜・床の線）
function lilithBackground(flash){const im=images.bg;if(ok(im)){const sw=im.naturalWidth,sh=im.naturalHeight,sy=95,cropH=Math.min(sh-sy,650);ctx.drawImage(im,0,sy,sw,cropH,0,0,W,H)}else{const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#241237');g.addColorStop(1,'#0c0b19');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
 ctx.fillStyle='#0b081547';ctx.fillRect(0,0,W,H);const fl=ctx.createLinearGradient(0,470,0,700);fl.addColorStop(0,'#180c2455');fl.addColorStop(1,'#150918d9');ctx.fillStyle=fl;ctx.fillRect(0,470,W,230);
 ctx.strokeStyle=rgba(196,145,230,.075);ctx.lineWidth=1;for(let i=0;i<11;i++){ctx.beginPath();ctx.moveTo(0,477+i*23);ctx.lineTo(W,477+i*23);ctx.stroke()}
 if(flash>0){ctx.fillStyle=rgba(252,157,244,flash*.17);ctx.fillRect(0,0,W,H)}}

// 蝶（前のページのまま。0番と4番は出さない）
function butterfly(i,intensity,ax,ay){const n=i%4;if(!n)return;const ph=((gt*.11+i*.23)%1+1)%1;const x=ax-115+i*38+Math.sin(gt*1.1+i*2.5)*19+ph*8,y=ay+150-ph*355+Math.sin(gt*1.35+i)*7;const s=(14+(i%3)*7)*(.85+Math.sin(gt*9+i)*.15);
 sprite('butterfly_'+n,x,y,s,s,clamp((.35+.55*Math.sin(ph*Math.PI))*intensity,0,1),Math.sin(gt*.6+i)*.22)}

const SPELL=['P04','P05','P06','P07','SP01','SP02'];
function effects(layer,m,t,p,X,es){if(layer!=='front')return;const id=m.id;
 // 敵の光と数字（前のページでは敵といっしょに描いていた）
 const hu=es.flash;if(hu>0){mglow(750,467,125,hu*.72);ctx.save();ctx.globalAlpha=clamp(hu*.85,0,1);ctx.fillStyle='#ffe6ff';ctx.font='bold 33px system-ui';ctx.fillText('− 240',713,346-hu*38);ctx.restore()}
 const [hx,hy]=anchor(X,'palm');let hit=0;const attack=['P05','P07','SP01','SP02'].includes(id);
 let floorPower=0;if(attack||id==='P04'||id==='P06')floorPower=.15+.8*smooth(p/.35)*(1-smooth((p-.75)/.35));if(id==='P08'||id==='P09')floorPower=.18+.32*smooth(p/.25);if(id==='P14')floorPower=.25;
 if(floorPower>.08)sprite('halo',280,415,270,156,clamp(floorPower,0,1)*.14);
 const bp=attack?.55+.35*smooth(p/.38):.48;for(let k=0;k<(attack?7:4);k++)butterfly(k,Math.min(1,bp),268,352);
 dust(id==='P01'?.40:attack?.70:.48,id==='P07'||id==='SP01');
 // 手のひらの魔法陣（大きさは決まり、明るさだけ変える）
 if(SPELL.includes(id)){const pw=smooth((p-.09)/.37)*(1-smooth((p-.86)/.15));if(pw>0){const big=id==='P07'||id==='SP01';sprite('sigil',hx,hy,big?140:93,big?140:93,pw*.62,gt*.12);if(id==='P06'||big)sprite('charge',hx,hy,56,56,pw*.55,gt*.28)}}
 switch(id){
 case 'P02':case 'P03':for(let i=0;i<4;i++){const a=clamp(1-Math.abs((t*.9+i*.25)%1-.25)*2,0,1);mglow(239+i*12,565,15,a*.21,[186,105,214])}break;
 case 'P04':{const pw=smooth((p-.20)/.53)*(1-smooth((p-.91)/.09));if(pw>.01){vfx('ultimate',hx,hy,164+pw*25,150+pw*20,pw*.63,gt*.11);sprite('charge',hx,hy,61,61,pw*.32)}break}
 case 'P05':{const q=smooth((p-.33)/.44),fade=1-smooth((p-.81)/.10);
  if(p>.23&&p<.91){const bx=lerp(hx,748,q),by=lerp(hy,462,q),grow=70+135*smooth(q/.27);vfx('ultimate',hx,hy,120,111,.25*fade,gt*.13);vfx('bolt',bx+grow*.13,by,grow,grow*.65,Math.min(1,.92*fade),-.045);mglow(bx,by,27,.28*fade)}
  hit=hitAt(p,.75,.19);break}
 case 'P06':{const pw=smooth(p/.74)*(1-smooth((p-.92)/.08));vfx('ultimate',hx,hy,192+pw*30,173+pw*32,pw*.8,-gt*.08);sprite('charge',hx,hy,66,66,pw*.38,gt*.22);for(let k=0;k<7;k++){const a=gt*.9+k*TAU/7;mstar(hx+Math.cos(a)*75,hy+Math.sin(a)*67,3.1,pw*.47)}break}
 case 'P07':case 'SP01':{const pw=smooth((p-.12)/.28)*(1-smooth((p-.91)/.09)),fin=id==='SP01';
  vfx('ultimate',hx,hy,fin?220:180,fin?186:157,pw*(fin?.63:.42),gt*.12);
  if(p>.33&&p<.86){const q=smooth((p-.33)/.48),bx=lerp(hx,748,q),by=lerp(hy,461,q);const size=(fin?125:104)+(fin?152:119)*smooth(q/.35),fade=1-smooth((p-.77)/.10);vfx('bolt',bx+size*.13,by,size,size*.67,fade,-.05)}
  if(p>.59&&p<.95){const im=smooth((p-.59)/.16)*(1-smooth((p-.87)/.10));vfx('burst',748,474,fin?480:380,fin?385:300,im*.98,-.07);if(fin){vfx('ultimate',748,451,550,464,im*.62,gt*.07);const hb=smooth((p-.80)/.08)*(1-smooth((p-.94)/.06));art('heart_burst',748,448,280+80*hb,224+64*hb,hb)}}// SP01 は魅了のハートがはじける（GPT の絵）
  hit=hitAt(p,.73,.22);break}
 case 'P08':{const pw=Math.sin(Math.PI*smooth(p));for(let i=0;i<5;i++){const x=180+i*35,y=440-Math.sin(p*TAU+i)*32;mglow(x,y,30,pw*.40,[112,252,206]);mstar(x,y,5,pw,'#c5ffe7')}
  if(p>.55&&p<.88){ctx.save();ctx.fillStyle=rgba(172,255,221,.76);ctx.font='bold 30px system-ui';ctx.fillText('+ 160',260,192-(p-.5)*85);ctx.restore()}break}
 case 'P09':{const pw=smooth(p/.19)*(1-smooth((p-.78)/.22));if(pw>.005){const pulse=1+Math.sin(gt*7)*.024;vfx('guard',470,342,190*pulse,300*pulse,pw*.94,Math.sin(gt*.8)*.018);mglow(275,340,166,pw*.18);for(let k=0;k<9;k++){const a=k*TAU/9+gt*.12;mstar(275+Math.cos(a)*145,341+Math.sin(a)*187,3.3,pw*.55,'#ffdcff')}}break}
 case 'P10':{const pw=Math.sin(Math.PI*smooth(p/.6))*(1-smooth((p-.60)/.36));for(let i=0;i<12;i++){const a=i*TAU/12;mstar(315+Math.cos(a)*100,318+Math.sin(a)*95,4.5,pw*.85,'#ffabb5')}break}
 case 'P11':{const pw=1-smooth((p-.2)/.6);for(let i=0;i<9;i++){const a=i*TAU/9;mglow(207+Math.cos(a)*80,552+Math.sin(a)*25,12,pw*.25)}break}
 case 'P12':{const pw=1-smooth((p-.17)/.72);castHand(hx,hy,pw*.55,t);for(let k=0;k<12;k++)mstar(hx+k*16,hy+Math.sin(k*1.2+t)*37,4,pw*.7);break}
 case 'P13':case 'P14':{const pw=.35+.65*smooth(p/.35);for(let k=0;k<7;k++){const x=340+Math.sin(gt*1.2+k*2)*105,y=300+(k*21)%155-((gt*17+k*33)%190);heart(x,y,7+k%3*2,pw*(.4+.4*Math.sin(gt*1.1+k)**2),Math.sin(gt+k)*.16,k)}
  if(id==='P14')for(let k=0;k<9;k++){const a=k*TAU/9+gt*.18;mstar(290+Math.cos(a)*180,350+Math.sin(a)*160,5,.7)}
  // まわりにただよう小さなハートの群れ（GPT の絵 heart_bits。なければ出さない）
  art('heart_bits',id==='P13'?478:505,(id==='P13'?245:300)+Math.sin(gt*1.3)*6,200,154,pw*(id==='P13'?.8:.6),Math.sin(gt*.7)*.06);break}
 case 'SP02':{const pw=smooth((p-.13)/.28)*(1-smooth((p-.85)/.15));vfx('ultimate',hx,hy,196,182,pw*.44,gt*.065);
  if(p>.34){const surge=smooth((p-.34)/.19)*(1-smooth((p-.89)/.11));vfx('ultimate',740,453,540+Math.sin(gt*2)*14,454+Math.sin(gt*2)*9,surge*.93,-gt*.045);vfx('burst',747,478,380,285,surge*.56);
   if(surge>.4)for(let k=0;k<8;k++){const a=k*TAU/8+gt*.65;heart(744+Math.cos(a)*142,446+Math.sin(a)*115,9,surge*.55,a,k)}}break}}
 // 着弾の光
 if(hit>.03){vfx('burst',748,476,260+hit*150,196+hit*115,hit*.77);sprite('impact',748,477,205+hit*110,138+hit*75,hit*.38)}
 if(['P07','SP01','P06','P14'].includes(id)){const a=id==='P14'?.29:.42*smooth(p/.26)*(1-smooth((p-.87)/.13));sprite('sparkles',id==='P14'?360:hx-25,id==='P14'?295:hy+12,290,106,a,0,'screen')}
 if(id==='P12')sprite('smoke',hx,hy+45,315,110,(1-smooth((p-.18)/.72))*.2)}

const CHAR={
 data:'./assets/characters/lilith/character.json',
 motions:LILITH_MOTIONS,actorParams,enemyState,effects,hp,
 background:lilithBackground,
 // 床の魔法陣（足元。前のページのとおり 281 の位置に固定）
 floor(m,t,p){const id=m.id;magicFloor(281,SPELL.includes(id)?smooth(p/.25)*.75:id==='P14'?.22:.08)}
};
