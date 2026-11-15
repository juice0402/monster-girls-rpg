# 敵 デザイン案（ザコ3・ボス1）

状態：済（Codex PR #15・画風は合格・デザインは直す → sheet2）
依頼日：2026-11-15
元の絵（リポジトリ）：`assets/characters/lilith/master/lilith_style_master_green.png`（画風の見本。この絵の線・塗り・明暗・つやだけを使う）
保存先（リポジトリ）：`art-requests/enemy/out/enemy_sheet1.png`（背景は無地の緑 #00FF00）
ブランチ：`art/enemy-sheet1`
点検：4体とも左を向いているか／画風（線の細さと濃さ・明暗・つや）が元の絵と同じか／4体の形（シルエット）がちがうか／4体目がいちばん大きいか／4体とも足（下のはし）が同じ床の線か

## 描き方
- 元の絵を編集する（画風を元の絵から取る）
- 失敗したら同じ指示でやり直す（3回まで）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

```
Edit this image. Replace the four characters with four fantasy monsters facing to the left, drawn in exactly the same art style, line work, shading and lighting, each standing on the same floor line: 1st a round purple slime with big glossy eyes, 2nd a small bat-winged imp holding a tiny trident, 3rd a floating ghost holding a lantern, 4th a large stone golem with glowing purple cracks that is taller than the others.
```

## Claude のメモ
- デザイン探し（要件定義 2章）。しょーくんが選んだら固定して、ステージごとに色ちがい・ポーズを足す
- 戦闘では右に並んで左（味方）を向く。動きはコード（ゆれる・つぶれる・光る）なので1体1枚でまず足りる
- 1〜3がザコ、4がボス

## Claude の確認（ここは Claude が書く）
- 2026-11-15 Codex（PR #15・2172×724・緑の背景・1回目）：画風（線・明暗・つや）はリリスと同じで合格。4体の形もちがい、ゴーレムがいちばん大きい。左を向いているのは小悪魔とおばけ（スライムとゴーレムは正面）
- だめな所：4体ともリリスのバラ・角・フリル・金の飾りがうつった（見本の服がまざるくせ・要件定義 2章）→ `sheet2.md` で外す
- 仮に `assets/enemies/*_v1.png` として取りこみ（PR #18・試作の画面で使用）
