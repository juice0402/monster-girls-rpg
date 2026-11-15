# 敵の絵の一覧（2026-11-15 デザイン案 v2・しょーくんの OK で固定）

- 種類：**A・Codex**（ChatGPT Plus の中の Codex。リリスの画風の見本を編集して描いた）。作った日：2026-11-15
- Codex にした理由：全キャラの画風をリリスにそろえる決まり（docs/ART_REQUIREMENTS.md 0章）。Canva では見本の画風に合わせられないため
- v1（`art-requests/enemy/sheet1.md`・PR #15・ブランチ `art/enemy-sheet1`）：画風は合格、リリスのバラ・角・フリルがうつった
- v2（`art-requests/enemy/sheet2.md`・PR #19・ブランチ `art/enemy-sheet2` の `art-requests/enemy/out/enemy_sheet2.png`）：v1 からバラ・フリル・角を外した編集。小悪魔の角も消えた（羽・三つ又の槍・しっぽで小悪魔とわかる）
- 取りこみ：`tools/import_single.py split`（緑を抜く・1体ずつ切る）。Claude は描き足していない

| ファイル（表示用は `web/`） | 何 | 戦闘での幅 |
|---|---|---|
| `slime_v2.png` | ザコ：むらさきのスライム | 112px |
| `imp_v2.png` | ザコ：コウモリの羽の小悪魔（三つ又の槍） | 112px |
| `ghost_v2.png` | ザコ：ランタンを持つおばけ | 98px |
| `golem_v2.png` | ボス：むらさきに光る石のゴーレム | 236px |
