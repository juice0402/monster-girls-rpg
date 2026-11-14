# ミュウ：ゲルのかたまり・はじけ・スライムだまり・しずく（エフェクト1）

状態：OK（2026-11-14 4つとも合格・取りこみ済み）
依頼日：2026-11-14
保存先：ドライブ `monmusu-art` のいちばん上に `fx_myu_gel1.png`
背景：本物の透明（物っぽいもの。透明にできないときは無地の緑 #00FF00）

## ChatGPT へ
- 下の「画像への指示」を、そのまま（言いかえず・足さず）画像を作る AI に渡す
- 横長でできるだけ大きく（1536×1024）。4つはます目からはみ出さず、間をあける
- できた絵は、少しちがっても保存する（合否は Claude が決める）

## 画像への指示（このまま使う）

```
Draw four separate glossy translucent slime effects in pale aqua blue with soft lavender edges on a fully transparent background, arranged in a 2x2 grid with wide spacing, in a polished anime fantasy game style: top-left a round jelly ball with bright highlights and tiny bubbles inside, top-right a sticky slime splat with short drips hanging down, bottom-left a flat irregular slime puddle seen from a low side angle, bottom-right a few glossy slime droplets of different sizes.
```

## 使い道（Claude のメモ）
- ゲル弾・必殺技の巨大ゲル弾（gel_ball）、敵にくっつくゲル（gel_splat）、足元のスライムだまり（gel_puddle）。ひも・しずくの動きはコードのまま
- 取りこみ（緑で届いたら --bg green）：
```
python3 tools/import_fx.py myu assets/characters/myu/source/fx_myu_gel1.png gel_ball_1 gel_splat_1 gel_puddle_1 gel_drops_1 --grid 2x2 --bg alpha --request fx/myu_gel1.md
```

## Claude の確認（ここは Claude が書く）
- 2026-11-14 21:42：背景は本物の透明（ドライブで見ると黒っぽいが、ふちの光だけ半透明）。4つとも合格
- 取りこみ後、P05 のゲル弾・P07 のはじけ・床のスライムだまりが GPT の絵になった（つやが増えた）
