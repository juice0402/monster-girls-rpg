# ミュウ v2 16ポーズ 4枚目（P10・P03・P11・P06 の描き直し）

状態：準備中（3枚目のあと、Claude が依頼中にする）
依頼日：2026-11-15
元の絵（リポジトリ）：`art-requests/myu/base/myu_v2_master_green.png`（ミュウの正式な画風の見本 v2・2172×724・左から P01・P02・P05・P09・背景は緑）
保存先（リポジトリ）：`art-requests/myu/out/myu_v2_sheetD.png`（背景は無地の緑 #00FF00）
ブランチ：`art/myu-v2-sheetD`
点検：4人とも、顔（目の形と色）・青い長い髪・ティアラ・とがった耳・紫の服・すける袖・金の飾り・ヒールが元の絵と同じか／変えた人だけポーズが変わり、ほかの人はそのままか／P03 は3枚目の P02 と足が逆か／P06 は両手のひらが向かい合い、間に空間があるか

## 描き方
- **どの指示も、元の絵 `myu_v2_master_green.png` から編集する（前の結果は使わない）**。1回の編集で1人だけ変える
- 各段の絵を `myu_v2_sheetD_step<番号>.png` で残す。保存先の `myu_v2_sheetD.png` は step4 と同じ絵でよい
- 失敗した段だけ、その段をやり直す（各段3回まで）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

1.
```
Edit this image. Change only the pose of the 1st character: shrinking down with her shoulders hunched and her arms pulled in, puffing out her cheeks in a pout. Keep everything else exactly the same.
```
2.
```
Edit this image. Change only the pose of the 2nd character: skipping, with her left leg forward and the knee raised, her right heel lifted off the ground, and both arms swinging lightly. Keep everything else exactly the same.
```
3.
```
Edit this image. Change only the pose of the 3rd character: sitting flat on the floor with one hand on the floor beside her, eyes closed, looking dejected. Keep everything else exactly the same.
```
4.
```
Edit this image. Change only the pose of the 4th character: bend her knees slightly and hold both hands in front of her chest with the palms facing each other as if holding an invisible ball between them, a gap of two fists between the palms, with an excited, sparkling-eyed smile. Keep everything else exactly the same.
```

## Claude のメモ
- できあがりの並び：左から P10 被ダメージ・P03 歩行B・P11 戦闘不能・P06 チャージ（2枚目の P06 は手が向かい合わなかったので描き直し）
- P14 は Codex を使わず、ガチャの1枚絵 `assets/characters/myu/card/myu_card.png` を縮めて作った（ブランチ myu/poses-v2）
- 届いたら、各段から変えた1人だけを取り、色を見本 v2 に合わせる → 切り分け・足元そろえ（`docs/ART_PIPELINE.md`）

## Claude の確認（ここは Claude が書く）
