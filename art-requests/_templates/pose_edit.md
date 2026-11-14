# （ひな形）キャラの絵を「編集方式」で直す・ポーズを変える

状態：保留（ひな形。Claude がコピーして使う。ChatGPT は描かない）
依頼日：
元の絵：`<合格した絵>.png`（ドライブ `monmusu-art/情報源_ChatGPT` か `monmusu-art` のいちばん上）
画風の見本：`lilith_style_master.png`（画風を合わせるときだけ。添える絵は元の絵とあわせて2枚まで）
保存先：ドライブ `monmusu-art` のいちばん上に `<id>_<名前>.png`

## ChatGPT へ
- 新しく描かずに、元の絵を開いて **編集** する
- 下の「画像への指示」を、そのまま（言いかえず・足さず）画像を作る AI に渡す
- できた絵は、少しちがっても保存する（合否は Claude が決める）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

```
Edit this image. Change only the pose of the 2nd character to <ポーズを英語で1つ>. Keep everything else exactly the same.
```

## Claude のメモ（書き方の決まり）
- 画像への指示は短い英語1文。1回に1か所だけ（例：「4人目を3人目と同じ姿にして両腕だけ前へ」）
- 依頼書・プロンプトに作品名・キャラ名・作家名・「〇〇風」・会社の名前を書かない（公開のリポジトリに残る・game-art-rule）
- 「〜しない」を並べない（書いた物が出る）。描かない物の決まりは GPT のプロジェクトの指示にある
- 4人を1枚（縦700px くらい）が標準。ガチャの大きな絵は1人
- ポーズは設定書の演技表のとおり。出どころ（手のひら・武器など）が見えて、まわりに空間がある形を英語で書く（例：open right palm facing right, with empty space in front of it）
- 届いたら、画風の見本・正式な見本と並べた1枚でブレ点検（`docs/ART_REQUIREMENTS.md` 2章）

## Claude の確認（ここは Claude が書く）
- まだ
