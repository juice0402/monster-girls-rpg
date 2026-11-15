# リリス ガチャ・図鑑の1枚絵（P14 を高画質に）

状態：済（Codex PR #14・合格・PR #18 に取りこみ）
依頼日：2026-11-15
元の絵（リポジトリ）：`art-requests/lilith/base/lilith_card1_base.png`（1024×1536・合格した P14 を縦1280px に拡大して上下に余白・背景は緑）
保存先（リポジトリ）：`art-requests/lilith/out/lilith_card1.png`（1024×1536・背景は無地の緑 #00FF00）
ブランチ：`art/lilith-card1`
点検：黒く曲がった2本の角・バラとリボン・顔（目の形）・本・服・翼・しっぽのハートが元の絵と同じか／ポーズ・大きさ・位置が元の絵と同じか（上と下の余白が残っているか）／線と顔がくっきりしたか

## 描き方
- 元の絵 `lilith_card1_base.png` を編集する。新しく描かない
- 失敗したら同じ指示でやり直す（3回まで）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

```
Edit this image. Redraw this character with sharper and finer detail in her face, eyes, hair, lace and gold ornaments, at the same size and position and in the same pose. Keep everything else exactly the same.
```

## Claude のメモ
- 使う所：ガチャの結果（全画面）・ガチャのピックアップ・キャラ詳細（要件定義 4章・10章）
- 上に名前、下にボタンが重なるので、上下の余白は残す
- 届いたら緑を消して `assets/characters/lilith/card/lilith_card.png`（＋ web）にする

## Claude の確認（ここは Claude が書く）
- 2026-11-15 Codex（PR #14・1024×1536・緑の背景・1回目）：合格。ポーズ・大きさ・位置・上下の余白が元の絵と同じ。角・バラとリボン・目の形・本・服・翼・しっぽのハートも同じで、顔・レース・金の飾りがくっきりした（顔を等倍でくらべた）
- 取りこみ：`assets/characters/lilith/card/lilith_card.png`（表示用 `web/lilith_card.webp`）・PR #18。ガチャのバナー・結果・キャラ詳細で使っている
