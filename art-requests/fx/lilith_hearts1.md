# リリス：まわりを舞うハート（エフェクト1）

状態：依頼中
依頼日：2026-11-14
保存先：ドライブ `monmusu-art` のいちばん上に `fx_lilith_hearts1.png`
背景：真っ黒 #000000（光るもの）

## ChatGPT へ
- 下の「画像への指示」を、そのまま（言いかえず・足さず）画像を作る AI に渡す
- 横長でできるだけ大きく（1536×1024）。4つはます目からはみ出さず、間をあける
- できた絵は、少しちがっても保存する（合否は Claude が決める）

## 画像への指示（このまま使う）

```
Draw four separate glowing magic heart effects in pink and violet on a pure black background, arranged in a 2x2 grid with wide spacing, in a polished anime fantasy game style: top-left a soft glossy glowing heart, top-right a faceted crystal heart with tiny sparkles, bottom-left a bright burst of light shaped like a heart, bottom-right a scatter of small glowing hearts and sparkles.
```

## 使い道（Claude のメモ）
- 待機・挑発・勝利でリリスのまわりを舞うハート（今はコードの単色のハート）、魅了の着弾、SP01 の大技の光
- 取りこみ：
```
python3 tools/import_fx.py lilith assets/characters/lilith/source/fx_lilith_hearts1.png heart_glow_1 heart_crystal_1 heart_burst_1 heart_bits_1 --grid 2x2 --bg black --request fx/lilith_hearts1.md
```

## Claude の確認（ここは Claude が書く）
- まだ
