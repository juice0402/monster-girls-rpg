# ミュウ 画風をリリスに合わせる（1枚だけ試す）

状態：済（Codex PR #17・しょーくんの OK 待ち）
依頼日：2026-11-15
元の絵（リポジトリ）：`art-requests/myu/base/myu_style1_base.png`（2172×724・いまのミュウの P01・P02・P05・P09 を緑の背景に並べた）
保存先（リポジトリ）：`art-requests/myu/out/myu_style1.png`（背景は無地の緑 #00FF00）
ブランチ：`art/myu-style1`
点検：4人とも、顔（目の形と色）・青い長い髪・ティアラ・耳・紫の服・すける袖・金の飾り・ヒールが元の絵と同じか／ポーズが同じか／線が細くて濃く、明暗がくっきりして、髪と肌に白いつやが入ったか（リリスの見本 `assets/characters/lilith/master/lilith_style_master.png` とくらべるのは Claude）

## 描き方
- 元の絵 `myu_style1_base.png` を編集する。新しく描かない
- 失敗したら同じ指示でやり直す（3回まで）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

```
Edit this image. Redraw all four characters in a crisper anime game illustration style with thin dark outlines, stronger shading with purple-tinted shadows, sharp white highlights on the hair and skin, and finer detail in the lace and gold ornaments. Keep their faces, hair, outfits, poses, colors and the background exactly the same.
```

## Claude のメモ
- 要件定義 8章の「ミュウ作り直し ①1枚だけ試す」。合格したら正式な見本（しょーくん OK）→ 残り12ポーズ → ガチャの1枚絵・カットイン
- リリスの絵は添えない（2枚わたすと、まざってリリスの服や顔がうつるため。画風は文で伝える）

## Claude の確認（ここは Claude が書く）
- 2026-11-15 Codex（PR #17・2172×724・緑の背景・1回目）：線が細く濃くなり、明暗と白いつやが強くなった（リリスの見本に近い）。顔・髪・ティアラ・耳・服・すける袖・金の飾り・ヒール・ポーズは同じ
- 全体の色がむらさき寄りに暗くなった（体の平均で R−25・G−37・B−37）。色は Claude のコードでいまのミュウに合わせられる（要件定義 2章）
- しょーくんに「いま／Codex／Codex＋色合わせ／リリス」を並べた1枚で見てもらう → OK なら正式な見本（要件定義 8章の②）
