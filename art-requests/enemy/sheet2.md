# 敵 デザイン案の直し（リリスの飾りを外す）

状態：済（Codex PR #19・合格・PR #18 に取りこみ・しょーくんの OK で固定）
依頼日：2026-11-15
元の絵（リポジトリ）：`art-requests/enemy/base/enemy_sheet1_src.png`（sheet1 の Codex の絵そのまま・2172×724・背景は緑）
保存先（リポジトリ）：`art-requests/enemy/out/enemy_sheet2.png`（背景は無地の緑 #00FF00）
ブランチ：`art/enemy-sheet2`
点検：4体とも、バラ・フリル・レースがなくなったか／スライム・おばけ・ゴーレムの頭の巻いた角がなくなったか（小悪魔の角は残る）／形・大きさ・位置・向き・色・画風が元の絵と同じか

## 描き方
- 元の絵 `enemy_sheet1_src.png` を編集する。新しく描かない
- 失敗したら同じ指示でやり直す（3回まで）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

```
Edit this image. Remove the roses, the ruffled frills and lace, and the curled horns from the slime, the ghost and the golem, and remove the rose and the ruffled frills from the imp, so that each monster shows only its own body. Keep everything else exactly the same.
```

## Claude のメモ
- sheet1 の直し（リリスの服の飾りがうつった所だけ）。合格したら、しょーくんに4体を見せて固定する
- 取りこみ：`python3 tools/import_single.py split <png> assets/enemies assets/enemies/web slime_v2 imp_v2 ghost_v2 golem_v2`

## Claude の確認（ここは Claude が書く）
- 2026-11-15 Codex（PR #19・2172×724・緑の背景・1回目）：合格。スライム・おばけ・ゴーレムのバラ・フリル・角がなくなり、小悪魔のバラとフリルもなくなった。形・大きさ・位置・向き・色・画風は元の絵と同じ
- ちがった所：小悪魔の角も消えた（羽・三つ又の槍・しっぽで小悪魔とわかるので、このままにした）
- 取りこみ：`assets/enemies/*_v2.png`（PR #18・試作の敵を v2 に入れかえ）
