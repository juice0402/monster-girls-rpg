"""ChatGPT が描いたエフェクトの1枚（2×2 などのます目に1つずつ）を切り分けて、character.json の fx に登録する。

使い方:
  python3 tools/import_fx.py lilith <シートのPNG> heart_glow_1 heart_crystal_1 heart_burst_1 heart_bits_1 --grid 2x2 --bg black
  python3 tools/import_fx.py myu <シートのPNG> gel_ball_1 gel_splat_1 gel_puddle_1 gel_drops_1 --grid 2x2 --bg alpha
  名前を "-" にしたます目は取りこまない

- 背景 black（光るもの）：黒を透明にする（明るさ＝不透明さ）。重ね方は screen（光が足される）
- 背景 alpha（物っぽいもの：ゲル・花びら・蝶など）：透明のまま。重ね方はふつう（source-over）
  透明にできず緑 #00FF00 で届いたら --bg green
- ます目の中で絵のある所だけ切り取り、長い辺を最大 512px にして WebP で assets/characters/<id>/fx/ に保存
- 名前の最後の _1 _2 … は「同じ種類のちがう形」。エンジンの painted('heart_glow') が1つえらぶ
"""
import argparse
import datetime
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import char_dir, load_char, save_char  # noqa: E402


def unscreen(a):
    """黒い背景の光の絵 → 透明つきの絵（黒＝透明、明るいほど不透明）"""
    rgb = a[..., :3].astype(float) / 255
    al = rgb.max(2)
    al = np.clip((al - 0.03) / 0.97, 0, 1)
    safe = np.maximum(al, 1e-4)[..., None]
    col = np.clip(rgb / safe, 0, 1)
    out = np.dstack([col * 255, al * 255]).astype(np.uint8)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('char')
    ap.add_argument('sheet')
    ap.add_argument('names', nargs='+')
    ap.add_argument('--grid', default='2x2')
    ap.add_argument('--bg', default='alpha', choices=['alpha', 'black', 'green'])
    ap.add_argument('--request', default='', help='依頼書のファイル名（記録用）')
    a = ap.parse_args()
    cols, rows = map(int, a.grid.lower().split('x'))
    data = load_char(a.char)
    fx = data.setdefault('fx', {})
    im = np.array(Image.open(a.sheet).convert('RGBA'))
    if a.bg == 'black':
        im = unscreen(im)
    elif a.bg == 'green':
        g = im[..., 1].astype(int)
        mx = np.maximum(im[..., 0], im[..., 2]).astype(int)
        im[..., 3] = (im[..., 3] * np.clip((60 - (g - mx)) / 40, 0, 1)).astype(np.uint8)
        im[..., 1] = np.minimum(g, mx + 6).astype(np.uint8)
    H, W = im.shape[:2]
    outdir = os.path.join(char_dir(a.char), 'fx')
    os.makedirs(outdir, exist_ok=True)
    for i, name in enumerate(a.names):
        if name == '-':
            continue
        cx, cy = i % cols, i // cols
        cell = im[cy * H // rows:(cy + 1) * H // rows, cx * W // cols:(cx + 1) * W // cols]
        ys, xs = np.nonzero(cell[..., 3] > 6)
        if not len(ys):
            print(name, ': 絵がない（ます目が空）')
            continue
        pad = 6
        y0, y1 = max(0, ys.min() - pad), min(cell.shape[0], ys.max() + pad + 1)
        x0, x1 = max(0, xs.min() - pad), min(cell.shape[1], xs.max() + pad + 1)
        pic = Image.fromarray(cell[y0:y1, x0:x1])
        k = min(1, 512 / max(pic.size))
        if k < 1:
            pic = pic.resize((round(pic.width * k), round(pic.height * k)), Image.LANCZOS)
        fname = name + '.webp'
        pic.save(os.path.join(outdir, fname), 'WEBP', quality=92, method=6)
        fx[name] = {'file': fname, 'w': pic.width, 'h': pic.height,
                    'blend': 'screen' if a.bg == 'black' else 'source-over',
                    'art': 'A・ChatGPT', 'date': datetime.date.today().isoformat(), 'request': a.request}
        print(f'{name}: {pic.width}×{pic.height}  {fx[name]["blend"]}')
    save_char(a.char, data)
    print('character.json の fx に登録した。ページを開くと、エンジンがコードの絵の代わりに使う')


if __name__ == '__main__':
    main()
