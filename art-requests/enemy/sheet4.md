# 敵 デザイン案（闇落ちしたモン娘）

状態：済（断られた：Codex の画像生成の安全のしくみ〔sexual〕。決まりどおり言いかえて出し直さない）
依頼日：2026-11-15
元の絵（リポジトリ）：`art-requests/enemy/base/enemy_sheet2_src.png`（sheet2 の Codex の絵・2172×724・背景は緑。画風と並び方を使う）
保存先（リポジトリ）：`art-requests/enemy/out/enemy_sheet4.png`（背景は無地の緑 #00FF00）
ブランチ：`art/enemy-sheet4`
点検：4人とも大人の女の子で、左を向いているか／人より怪物に近い姿か（キノコのかさ・クモの下半身・ぼろぼろの布とランタン・石の腕と脚）／目がむらさきに光り、するどい爪があるか／4人目のゴーレム娘がいちばん大きいか／画風が元の絵と同じか／ミュウ（スライム）やリリス（コウモリの羽・ハートのしっぽ）に似ていないか／露出は水着まで

## 描き方
- 元の絵を編集する（画風と並び方を元の絵から取る）
- 失敗したら同じ指示でやり直す（3回まで）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

```
Edit this image. Replace the four monsters with four adult monster girls corrupted by dark magic, facing to the left and more monster than human, drawn in exactly the same art style, line work and shading, each in the same position: 1st a mushroom girl with a big dark purple spotted mushroom cap and pale fungal skin, 2nd a spider girl whose lower body is a large black spider, 3rd a ghost girl in a tattered flowing sheet who holds the same lantern, 4th a golem girl with huge cracked stone arms and legs with glowing purple cracks who is taller than the others; all with glowing purple eyes and sharp claws.
```

## Claude のメモ
- しょーくん（11/15）：「敵も女の子風に」「少し闇落ちしたり、よりモンスター寄りな女の子に」
- 味方とかぶらない種類にした（スライム娘はミュウ、小悪魔娘はリリスに似るため）。1〜3がザコ、4がボス
- デザイン探し（要件定義 2章）。しょーくんが選んだら固定。あとで「浄化して仲間に（★3）」にもできる
- 取りこみ：`python3 tools/import_single.py split <png> assets/enemies assets/enemies/web mushroom_v1 spider_v1 ghostgirl_v1 golemgirl_v1`

## Claude の確認（ここは Claude が書く）
- 2026-11-15 Codex：画像生成が安全のしくみ（sexual）で断られ、描かなかった（PR なし）。game-art-rule と AGENTS.md の決まりで、言いかえて出し直さない。敵の女の子の案をどうするかは、しょーくんと司令塔で決める
