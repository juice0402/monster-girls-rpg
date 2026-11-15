# 敵の絵の一覧（2026-11-15 デザイン案 v3・しょーくんの OK で固定）

- 種類：**A・Codex**（ChatGPT Plus の中の Codex。リリスの画風の見本を編集して描いた）。作った日：2026-11-15
- Codex にした理由：全キャラの画風をリリスにそろえる決まり（docs/ART_REQUIREMENTS.md 0章）。Canva では見本の画風に合わせられないため
- v1（`art-requests/enemy/sheet1.md`・PR #15・ブランチ `art/enemy-sheet1`）：画風は合格、リリスのバラ・角・フリルがうつった
- v2（`art-requests/enemy/sheet2.md`・PR #19・ブランチ `art/enemy-sheet2` の `art-requests/enemy/out/enemy_sheet2.png`）：v1 からバラ・フリル・角を外した編集。小悪魔の角も消えた（羽・三つ又の槍・しっぽで小悪魔とわかる）
- v3（`art-requests/enemy/sheet3.md`・PR #22・ブランチ `art/enemy-sheet3` の `art-requests/enemy/out/enemy_sheet3.png`）：しょーくん「もう少し可愛いのがいい」で v2 を編集。まるい形・大きな目・笑顔
- 闇落ちしたモン娘の案（`sheet4.md`）は、Codex の画像生成の安全のしくみで断られた（決まりどおり言いかえて出し直していない）
- ボス案 石の女王ゴーレム（`art-requests/enemy/boss1.md`・PR #27・ブランチ `art/enemy-boss1` の `art-requests/enemy/out/enemy_boss1.png`）：しょーくん「もう少しモンスター寄りの女の子の敵」→ 司令塔の判断で、ねらいを「怖くて強い怪物」に変えた別の案として1回だけ（体はぜんぶ岩・人らしいのは石の顔だけ・露出と色っぽさなし）。しょーくん OK（11/15）。試作のボスをこれに入れかえた（golem_v3 は残す）
- 取りこみ：`tools/import_single.py split`（緑を抜く・1体ずつ切る）。Claude は描き足していない

| ファイル（表示用は `web/`） | 何 | 戦闘での幅 |
|---|---|---|
| `slime_v3.png` | ザコ：むらさきのスライム | 112px |
| `imp_v3.png` | ザコ：コウモリの羽の小悪魔（三つ又の槍） | 112px |
| `ghost_v3.png` | ザコ：ランタンを持つおばけ | 98px |
| `golem_v3.png` | ボス：むらさきに光る石のゴーレム | 236px |
| `golemqueen_v1.png` | ボス：石の女王ゴーレム（岩の王冠・むらさきに光るひび） | 205px |
