# ミュウの絵の一覧（v1・2026-11-14）

- 種類：すべて **A（AI で言葉から作った絵）・ChatGPT の画像生成**（claude/game-art-rule.md の「ChatGPT で作った絵」）。もとの PNG は `source/`
- Claude がした加工：切り抜き・背景の透明化・胸元の肌色を体の水色に直す（描き直しはしていない）
- 全体の見本：`myu_16poses_v1_preview.png`

| ポーズ | ファイル | 大きさ | もとの絵（source/） | 依頼書（プロンプト） | 作った日 |
|---|---|---|---|---|---|
| P01_idle | `poses/myu_P01_idle.png` | 397×697 | `myu_final1.png` | `art-requests/myu/edit14.md` | 2026-11-14 |
| P02_walk_a | `poses/myu_P02_walk_a.png` | 443×683 | `myu_final1.png` | `art-requests/myu/edit14.md` | 2026-11-14 |
| P03_walk_b | `poses/myu_P03_walk_b.png` | 435×688 | `myu_final1.png` | `art-requests/myu/edit14.md` | 2026-11-14 |
| P09_guard | `poses/myu_P09_guard.png` | 473×689 | `myu_final1.png` | `art-requests/myu/edit14.md` | 2026-11-14 |
| P04_windup | `poses/myu_P04_windup.png` | 500×657 | `myu_big2.png` | `art-requests/myu/big2.md` | 2026-11-14 |
| P05_attack | `poses/myu_P05_attack.png` | 561×692 | `myu_big2.png` | `art-requests/myu/big2.md` | 2026-11-14 |
| P06_charge | `poses/myu_P06_charge.png` | 501×682 | `myu_big2.png` | `art-requests/myu/big2.md` | 2026-11-14 |
| P07_special | `poses/myu_P07_special.png` | 596×709 | `myu_big2.png` | `art-requests/myu/big2.md` | 2026-11-14 |
| P08_support | `poses/myu_P08_support.png` | 455×704 | `myu_big3.png` | `art-requests/myu/big3.md` | 2026-11-14 |
| P10_hurt | `poses/myu_P10_hurt.png` | 457×679 | `myu_big3.png` | `art-requests/myu/big3.md` | 2026-11-14 |
| P11_down | `poses/myu_P11_down.png` | 434×474 | `myu_big3.png` | `art-requests/myu/big3.md` | 2026-11-14 |
| P12_after | `poses/myu_P12_after.png` | 536×706 | `myu_big3.png` | `art-requests/myu/big3.md` | 2026-11-14 |
| P13_taunt | `poses/myu_P13_taunt.png` | 349×704 | `myu_final4.png` | `art-requests/myu/edit14.md` | 2026-11-14 |
| P14_sexy | `poses/myu_P14_sexy.png` | 393×703 | `myu_final4.png` | `art-requests/myu/edit14.md` | 2026-11-14 |
| SP01_stretch | `poses/myu_SP01_stretch.png` | 562×692 | `myu_final4.png` | `art-requests/myu/edit14.md` | 2026-11-14 |
| SP02_bind | `poses/myu_SP02_bind.png` | 517×692 | `myu_final4b.png` | `art-requests/myu/edit_sp02.md` | 2026-11-14 |

## メモ
- P13 はあごに手のアピール、P14 は両手を上げた勝利ポーズ、SP01・SP02 の伸びる腕とゲルのひもはエフェクトで足す（絵はポーズだけ）
- P01〜P03・P09 は少し大きめに描かれている → ゲームで足元と大きさをそろえる（アンカー）

## 表示用の WebP（web/）
- `web/myu_<ポーズ>.webp`：上の PNG を 75% に縮小しただけ（Claude・2026-11-14。描き直し・色の変更なし）。動きの試し `myu-motions.html` が使う
- 正は `poses/` の PNG。PNG を直したら WebP も作り直す

## エフェクト（すべて C：コードで描いた絵）
- `myu-motions.html` の中でコードで描く：ゲル弾・ゲルのひも・しずく・スライムだまり・ガードの膜・のびる腕（SP01）・ゲルバインド（SP02）・泡・はじけたゲル
- アンカー（足元・手のひら・指先・ガード・被弾点・髪の毛先）は、同じファイルの `POSE` の表（もとの PNG のピクセル座標）

## 戦闘の背景と敵（試し用）
- `assets/stage/battle_bg_moon.webp`・`assets/stage/enemy_moon_slime.png`：`lilith-motions.html` に埋めこまれていた背景と敵を、そのままファイルに出しただけ（中身は同じ）

