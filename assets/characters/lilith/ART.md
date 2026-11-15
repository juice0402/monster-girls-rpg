# リリスの絵の一覧（2026-11-15 v2：16ポーズを高画質に入れかえ）

- 種類：**A・Codex**（ChatGPT Plus の中の Codex で、画風の見本を編集して描いた）。作った日：2026-11-14（見本）・2026-11-15（ポーズ）
- Codex にした理由：同じキャラのポーズちがい・立ち絵のシート（顔と画風をそろえるため・game-art-rule の使い分け）
- もとの PNG：各依頼書のブランチ（`art/lilith-sheetA`〜`D`）の `art-requests/lilith/out/` に、緑の背景・2172×724 のまま残っている（ブランチは描き済みの印として消さない）
- 取りこみ：`tools/import_codex.py`（緑を抜く・人を切り分ける・色を見本の同じ人に合わせる・体ぴったりで切る）。Claude がしたのは背景を抜く・切る・色をそろえるだけ（描き足していない）
- ポーズの正：`poses/lilith_<id>_<名前>.png`（1人の縦 約700px）／表示用：`web/lilith_<id>.webp`（75%）
- アンカー：root は体（コルセット）の真下の床、palm は魔法の出どころ（character.json の note）
- 前の版（v1・360×446・11/14 より前に ChatGPT で作った絵）は `poses_v1/` に残した

| ポーズ | ファイル | 取り出したもと | 依頼書・もとの PNG |
|---|---|---|---|
| P01 待機 | `poses/lilith_P01_idle.png` | 見本の1人目 | `master/lilith_style_master_green.png`（PR #3） |
| P02 歩行A | `poses/lilith_P02_walk_a.png` | 見本の2人目 | 同じ |
| P03 歩行B | `poses/lilith_P03_walk_b.png` | sheetD step2 の2人目 | `art-requests/lilith/sheetD.md`・ブランチ `art/lilith-sheetD`（PR #10） |
| P04 攻撃予備動作 | `poses/lilith_P04_windup.png` | sheetD step1 の1人目 | 同じ |
| P05 通常攻撃 | `poses/lilith_P05_attack.png` | 見本の3人目 | `master/lilith_style_master_green.png`（PR #3） |
| P06 チャージ | `poses/lilith_P06_charge.png` | sheetA step4 の4人目 | `art-requests/lilith/sheetA.md`・ブランチ `art/lilith-sheetA`（PR #6） |
| P07 必殺技 | `poses/lilith_P07_special.png` | sheetA step3 の3人目 | 同じ |
| P08 支援 | `poses/lilith_P08_support.png` | sheetB step1 の1人目 | `art-requests/lilith/sheetB.md`・ブランチ `art/lilith-sheetB`（PR #7） |
| P09 ガード | `poses/lilith_P09_guard.png` | 見本の4人目 | `master/lilith_style_master_green.png`（PR #3） |
| P10 被ダメージ | `poses/lilith_P10_hurt.png` | sheetB step4 の4人目 | `art-requests/lilith/sheetB.md`（PR #7） |
| P11 戦闘不能 | `poses/lilith_P11_down.png` | sheetC step2 の2人目 | `art-requests/lilith/sheetC.md`・ブランチ `art/lilith-sheetC`（PR #8） |
| P12 余韻 | `poses/lilith_P12_after.png` | sheetB step2 の2人目 | `art-requests/lilith/sheetB.md`（PR #7） |
| P13 挑発 | `poses/lilith_P13_taunt.png` | sheetB step3 の3人目 | 同じ |
| P14 セクシー勝利 | `poses/lilith_P14_sexy.png` | sheetC step1 の1人目 | `art-requests/lilith/sheetC.md`（PR #8） |
| SP01 魅惑の月蝕 | `poses/lilith_SP01_eclipse.png` | sheetD step3 の4人目 | `art-requests/lilith/sheetD.md`（PR #10） |
| SP02 魔力吸収 | `poses/lilith_SP02_drain.png` | sheetC step3 の3人目 | `art-requests/lilith/sheetC.md`（PR #8） |

## エフェクトの絵（fx/）
- 前のページから：`floor`（床の魔法陣）・`sigil`（手のひらの魔法陣）・`charge`・`impact`・`sparkles`・`smoke`・`halo`・`butterfly_1〜4`（蝶）。出どころはポーズと同じ
- 描いた魔法の素材（ガード・魔弾・着弾・大技）は全キャラ共通の `assets/painted-vfx.js`
- GPT（A・ChatGPT・2026-11-14・`art-requests/fx/lilith_hearts1.md`）：`heart_glow_1`・`heart_crystal_1`・`heart_bits_1`・`heart_burst_1`。もとの絵は `source/fx_lilith_hearts1.png`

## 画風の見本（全キャラの基準・2026-11-14）
| ファイル | 種類 | 作った日 | 依頼書 | メモ |
|---|---|---|---|---|
| `master/lilith_style_master_green.png` | A・Codex | 2026-11-14 | `art-requests/lilith/style1.md`（PR #3） | もとの PNG（2172×724・緑の背景）。元の絵 `source/lilith_style_src.png` を編集 |
| `master/lilith_style_master.png` | A・Codex（Claude が緑の背景を抜いただけ） | 2026-11-14 | 同じ | 全キャラの画風の見本。【monmusu】が目で確かめ・しょーくん OK |
- Codex にした理由：同じキャラのポーズちがい・立ち絵のシート（顔と画風をそろえるため・game-art-rule の使い分け）
