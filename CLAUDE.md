# monster-girls-rpg（記号 monmusu）

- いまは「モン娘×牧場スローライフ」を作っている（2026-11-16 に刷新）。設計の正は docs/GAME_DESIGN.md、キャラは docs/CHARACTERS.md
- ゲームは index.html（1ファイル・ドット絵はコードで描く）、台詞は data/dialogue.json
- 16+ のガチャ版（お蔵入り）はブランチ archive/gacha-v1。その絵・設計・キャラ・道具はこちらに持ちこまない
- 絵の決まりはプロジェクトの claude/game-art-rule.md。立ち絵と会話の顔は Codex（art-requests/ に依頼書 → PR に @codex。Codex への決まりは AGENTS.md）
- 緑の背景を抜く道具：tools/greenkey.py・tools/import_single.py
- main に直接 push しない（ブランチ → PR）
