# 敵の絵の一覧（2026-11-15 デザイン案 v1・まだ固定していない）

- 種類：**A・Codex**（ChatGPT Plus の中の Codex。リリスの画風の見本を編集して描いた）。作った日：2026-11-15
- Codex にした理由：全キャラの画風をリリスにそろえる決まり（docs/ART_REQUIREMENTS.md 0章）。Canva では見本の画風に合わせられないため
- もとの PNG：ブランチ `art/enemy-sheet1` の `art-requests/enemy/out/enemy_sheet1.png`（2172×724・緑の背景）。依頼書 `art-requests/enemy/sheet1.md`（PR #15）
- 取りこみ：`tools/import_single.py split`（緑を抜く・1体ずつ切る）。Claude は描き足していない
- **v1 は仮**：4体ともリリスのバラ・角・フリルがうつった（見本の服がまざるくせ）。試作の画面では仮に使い、`art-requests/enemy/sheet2.md` で外してから固定する

| ファイル（表示用は `web/`） | 何 | 戦闘での幅 |
|---|---|---|
| `slime_v1.png` | ザコ：むらさきのスライム | 112px |
| `imp_v1.png` | ザコ：コウモリの羽の小悪魔（三つ又の槍） | 112px |
| `ghost_v1.png` | ザコ：ランタンを持つおばけ | 98px |
| `golem_v1.png` | ボス：むらさきに光る石のゴーレム | 236px |
