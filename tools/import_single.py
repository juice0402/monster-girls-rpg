"""Codex の緑の背景の絵（1枚絵・カットイン・敵のシート）を、透明の PNG と表示用の WebP にする。

使い方:
  1枚の絵（わくはそのまま）:
    python3 tools/import_single.py one <codexの.png> <保存先.png> <表示用.webp> [--web 0.75]
  何体か並んだシートを切り分ける（左から順に名前）:
    python3 tools/import_single.py split <codexの.png> <保存先フォルダ> <表示用フォルダ> 名前1 名前2 ... [--web 0.75]
緑を抜くやり方は tools/greenkey.py（ふちの緑をまぜ戻す）。
"""
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from greenkey import figures, tight, unkey_green  # noqa: E402


def save(rgba, png, webp, web):
    os.makedirs(os.path.dirname(png), exist_ok=True)
    os.makedirs(os.path.dirname(webp), exist_ok=True)
    im = Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), 'RGBA')
    im.save(png, optimize=True)
    w = im.resize((round(im.width * web), round(im.height * web)), Image.LANCZOS)
    w.save(webp, quality=86, method=6)
    print(f'{png} {im.size} → {webp} {w.size}')


def main():
    args = [a for a in sys.argv[1:]]
    web = 0.75
    if '--web' in args:
        i = args.index('--web')
        web = float(args[i + 1])
        del args[i:i + 2]
    mode = args[0]
    rgba = unkey_green(args[1])
    if mode == 'one':
        save(rgba, args[2], args[3], web)
    elif mode == 'split':
        names = args[4:]
        for name, fig in zip(names, figures(rgba, expect=len(names))):
            save(tight(fig), os.path.join(args[2], name + '.png'), os.path.join(args[3], name + '.webp'), web)
    else:
        raise SystemExit('one か split')


if __name__ == '__main__':
    main()
