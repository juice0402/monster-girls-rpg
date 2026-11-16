#!/usr/bin/env node
// src/ と assets/ を1つの index.html にまとめる（Node の標準だけ）。地図は docs/MAP.md
//   node tools/build.mjs          … index.html を作る
//   node tools/build.mjs --check  … index.html が src とずれていたら 1 で終わる（CI 用）
//   node tools/build.mjs --stdout … 作った中身を出すだけ（index.html は書かない）
// しくみ：src/page.html の印の行を、中身に入れかえる
//   /*@CSS*/     → src/style.css
//   <!--@DATA--> → src/data/dialogue.json を window.__DLG にした <script>
//   //@JS        → JS の一覧（下の JS）を順につないだもの。全部が1つの (()=>{ … })() の中で同じ場所を共有する
//   ASSET('foo.png') → assets/foo.png を base64 の data: URL にした文字（絵・音はファイルで置き、ここで埋めこむ）
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {dirname,join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..');
// つなぐ順番（上の物を下の物が使う。順番を変えるときは、読みこみ時に動く const の順に気をつける）
const JS=[
  'src/data/rules.js',      // 数字（作物・道具・改築・1日の長さ・セーブのキー）
  'src/data/maps.js',       // 地図（マスの文字）・歩けないマス・行き先
  'src/dialogue.js',        // 台詞の読みこみ（読めないときの最小版）
  'src/data/chars.js',      // 人の絵の表（16×32・4方向・歩き）
  'src/art/people.js',      // 人の絵を作る（部分ごとの面の向き）
  'src/art/pixel.js',       // ドット絵の道具・面の向きの道具・草・道・木・さく・池
  'src/art/town.js',        // 街の絵（3枚組）：石だたみ・建物・噴水・街灯・小物
  'src/art/farm.js',        // 牧場の建物・土・作物・岩・花／地図ごとの土台
  'src/state.js',           // 状態・セーブ・動くもの・道さがし
  'src/npc.js',             // 住人の1日
  'src/player.js',          // プレイヤーの作業・タップ・建物を調べる
  'src/talk.js',            // 住人と話す・贈り物・同居・改築・1日のおわり
  'src/light/layers.js',    // 光の画質・3枚の絵の重ね描き
  'src/data/light.js',      // 時間ごとの光の数字（KEYS）
  'src/light/gl.js',        // WebGL の光と仕上げ・画質ボタン
  'src/light/particles.js', // 花びら・光のちり・ほたる・夜のあかりの一覧
  'src/render.js',          // 画面の大きさ・カメラ・毎コマの描き方
  'src/ui.js',              // 上と下の板・ふきだし・まど（店・出荷・かばん・地図・なかよし）
  'src/main.js',            // ループ・はじまり
];
const HEAD='<!-- 自動で作るファイル・手で直さない（src/ を直して node tools/build.mjs。地図は docs/MAP.md） -->\n';
const MIME={'.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml',
  '.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav','.m4a':'audio/mp4'};

const rd=p=>readFileSync(join(ROOT,p),'utf8');
function asset(p){
  const f=join(ROOT,'assets',p),m=MIME[extname(p).toLowerCase()];
  if(!existsSync(f))throw new Error(`assets/${p} がない`);
  if(!m)throw new Error(`assets/${p} の種類がわからない（${Object.keys(MIME).join(' ')}）`);
  return `data:${m};base64,${readFileSync(f).toString('base64')}`;
}
// 印の行をまるごと入れかえる（関数で渡すので、中身の $ はそのまま）
function swap(page,mark,text){
  const at=page.indexOf(mark+'\n');
  if(at<0||page.indexOf(mark+'\n',at+1)>=0)throw new Error(`src/page.html の印 ${mark} は1つだけ置く`);
  return page.slice(0,at)+text+page.slice(at+mark.length+1);
}
export function build(){
  let js=JS.map(rd).join('');
  js=js.replace(/ASSET\((['"])([^'"]+)\1\)/g,(_,q,p)=>JSON.stringify(asset(p)));
  const dlg=JSON.stringify(JSON.parse(rd('src/data/dialogue.json'))).replace(/</g,'\\u003c');
  let page=rd('src/page.html');
  page=swap(page,'/*@CSS*/',rd('src/style.css'));
  page=swap(page,'<!--@DATA-->',`<script>window.__DLG=${dlg};</script>\n`);
  page=swap(page,'//@JS',js);
  return HEAD+page;
}

const arg=process.argv[2]||'';
const out=build(),file=join(ROOT,'index.html');
if(arg==='--stdout')process.stdout.write(out);
else if(arg==='--check'){
  const now=existsSync(file)?readFileSync(file,'utf8'):'';
  if(now!==out){console.error('index.html が src とずれている。node tools/build.mjs を動かしてコミットしてね');process.exit(1);}
  console.log('index.html は src と同じ');
}else{writeFileSync(file,out);console.log(`index.html を作った（${(out.length/1024).toFixed(1)}KB・JS ${JS.length}ファイル）`);}
