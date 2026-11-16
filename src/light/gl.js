function paramsAt(h){if(h<4.5)h+=24;let i=0;while(i<KEYS.length-2&&KEYS[i+1].h<=h)i++;const a=KEYS[i],b=KEYS[i+1],f=Math.max(0,Math.min(1,(h-a.h)/(b.h-a.h)));
  const o={};for(const k in a){if(k==='h')continue;const va=a[k],vb=b[k];o[k]=Array.isArray(va)?va.map((v,j)=>v+(vb[j]-v)*f):va+(vb-va)*f;}
  const l=Math.hypot(o.sun[0],o.sun[1],o.sun[2]);o.sun=o.sun.map(v=>v/l);
  o.shK=[Math.max(-3,Math.min(3,-o.sun[0]/Math.max(.12,o.sun[2]))),Math.max(-1,Math.min(1,-o.sun[1]/Math.max(.12,o.sun[2])))];
  return o;}

const GHEAD='#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 vUv;';
const GVS='attribute vec2 aPos;varying vec2 vUv;void main(){vUv=aPos*.5+.5;gl_Position=vec4(aPos,0.,1.);}';
const GFS_COPY=GHEAD+'uniform sampler2D uTex;void main(){gl_FragColor=texture2D(uTex,vUv);}';
const GFS_BLUR=GHEAD+'uniform sampler2D uTex;uniform vec2 uDir;void main(){vec4 c=texture2D(uTex,vUv)*.227027;c+=texture2D(uTex,vUv+uDir*1.3846)*.316216;c+=texture2D(uTex,vUv-uDir*1.3846)*.316216;c+=texture2D(uTex,vUv+uDir*3.2308)*.07027;c+=texture2D(uTex,vUv-uDir*3.2308)*.07027;gl_FragColor=c;}';
const GFS_BRIGHT=GHEAD+'uniform sampler2D uLit,uEmis;uniform float uThr;void main(){vec3 s=texture2D(uLit,vUv).rgb;float l=dot(s,vec3(.299,.587,.114));vec4 e=texture2D(uEmis,vUv);gl_FragColor=vec4(s*smoothstep(uThr,1.,l)*.5+e.rgb*e.a,1.);}';
/* 光の計算：1ドットごとの面の向き×日の向き、空の光、照り返し、ランプ、水のつや */
const GFS_LIT=GHEAD+`
uniform sampler2D uAlb,uNrm,uDat,uShd,uEmis;uniform vec2 uRes;uniform float uShA,uQ;
uniform vec3 uSun,uSunCol,uSky,uBounce;uniform vec4 uL[12];uniform vec4 uLc[12];
float b2(vec2 a){a=floor(a);return fract(dot(a,vec2(.5,a.y*.75)));}
float b4(vec2 a){return b2(.5*a)*.25+b2(a);}
void main(){
  vec2 sv=vec2(vUv.x,1.-vUv.y);vec3 alb=texture2D(uAlb,vUv).rgb;
  vec3 n=normalize(texture2D(uNrm,vUv).rgb*2.-1.);vec4 d=texture2D(uDat,vUv);float z=d.r*85.,ao=d.g,spec=d.b;
  float sh=texture2D(uShd,vUv).a*uShA;
  vec2 ap=floor(sv*uRes);vec3 wp=vec3(ap.x+.5,ap.y+.5+z,z);
  float ndl=max(dot(n,uSun),0.);ndl=floor(ndl*uQ+b4(ap))/uQ;
  vec3 lit=uSunCol*ndl*(1.-sh);
  lit+=(uSky*(.55+.45*n.z)+uBounce*(.6-.4*n.z))*ao;
  vec3 V=vec3(0.,.7071,.7071),sp=vec3(0.);
  if(spec>.01){vec3 H=normalize(uSun+V);sp+=uSunCol*pow(max(dot(n,H),0.),48.)*spec*2.2*(1.-sh);}
  for(int i=0;i<12;i++){if(uL[i].w<1.)continue;vec3 L=uL[i].xyz-wp;float dist=length(L);float f=clamp(1.-dist/uL[i].w,0.,1.);f*=f;vec3 l=L/max(dist,.001);
    lit+=uLc[i].rgb*uLc[i].a*f*(max(dot(n,l),0.)*.85+.15);
    if(spec>.01){vec3 H=normalize(l+V);sp+=uLc[i].rgb*uLc[i].a*f*pow(max(dot(n,H),0.),32.)*spec*1.6;}}
  vec3 col=alb*lit+sp;
  vec4 e=texture2D(uEmis,vUv);col=mix(col,e.rgb*1.15,e.a);
  gl_FragColor=vec4(col,1.);
}`;
/* 仕上げ：奥と手前のぼかし・光の筋・霧・にじむ光・色の調子・画面のはしの暗さ */
const GFS_FINAL=GHEAD+`
uniform sampler2D uLit,uBlur,uBloomA,uBloomB;uniform vec2 uRes,uCam;uniform float uTime,uMapH;
uniform float uFocus,uDof,uBloom,uRay,uFog,uSat,uCon,uVig;uniform vec3 uRayCol,uFogCol,uLift,uGain;uniform vec2 uRayDir,uRayOrg;
float h21(vec2 p){p=fract(p*vec2(.1234,.4562));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){return vn(p)*.55+vn(p*2.03+7.1)*.3+vn(p*4.1+3.3)*.15;}
float n1(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(h21(vec2(i,1.7)),h21(vec2(i+1.,1.7)),f);}
void main(){
  vec2 sv=vec2(vUv.x,1.-vUv.y);vec3 col=texture2D(uLit,vUv).rgb;
  float dk=smoothstep(.24,.56,abs(sv.y-uFocus))*uDof;col=mix(col,texture2D(uBlur,vUv).rgb,dk);
  vec2 wp=sv*uRes+uCam;
  vec2 q=wp/uRes.y-uRayOrg;float al=dot(q,uRayDir),ac=dot(q,vec2(-uRayDir.y,uRayDir.x));
  float r=smoothstep(.45,.95,n1(ac*14.+uTime*.12))*.8+smoothstep(.55,.98,n1(ac*31.-uTime*.09+11.))*.5;
  r*=smoothstep(1.4,.05,al)*smoothstep(-.02,.15,al);col+=uRayCol*r*uRay*.26;
  float fg=fbm(wp*.018+vec2(uTime*.012,uTime*.005));col=mix(col,uFogCol,clamp(uFog*(.25+.65*fg)*(.45+.55*clamp(1.-wp.y/uMapH,0.,1.))*.62,0.,1.));
  col+=(texture2D(uBloomA,vUv).rgb*.9+texture2D(uBloomB,vUv).rgb*1.3)*uBloom;
  col=(col-.5)*uCon+.5;float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,uSat);col=col*uGain+uLift*(1.-col);
  vec2 vv=sv-.5;vv.x*=uRes.x/uRes.y;col*=1.-uVig*smoothstep(.25,.75,length(vv));
  col+=(h21(floor(gl_FragCoord.xy)+fract(uTime)*91.)-.5)*.012;
  gl_FragColor=vec4(clamp(col,0.,1.),1.);
}`;
let gl=null,G=null;
function initGL(){
  try{gl=glc.getContext('webgl',{premultipliedAlpha:false,antialias:false,alpha:false,depth:false,stencil:false,powerPreference:'low-power'});}catch(e){gl=null;}
  if(!gl)return false;
  try{
    const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o;};
    const vs=sh(gl.VERTEX_SHADER,GVS);
    const prog=fs=>{const p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.bindAttribLocation(p,0,'aPos');gl.linkProgram(p);
      if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));const u={},n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);
      for(let i=0;i<n;i++){const inf=gl.getActiveUniform(p,i);u[inf.name.replace(/\[0\]$/,'')]=gl.getUniformLocation(p,inf.name);}return{p,u};};
    const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    const tex=f=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,f);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,f);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;};
    const fbo=(w,h,f)=>{const t=tex(f||gl.LINEAR);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);gl.bindFramebuffer(gl.FRAMEBUFFER,null);return{t,f:fb,w,h};};
    G={fbo,tex,copy:prog(GFS_COPY),blur:prog(GFS_BLUR),bright:prog(GFS_BRIGHT),lit:prog(GFS_LIT),fin:prog(GFS_FINAL),
      alb:tex(gl.NEAREST),nrm:tex(gl.NEAREST),dat:tex(gl.NEAREST),shd:tex(gl.NEAREST),em:tex(gl.NEAREST),
      L:null,lp:new Float32Array(48),lc:new Float32Array(48)};
    glc.addEventListener('webglcontextlost',e=>{e.preventDefault();G=null;LIT.ok=false;applyLight();});
    return true;
  }catch(err){console.error(err);G=null;return false;}
}
// 毎コマの絵を GPU へ送る。大きさが同じあいだは、作り直さず中身だけ入れかえる（texSubImage2D のほうが軽い）
function upT(t,src){gl.bindTexture(gl.TEXTURE_2D,t);
  if(t._w===src.width&&t._h===src.height)gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,gl.RGBA,gl.UNSIGNED_BYTE,src);
  else{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,src);t._w=src.width;t._h=src.height;}}
