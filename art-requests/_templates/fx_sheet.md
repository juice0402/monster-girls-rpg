# （ひな形）エフェクト・飾り・演出のパーツ（2×2 で4つ）

状態：保留（ひな形。Claude がコピーして art-requests/fx/<キャラ>_<名前>.md にする。ChatGPT は描かない）
依頼日：
保存先：ドライブ `monmusu-art` のいちばん上に `fx_<キャラ>_<名前>.png`
背景：真っ黒 #000000（光るもの）／本物の透明（物っぽいもの。だめなら無地の緑 #00FF00）

## ChatGPT へ
- 下の「画像への指示」を、そのまま（言いかえず・足さず）画像を作る AI に渡す
- 横長でできるだけ大きく（1536×1024）。4つはます目からはみ出さず、間をあける
- できた絵は、少しちがっても保存する（合否は Claude が決める）

## 画像への指示（このまま使う）

```
Draw four separate <何の> effects in <色> on a pure black background, arranged in a 2x2 grid with wide spacing, in a polished anime fantasy game style: top-left <1つ目>, top-right <2つ目>, bottom-left <3つ目>, bottom-right <4つ目>.
```

## 取りこみ（Claude）
```
python3 tools/import_fx.py <id> assets/characters/<id>/source/fx_<id>_<名前>.png <名前1>_1 <名前2>_1 <名前3>_1 <名前4>_1 --grid 2x2 --bg black --request fx/<id>_<名前>.md
```

## Claude の確認（ここは Claude が書く）
- まだ
