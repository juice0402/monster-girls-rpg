# 敵 デザイン案（もう少しかわいく）

状態：済（Codex PR #22・合格・PR #18 に取りこみ）
依頼日：2026-11-15
元の絵（リポジトリ）：`art-requests/enemy/base/enemy_sheet2_src.png`（sheet2 の Codex の絵そのまま・2172×724・背景は緑）
保存先（リポジトリ）：`art-requests/enemy/out/enemy_sheet3.png`（背景は無地の緑 #00FF00）
ブランチ：`art/enemy-sheet3`
点検：4体とも、まるくてやわらかい形・大きなつやのある目になったか／色・大きさ・位置・向き・画風が元の絵と同じか／4体目のゴーレムがいちばん大きいままか／スライム・小悪魔・おばけ・ゴーレムだとわかるか

## 描き方
- 元の絵 `enemy_sheet2_src.png` を編集する。新しく描かない
- 失敗したら同じ指示でやり直す（3回まで）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

```
Edit this image. Make all four monsters cuter, with rounder and softer shapes, bigger shiny eyes, small fangs and claws, and cheerful mischievous expressions, keeping their colors, sizes, positions, facing directions and art style. Keep everything else exactly the same.
```

## Claude のメモ
- しょーくん（11/15）：「敵はもう少し可愛いのがいいな」。sheet2 の形は気にいられていない所がないので、かわいさだけを足す
- 取りこみ：`python3 tools/import_single.py split <png> assets/enemies assets/enemies/web slime_v3 imp_v3 ghost_v3 golem_v3`

## Claude の確認（ここは Claude が書く）
- 2026-11-15 Codex（PR #22・2172×724・緑の背景・1回目）：合格。4体ともまるい形・大きなつやのある目・笑顔になり、色・大きさ・位置・向き・画風は同じ（保留にする前に描きはじめていた）
- 取りこみ：`assets/enemies/*_v3.png`（PR #18・試作の敵を v3 に入れかえ）
