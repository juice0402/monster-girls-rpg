"""ポーズの PNG（正）から、ページで使う表示用の WebP（75%）を作る。PNG を直したら作り直す。

使い方: python3 tools/make_web.py myu
保存先: character.json の webFile（例 web/myu_{id}.webp）
"""
import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import char_dir, load_char, pose_path  # noqa: E402


def main():
    cid = sys.argv[1]
    data = load_char(cid)
    total = 0
    for pid in data.get('names', {}):
        src = pose_path(cid, data, pid)
        if not os.path.exists(src):
            continue
        im = Image.open(src).convert('RGBA')
        sm = im.resize((round(im.width * .75), round(im.height * .75)), Image.LANCZOS)
        out = os.path.join(char_dir(cid), data['webFile'].format(id=pid))
        os.makedirs(os.path.dirname(out), exist_ok=True)
        sm.save(out, 'WEBP', quality=90, method=6)
        total += os.path.getsize(out)
    print(f'WebP できた（合計 {total // 1024} KB）')


if __name__ == '__main__':
    main()