function gpass(P,target,bind){gl.bindFramebuffer(gl.FRAMEBUFFER,target?target.f:null);gl.viewport(0,0,target?target.w:glc.width,target?target.h:glc.height);gl.useProgram(P.p);bind(P.u);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
function gbt(unit,t,loc){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.uniform1i(loc,unit);}
function gblur(a,b,step){gpass(G.blur,b,u=>{gbt(0,a.t,u.uTex);gl.uniform2f(u.uDir,step/a.w,0);});gpass(G.blur,a,u=>{gbt(0,b.t,u.uTex);gl.uniform2f(u.uDir,0,step/a.h);});}
function renderGL(P,lights,t,cx,cy,focus){
  const w=view.w,h=view.h;
  if(!G.L||G.L.w!==w||G.L.h!==h){const hw=Math.max(1,w>>1),hh=Math.max(1,h>>1),qw=Math.max(1,w>>2),qh=Math.max(1,h>>2);
    G.L=G.fbo(w,h,gl.NEAREST);G.A=G.fbo(hw,hh);G.B=G.fbo(hw,hh);G.C=G.fbo(hw,hh);G.D=G.fbo(hw,hh);G.E=G.fbo(qw,qh);G.F=G.fbo(qw,qh);}
  upT(G.alb,cv);upT(G.nrm,LN.c);upT(G.dat,LD.c);upT(G.shd,LS.c);upT(G.em,LE.c);
  G.lp.fill(0);G.lc.fill(0);lights.slice(0,12).forEach((l,i)=>{G.lp.set([l[0],l[1],l[2],l[3]],i*4);G.lc.set([l[4],l[5],l[6],l[7]],i*4);});
  gpass(G.lit,G.L,u=>{gbt(0,G.alb,u.uAlb);gbt(1,G.nrm,u.uNrm);gbt(2,G.dat,u.uDat);gbt(3,G.shd,u.uShd);gbt(4,G.em,u.uEmis);
    gl.uniform2f(u.uRes,w,h);gl.uniform1f(u.uShA,P.shA);gl.uniform1f(u.uQ,20);
    gl.uniform3fv(u.uSun,P.sun);gl.uniform3fv(u.uSunCol,P.sunCol);gl.uniform3fv(u.uSky,P.sky);gl.uniform3fv(u.uBounce,P.bounce);
    gl.uniform4fv(u.uL,G.lp);gl.uniform4fv(u.uLc,G.lc);});
  gpass(G.copy,G.A,u=>gbt(0,G.L.t,u.uTex));gblur(G.A,G.B,1);gblur(G.A,G.B,2);
  gpass(G.bright,G.C,u=>{gbt(0,G.L.t,u.uLit);gbt(1,G.em,u.uEmis);gl.uniform1f(u.uThr,.8);});
  gblur(G.C,G.D,1);gpass(G.copy,G.E,u=>gbt(0,G.C.t,u.uTex));gblur(G.E,G.F,1);gblur(G.E,G.F,2);
  const dx=Math.max(-1,Math.min(1,P.shK[0]/1.5)),rd=[dx*.62,.8],rl=Math.hypot(rd[0],rd[1]);
  gpass(G.fin,null,u=>{gbt(0,G.L.t,u.uLit);gbt(1,G.A.t,u.uBlur);gbt(2,G.C.t,u.uBloomA);gbt(3,G.E.t,u.uBloomB);
    gl.uniform2f(u.uRes,w,h);gl.uniform2f(u.uCam,cx,cy);gl.uniform1f(u.uTime,t%1000);gl.uniform1f(u.uMapH,MH*TS);
    gl.uniform1f(u.uFocus,focus);gl.uniform1f(u.uDof,LIT.q>1?.5:0);gl.uniform1f(u.uBloom,P.bloom);gl.uniform1f(u.uRay,P.ray);gl.uniform1f(u.uFog,P.fog);
    gl.uniform1f(u.uSat,P.sat);gl.uniform1f(u.uCon,P.con);gl.uniform1f(u.uVig,P.vig);
    gl.uniform3fv(u.uRayCol,P.rayCol);gl.uniform3fv(u.uFogCol,P.fogCol);gl.uniform3fv(u.uLift,P.lift);gl.uniform3fv(u.uGain,P.gain);
    gl.uniform2f(u.uRayDir,rd[0]/rl,rd[1]/rl);gl.uniform2f(u.uRayOrg,dx>=0?-.05:MW*TS/h+.05,-.05);});
}
// 画質：3＝高（画面のこまかさまで）・2＝中・1＝低（ドットの大きさのまま）・0＝なし
const LQ_NAME=['なし','低','中','高'];
function applyLight(){
  const on=LIT.ok&&LIT.q>0&&!!G;
  glc.hidden=pfx.hidden=!on;cv.style.opacity=on?'0':'1';
  const b=$('#lightBtn');if(b){b.textContent='光 '+LQ_NAME[on?LIT.q:0];b.hidden=!LIT.ok;}
  if(!on)return;
  const dpr=Math.min(window.devicePixelRatio||1,2),k=LIT.q===3?view.sc*dpr:LIT.q===2?view.sc:1;
  glc.width=Math.round(view.w*k);glc.height=Math.round(view.h*k);
  const kp=Math.min(k,view.sc);pfx.width=Math.round(view.w*kp);pfx.height=Math.round(view.h*kp);LIT.pk=kp;
  for(const c of[glc,pfx]){c.style.width=view.w*view.sc+'px';c.style.height=view.h*view.sc+'px';}
}
function resizeLayers(){for(const L of[LN,LD,LS,LE]){L.c.width=view.w;L.c.height=view.h;L.g.imageSmoothingEnabled=false;}applyLight();}
// 重いときは1段かるくする（自分でえらんだときはそのまま）
function watchSpeed(raw){if(!LIT.act||!LIT.auto||LIT.q<=1||!started)return;if(raw>.2)return;
  LIT.dts.push(raw);if(LIT.dts.length<150)return;const avg=LIT.dts.reduce((a,b)=>a+b,0)/LIT.dts.length;LIT.dts.length=0;
  LIT.slow=avg>.028?(LIT.slow||0)+1:0;if(LIT.slow>=2){LIT.q--;LIT.auto=false;applyLight();toast('光をすこし軽くしたよ（上の「光」で変えられる）');}}

