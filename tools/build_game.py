"""試作 game/body.html（Artifact 用・中身だけ）から、GitHub Pages 用の game.html を作る。
使い方：python3 tools/build_game.py"""
from pathlib import Path
root = Path(__file__).resolve().parent.parent
body = (root / 'game/body.html').read_text(encoding='utf-8')
head = ('<!doctype html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
        '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>\n'
        '</head>\n<body>\n<!-- 自動で作るファイル。直すのは game/body.html（tools/build_game.py） -->\n')
(root / 'game.html').write_text(head + body + '\n</body>\n</html>\n', encoding='utf-8')
print('game.html を作った')
