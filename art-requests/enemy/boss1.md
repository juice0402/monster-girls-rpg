# 敵 ボス案（石の女王ゴーレム・1体だけ1回ためす）

状態：依頼中
依頼日：2026-11-15
元の絵（リポジトリ）：`art-requests/enemy/base/enemy_boss1_base.png`（いまのボス golem_v3 を緑の背景に置いた・1024×1024）
保存先（リポジトリ）：`art-requests/enemy/out/enemy_boss1.png`（1024×1024・背景は無地の緑 #00FF00）
ブランチ：`art/enemy-boss1`
点検：怖くて強そうな怪物に見えるか／体はぜんぶ岩で、人らしいのは石の顔だけか／岩の王冠・むらさきに光るひびがあるか／左を向いているか／画風が元の絵と同じか／元の絵より大きいか

## 前に断られた sheet4 と何を変えたか
- ねらいを「闇に落ちた女の子4人」から「怖くて強い怪物のボス1体（体はぜんぶ岩・人らしいのは石の顔だけ・露出も色っぽさもなし）」に変えた

## 描き方
- 元の絵 `enemy_boss1_base.png` を編集する。新しく描かない
- 失敗したら同じ指示でやり直す（3回まで）
- 断られたら言いかえて出し直さず、その依頼書は描かずに作業の報告に理由を書く

## 画像への指示（このまま使う）

```
Edit this image. Turn this golem into a fearsome boss: a towering stone golem queen built from massive cracked stone blocks with glowing purple cracks, huge stone fists and a jagged stone crown, whose only human-like part is her face, carved in smooth pale stone with a stern adult face and glowing purple eyes, menacing and powerful, facing to the left, drawn in the same art style and line work, larger than before and in the same place. Keep the plain green background.
```

## Claude のメモ
- しょーくん（11/15）：敵はモンスターの度合いが多い感じで。石の女王ゴーレムにする（メデューサとくらべて A）
- 司令塔（11/15）：ねらいを「怖い・強い・不気味な怪物」に変えるなら別の案として1回だけ出してよい。条件：露出なし・体の線なし・色っぽいポーズや表情なし／人の部分は顔まで／侵食の途中や闇落ちの場面にしない／monster girl・闇落ちは使わない／ボス1体で1回／また断られたらこの方向はやめて敵は v3 のまま（さらに変えて出し直さない）／合否はしょーくんの目で（game-art-rule の「守ること」）
- 届いたら、緑を抜いて golem_v3 と並べ、しょーくんに見せる。OK なら `python3 tools/import_single.py` で `assets/enemies/golemqueen_v1.png`（＋ web）にして、試作のボスに使う

## Claude の確認（ここは Claude が書く）
