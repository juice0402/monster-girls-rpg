# ミュウ v2 16ポーズ 6枚目（P12）

状態：準備中（5枚目のあと、Claude が依頼中にする）
依頼日：2026-11-15
元の絵（リポジトリ）：`art-requests/myu/base/myu_v2_master_green.png`（ミュウの正式な画風の見本 v2・2172×724・左から P01・P02・P05・P09・背景は緑）
保存先（リポジトリ）：`art-requests/myu/out/myu_v2_sheetF.png`（背景は無地の緑 #00FF00）
ブランチ：`art/myu-v2-sheetF`
点検：顔（目の形と色）・青い長い髪・ティアラ・とがった耳・紫の服・すける袖・金の飾り・ヒールが元の絵と同じか／変えた人だけポーズが変わり、ほかの人はそのままか／手のひらが見えて、まわりに空間があるか

## 描き方
- **どの指示も、元の絵 `myu_v2_master_green.png` から編集する（前の結果は使わない）**。1回の編集で1人だけ変える
- 各段の絵を `myu_v2_sheetF_step<番号>.png` で残す。保存先の `myu_v2_sheetF.png` は step1 と同じ絵でよい
- 失敗した段だけ、その段をやり直す（各段3回まで）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

1.
```
Edit this image. Change only the pose of the 2nd character: standing on one leg with the other leg kicked up behind her as if she has just spun around, making a peace sign with her right hand beside her face, and winking. Keep everything else exactly the same.
```

## Claude のメモ
- P12 余韻（2人目）だけ。断られるとほかの絵まで消えるので、1つにした
- 指示の英文は、断られていない段（v2_sheetA・v2_sheetD）のものを1文字も変えずに使う。断られた段（A の step3 SP01・D の step2 P03）は入れない（言いかえて出し直さない）
- 届いたら、各段から変えた1人だけを取り、色を見本 v2 に合わせる（`tools/import_codex.py`）

## Claude の確認（ここは Claude が書く）
