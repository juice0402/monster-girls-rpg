# ミュウ v2 16ポーズ 3枚目（P01・P02・P05・P09 を演技表どおりに）

状態：済（Codex PR #25。4つとも合格）
依頼日：2026-11-15
元の絵（リポジトリ）：`art-requests/myu/base/myu_v2_master_green.png`（ミュウの正式な画風の見本 v2・2172×724・左から P01・P02・P05・P09・背景は緑）
保存先（リポジトリ）：`art-requests/myu/out/myu_v2_sheetC.png`（背景は無地の緑 #00FF00）
ブランチ：`art/myu-v2-sheetC`
点検：4人とも、顔（目の形と色）・青い長い髪・ティアラ・とがった耳・紫の服・すける袖・金の飾り・ヒールが元の絵と同じか／変えた人だけポーズが変わり、ほかの人はそのままか／手のひらが見えて、まわりに空間があるか

## 描き方
- **どの指示も、元の絵 `myu_v2_master_green.png` から編集する（前の結果は使わない）**。1回の編集で1人だけ変える
- 各段の絵を `myu_v2_sheetC_step<番号>.png` で残す。保存先の `myu_v2_sheetC.png` は step4 と同じ絵でよい
- 失敗した段だけ、その段をやり直す（各段3回まで）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

1.
```
Edit this image. Change only the pose of the 1st character: rising slightly onto her toes with her body leaning to the left, touching her chin with her right index finger and tilting her head, her left hand at her side with the palm visible, smiling happily. Keep everything else exactly the same.
```
2.
```
Edit this image. Change only the pose of the 2nd character: skipping, with her right leg forward and the knee raised, her left heel lifted off the ground, and both arms swinging lightly. Keep everything else exactly the same.
```
3.
```
Edit this image. Change only the pose of the 3rd character: twisting her body and swinging her right arm forward to the right as if she has just thrown a ball, the palm facing right with the fingers spread, winking one eye, with empty space in front of her hand. Keep everything else exactly the same.
```
4.
```
Edit this image. Change only the pose of the 4th character: curling her body up and crossing both arms in front of her face, squeezing her eyes shut, with empty space in front of her arms. Keep everything else exactly the same.
```

## Claude のメモ
- 見本 v2 の4人は v1 のポーズのまま（P05 はリリスと同じ「腕を伸ばす」形）→ しょーくん（11/15）：演技表どおり描き直す（B）
- できあがりの並び：左から P01 待機・P02 歩行A・P05 通常攻撃・P09 ガード（設定書 `docs/characters/myu_design_master.md` の演技表 v2）
- 届いたら、各段から変えた1人だけを取り、色を見本 v2 に合わせる → 切り分け・足元そろえ（`docs/ART_PIPELINE.md`）

## Claude の確認（ここは Claude が書く）
- 2026-11-15 Codex（PR #25・2172×724・緑の背景）：P01 待機（あごに指・首かしげ）・P02 歩行A（スキップ）・P05 通常攻撃（投げ終わり・ウィンク）・P09 ガード（丸まって腕を交差）、4つとも合格。P09 はしゃがんだ形で、ほかより背が低い（縦556px）
- 取りこみ：`tools/import_codex.py`（色を見本 v2 に合わせた）・ブランチ myu/poses-v2
