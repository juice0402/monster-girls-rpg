# リリスの絵の一覧（2026-11-14 新しいエンジンへ引っ越し）

- 出どころ：前の `lilith-motions.html`（いまは `lilith-motions-old.html`）に埋めこまれていた絵を、そのまま取り出した（ロスレスの WebP なので劣化なし）。Claude は描き直し・色の直しをしていない
- 種類：しょーくんが ChatGPT と作っていたころ（11/14 より前）の絵。作った日・依頼文の記録はリポジトリにない → わかったらここに書く（claude/game-art-rule.md）
- ポーズの正：`poses/lilith_<id>_<名前>.png`（360×446）／表示用：`web/lilith_<id>.webp`（同じ絵）
- 16ポーズは前のページで同じ接地位置にそろえてあるので、アンカーの root は全部同じ。手のひら（palm）は前のページの数字

| ポーズ | ファイル |
|---|---|
| P01 待機 | `poses/lilith_P01_idle.png` |
| P02 歩行A | `poses/lilith_P02_walk_a.png` |
| P03 歩行B | `poses/lilith_P03_walk_b.png` |
| P04 攻撃予備動作 | `poses/lilith_P04_windup.png` |
| P05 通常攻撃 | `poses/lilith_P05_attack.png` |
| P06 チャージ | `poses/lilith_P06_charge.png` |
| P07 必殺技 | `poses/lilith_P07_special.png` |
| P08 支援 | `poses/lilith_P08_support.png` |
| P09 ガード | `poses/lilith_P09_guard.png` |
| P10 被ダメージ | `poses/lilith_P10_hurt.png` |
| P11 戦闘不能 | `poses/lilith_P11_down.png` |
| P12 余韻 | `poses/lilith_P12_after.png` |
| P13 挑発 | `poses/lilith_P13_taunt.png` |
| P14 セクシー勝利 | `poses/lilith_P14_sexy.png` |
| SP01 魅惑の月蝕 | `poses/lilith_SP01_eclipse.png` |
| SP02 魔力吸収 | `poses/lilith_SP02_drain.png` |

## エフェクトの絵（fx/）
- 前のページから：`floor`（床の魔法陣）・`sigil`（手のひらの魔法陣）・`charge`・`impact`・`sparkles`・`smoke`・`halo`・`butterfly_1〜4`（蝶）。出どころはポーズと同じ
- 描いた魔法の素材（ガード・魔弾・着弾・大技）は全キャラ共通の `assets/painted-vfx.js`
- GPT（A・ChatGPT・2026-11-14・`art-requests/fx/lilith_hearts1.md`）：`heart_glow_1`・`heart_crystal_1`・`heart_bits_1`・`heart_burst_1`。もとの絵は `source/fx_lilith_hearts1.png`

## 画風の見本（全キャラの基準・2026-11-14）
| ファイル | 種類 | 作った日 | 依頼書 | メモ |
|---|---|---|---|---|
| `master/lilith_style_master_green.png` | A・Codex | 2026-11-14 | `art-requests/lilith/style1.md`（PR #3） | もとの PNG（2172×724・緑の背景）。元の絵 `source/lilith_style_src.png` を編集 |
| `master/lilith_style_master.png` | A・Codex（Claude が緑の背景を抜いただけ） | 2026-11-14 | 同じ | 全キャラの画風の見本。【monmusu】が目で確かめ・しょーくん OK |
