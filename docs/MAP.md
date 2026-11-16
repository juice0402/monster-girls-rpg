# 地図（monster-girls-rpg・モン娘×牧場スローライフ）

コードを直す前に、ここで場所を決めてから、検索 → その範囲だけ読む → 変わる所だけ直す（プロジェクトの claude/code-rules.md）。

## ビルド（index.html は自動で作る・手で直さない）
- `node tools/build.mjs` … src/ と assets/ をつないで index.html（1ファイル）を作る。Node の標準だけ
- `node tools/build.mjs --check` … index.html が src とずれていたら落ちる（CI の .github/workflows/check.yml）
- しくみ：src/page.html の印の行を入れかえる。`/*@CSS*/`→src/style.css、`<!--@DATA-->`→台詞（window.__DLG）、`//@JS`→JS の一覧を順につないだもの
- JS は全部が1つの `(()=>{ … })()` の中で同じ場所を共有する（import はない）。つなぐ順番は tools/build.mjs の `JS`。読みこみ時に動く const は、使う物より前のファイルに置く
- 絵・音：assets/ にファイルで置き、コードには `ASSET('名前.png')` と書く → ビルドで data: URL に。コードに base64 を書かない
- index.html は出口なのでコミットする（GitHub Pages・試すページ・あとで App Store）。セーブのキーは `monmusu-farm-proto1`（src/data/rules.js）

## ファイルの役目（行数は 11/16 の目安）
| ファイル | 行 | 役目・おもな名前 |
|---|---|---|
| src/page.html | 67 | 画面の形（上の板・地図・下の板・ふきだし・まど・タイトル）と印の行 |
| src/style.css | 117 | 見た目（地図に重ねる上の文字と下の道具の列・紙のふきだし・DotGothic16） |
| src/data/rules.js | 21 | 数字：CROPS（作物）・RENO（改築）・HEART・COST（体力）・TOOLS・1日の長さ・SAVE_KEY |
| src/data/maps.js | 68 | MAPS（牧場・街のマスの文字）・BLOCK（歩けない文字）・tile・blocked・SPOTS（地図の行き先） |
| src/dialogue.js | 13 | DLG の最小版と loadDLG（台詞は src/data/dialogue.json） |
| src/data/chars.js | 60 | CHARS：人の絵の表（16×32・前／後ろ／横・足3コマ・pal＝[色, 部分, つや]）・着せかえの部品 items（帽子など）と wear（いま身につけている物） |
| src/art/people.js | 40 | charFrame（絵の枠は24×36＝体16×32のまわりに横4・上4のゆとり。身につけた物を重ねてから、部分ごとの面の向き）・makeSprites（着せかえたらもう一度）・SPR。描く所は sp.ox・sp.oy だけずらす |
| src/art/pixel.js | 138 | ドット絵の道具（mk・grid）・面の向きの道具（NBuf・nput・nrect・bumpLum・nHouse）・草・道・木・さく・池 |
| src/art/town.js | 248 | 街の3枚組：Surf3・stamp3・PS（色の段）・makeBld（家）・街灯・ベンチ・金床・材木・たる・袋・噴水（makeFountain・fountainWater）・石だたみ（drawTownGround）・置き場所（drawTownThings） |
| src/art/farm.js | 186 | 牧場の家の部品（roof・wall・door・win・shipBox）・土・作物・岩・花・道具の絵・drawBuildings・renderBase（地図ごとの土台＝色・面の向き・高さ/かげ/つや・影の形） |
| src/state.js | 61 | newState・fixRocks・save/loadSave・addPts・P（自分）・RT（住人）・Q（予約）・moveAlong・bfs |
| src/npc.js | 68 | schedule（住人の1日）・updNpc・DBGN（試す用に人を立たせる） |
| src/player.js | 106 | canAct・queueField・updPlayer・doField・BLD・STAND・onTap・interact |
| src/talk.js | 110 | openNpc・talk・gift・invite・runVisits（同居の朝）・renovate・sleep（1日のおわり） |
| src/light/layers.js | 34 | LIT（光の画質）・5枚の絵（LN・LD・LS・LE）・BASE3・sprN・blit3 |
| src/data/light.js | 11 | KEYS：時間ごとの光（日の向き・色・空・霧・ランプ・窓・色の調子） |
| src/light/gl.js | 123 | paramsAt・シェーダー（GFS_LIT＝1ドットずつの光、GFS_FINAL＝ぼかし・光の筋・霧・にじむ光）・initGL・renderGL・applyLight（光ボタン）・watchSpeed（重いとき1段かるく） |
| src/light/particles.js | 42 | 花びら・光のちり・ほたる（drawLP）・LAMPS・lightsFor（夜のあかりの一覧） |
| src/render.js | 123 | resize・カメラ（clampCam・setFree）・粒・toast・render（毎コマ：土台→畑→人→影→光） |
| src/ui.js | 130 | updHud・ふきだし（say・scene・choose）・まど（openShop・openShip・openBag・openMap・openFriends）・warp・dayCard・seasonEnd |
| src/main.js | 65 | update・loop・initRT・begin・boot・`window.__game`（試す用の debug） |

## データ・数字の場所
- 作物・改築・体力・1日の長さ → src/data/rules.js
- 地図のマス（新しい物を置くときは文字を足して BLOCK・BLD・描く所も） → src/data/maps.js
- 台詞・住人の好み・掛け合い → src/data/dialogue.json
- 人の見た目 → src/data/chars.js（色と部分は pal、形は rows と legs）。体は何も身につけない形で描き、帽子や服は items に重ねる部品で（着せかえできる）
- 時間ごとの光 → src/data/light.js
- 街の建物の形・色 → src/art/town.js の drawTownThings（makeBld に渡す数字）と PS

## 試す
- `window.__game.debug({time:分, map:'farm'|'town', cam:[x,y], light:0〜3, pos:[x,y], npc:{id:[map,x,y,向き]}})`・`__game.fps()`
- 確かめはビルド → スクショ（牧場と街・朝昼夕夜）。読み直して確かめない

## ほか
- art-samples/hikari.html … 光の見本（1ファイル・ゲームとは別）
- tools/hat3d.py … 麦わら帽子を立体から向きごとのドットにする道具。ふくらみは頭に沿う形（頭と同じ中心）、つばは外へいくほどたれ、帽子は少しうしろに傾く（前から見るとつばが顔をかこむアーチ）。人と同じ真正面から見る。前と横で目が見える高さにつばを計算。横向き（_side）は、体の絵の頭が前へ少し傾いて描かれているのに合わせて計算するので、横から見ると帽子はほぼ水平・つばは前とうしろでたれる弓なり。新しい帽子もこれで作る
- tools/greenkey.py・tools/import_single.py … Codex の絵の緑を抜く道具
- art-requests/ … Codex への絵の依頼書（AGENTS.md の決まり）
- index.html … 自動で作るファイル。読まない・手で直さない
