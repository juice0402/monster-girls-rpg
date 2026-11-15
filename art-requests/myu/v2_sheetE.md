# ミュウ v2 16ポーズ 5枚目（P04・SP02・P10・P06）

状態：済（断られた：step3 P10 が画像生成の安全のしくみ〔sexual〕で断られ、全部描かれなかった。言いかえて出し直さない）
依頼日：2026-11-15
元の絵（リポジトリ）：`art-requests/myu/base/myu_v2_master_green.png`（ミュウの正式な画風の見本 v2・2172×724・左から P01・P02・P05・P09・背景は緑）
保存先（リポジトリ）：`art-requests/myu/out/myu_v2_sheetE.png`（背景は無地の緑 #00FF00）
ブランチ：`art/myu-v2-sheetE`
点検：顔（目の形と色）・青い長い髪・ティアラ・とがった耳・紫の服・すける袖・金の飾り・ヒールが元の絵と同じか／変えた人だけポーズが変わり、ほかの人はそのままか／手のひらが見えて、まわりに空間があるか

## 描き方
- **どの指示も、元の絵 `myu_v2_master_green.png` から編集する（前の結果は使わない）**。1回の編集で1人だけ変える
- 各段の絵を `myu_v2_sheetE_step<番号>.png` で残す。保存先の `myu_v2_sheetE.png` は step4 と同じ絵でよい
- 失敗した段だけ、その段をやり直す（各段3回まで）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

1.
```
Edit this image. Change only the pose of the 1st character: pull her right arm far back behind her with the palm facing up and the fingers curled as if holding a small ball, stretch her left hand forward for balance, and give her a mischievous grin, with empty space above her right palm. Keep everything else exactly the same.
```
2.
```
Edit this image. Change only the pose of the 4th character: hold both hands forward to the right with the fingertips pointing right and the fingers spread wide and wiggling, with a mischievous smile, with empty space in front of her fingertips. Keep everything else exactly the same.
```
3.
```
Edit this image. Change only the pose of the 1st character: shrinking down with her shoulders hunched and her arms pulled in, puffing out her cheeks in a pout. Keep everything else exactly the same.
```
4.
```
Edit this image. Change only the pose of the 4th character: bend her knees slightly and hold both hands in front of her chest with the palms facing each other as if holding an invisible ball between them, a gap of two fists between the palms, with an excited, sparkling-eyed smile. Keep everything else exactly the same.
```

## Claude のメモ
- 段と中身：step1 P04 攻撃予備（1人目）・step2 SP02 ゲルの帯（4人目）・step3 P10 被ダメージ（1人目）・step4 P06 チャージ（4人目）
- v2_sheetA と v2_sheetD は、どちらも1つの段が断られて全部描かれなかったので、断られていない段だけを集めた
- 指示の英文は、断られていない段（v2_sheetA・v2_sheetD）のものを1文字も変えずに使う。断られた段（A の step3 SP01・D の step2 P03）は入れない（言いかえて出し直さない）
- 届いたら、各段から変えた1人だけを取り、色を見本 v2 に合わせる（`tools/import_codex.py`）

## Claude の確認（ここは Claude が書く）
- 2026-11-15 Codex：step3（P10 被ダメージ・v2_sheetD の step1 と同じ英文）が安全のしくみ（sexual）で断られ、全部描かなかった（PR なし）。同じ英文が前は通ったので、断られ方はゆらぐ。11/15 の断りはこれで4回目（敵 sheet4・v2_sheetA・v2_sheetD・v2_sheetE）→ ミュウの Codex の依頼はいったん止めて、しょーくんと司令塔に相談（v2_sheetF・G は準備中のまま）
