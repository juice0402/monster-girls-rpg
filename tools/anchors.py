"""ポーズごとのアンカー（エフェクトを出す点）を character.json に入れて、点検シートを作る。

使い方:
  python3 tools/anchors.py myu                 # root と drips を自動で入れる（manual にあるもの・入っているものは残す）
  python3 tools/anchors.py myu --redo          # 自動の分を入れ直す（manual は残す）
  python3 tools/anchors.py myu --out /tmp/chk  # 点検シートの置き場所（ふつうは scratch/）

自動で入るもの:
  root  … 足元。いちばん下の行の近くで足（くつ）のかたまりを2つ見つけ、その真ん中（ヒールのかかとと先は1つにまとめる）
  drips … しずくの出どころ。character.json の dripColor（例 "purple"）の色の、毛先のいちばん下（くつのあたりは除く）
Claude が点検シートを見て入れるもの（自動ではむずかしいもの）:
  palm（手のひら）・palm2（もう片方の手）・tip（指先）・guard（ガードの中心）・hit（被弾点）
  → hands_check.png の座標の目もりを読んで character.json に書く。合わないときは manual に名前を足すと自動で上書きされない

点検シート:
  anchors_check.png … 全ポーズを足元でそろえて並べ、緑の線＝root、赤＝手、黄＝しずく。体の中心が緑の線の近くにあればOK
  hands_check.png   … 手のあたりを2倍に拡大して、もとの PNG の座標の目もりを入れたもの
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT, load_char, pose_path, save_char  # noqa: E402

DRIP_RULES = {
    # 紫〜ラベンダーの毛先（ミュウ）
    'purple': lambda r, g, b: (b > 150) & (g < r - 15) & (g < b - 35),
}
HAND_POSES = ['P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P12', 'SP01', 'SP02']


def find_root(a):
    ys = np.nonzero((a > 128).any(1))[0]
    ymax = int(ys.max())
    band = a[ymax - 28:ymax + 1] > 128
    cols = np.nonzero(band.any(0))[0]
    groups, start, prev = [], cols[0], cols[0]
    for c in cols[1:]:
        if c - prev > 30:
            groups.append((int(start), int(prev)))
            start = c
        prev = c
    groups.append((int(start), int(prev)))
    rx = int(np.mean([(g0 + g1) / 2 for g0, g1 in groups]))
    return [rx, ymax]


def find_drips(rgba, rule, ymax, low_pose):
    A = rgba.astype(int)
    a = A[..., 3]
    h, w = a.shape
    col = (a > 180) & DRIP_RULES[rule](A[..., 0], A[..., 1], A[..., 2])
    col[ymax - (45 if low_pose else 80):] = False
    low = np.full(w, -1)
    for x in range(int(w * 0.45)):
        c = np.nonzero(col[:, x])[0]
        if len(c) and a[min(h - 1, c.max() + 4), x] < 60:
            low[x] = c.max()
    cand = []
    for x in np.argsort(-low):
        if low[x] < 0:
            break
        if all(abs(x - c[0]) > 40 for c in cand):
            cand.append((int(x), int(low[x]) - 2))
        if len(cand) == 2:
            break
    return [list(c) for c in cand]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('char')
    ap.add_argument('--redo', action='store_true')
    ap.add_argument('--out', default=os.path.join(ROOT, 'scratch'))
    a = ap.parse_args()
    data = load_char(a.char)
    manual = data.get('manual', {})
    poses = data.setdefault('poses', {})
    ids = list(data.get('names', {}).keys())
    imgs = {}
    for pid in ids:
        path = pose_path(a.char, data, pid)
        if not os.path.exists(path):
            print('まだない:', os.path.relpath(path))
            continue
        im = Image.open(path).convert('RGBA')
        imgs[pid] = im
        arr = np.array(im)
        P = poses.setdefault(pid, {})
        P['w'], P['h'] = im.size
        locked = manual.get(pid, [])
        if 'root' not in locked and (a.redo or 'root' not in P):
            P['root'] = find_root(arr[..., 3])
        if data.get('dripColor') and 'drips' not in locked and (a.redo or 'drips' not in P):
            P['drips'] = find_drips(arr, data['dripColor'], P['root'][1], pid == 'P11')
        P.setdefault('drips', [])
    save_char(a.char, data)
    os.makedirs(a.out, exist_ok=True)

    # 全ポーズの点検シート
    S, cw, ch = 0.36, 230, 275
    cols = 8
    rows = (len(imgs) + cols - 1) // cols
    sheet = Image.new('RGB', (cw * cols, ch * rows), (40, 40, 60))
    d = ImageDraw.Draw(sheet)
    for i, (pid, im) in enumerate(imgs.items()):
        P = poses[pid]
        sm = im.resize((int(im.width * S), int(im.height * S)))
        cx, base = (i % cols) * cw + cw // 2, (i // cols) * ch + ch - 8
        ox, oy = cx - int(P['root'][0] * S), base - int(P['root'][1] * S)
        sheet.paste(sm, (ox, oy), sm)
        d.line([(cx, base - 260), (cx, base)], fill=(0, 255, 0))
        for k in ('palm', 'palm2', 'tip', 'guard', 'hit'):
            if k in P:
                X, Y = ox + P[k][0] * S, oy + P[k][1] * S
                d.ellipse([X - 4, Y - 4, X + 4, Y + 4], outline=(255, 0, 0), width=2)
        for x, y in P.get('drips', []):
            X, Y = ox + x * S, oy + y * S
            d.ellipse([X - 3, Y - 3, X + 3, Y + 3], outline=(255, 255, 0), width=2)
        d.text(((i % cols) * cw + 3, (i // cols) * ch + 3), pid, fill=(255, 255, 0))
    p1 = os.path.join(a.out, f'{a.char}_anchors_check.png')
    sheet.save(p1)

    # 手のあたりの拡大（座標の目もりつき）
    tiles = []
    for pid in HAND_POSES:
        if pid not in imgs:
            continue
        im = imgs[pid]
        al = np.array(im)[..., 3]
        ys, xs = np.nonzero(al[:int(im.height * .55)] > 128)
        j = xs.argmax()
        x0, y0 = max(0, xs[j] - 170), max(0, ys[j] - 110)
        crop = im.crop((x0, y0, x0 + 200, y0 + 200))
        bg = Image.new('RGB', (200, 200), (30, 30, 50))
        bg.paste(crop, (0, 0), crop)
        big = bg.resize((400, 400))
        dd = ImageDraw.Draw(big)
        for k in range(0, 200, 20):
            dd.line([(k * 2, 0), (k * 2, 400)], fill=(80, 80, 110))
            dd.line([(0, k * 2), (400, k * 2)], fill=(80, 80, 110))
            dd.text((k * 2 + 1, 1), str(x0 + k), fill=(255, 255, 0))
            dd.text((1, k * 2 + 1), str(y0 + k), fill=(0, 255, 255))
        P = poses[pid]
        for k in ('palm', 'palm2', 'tip', 'guard'):
            if k in P:
                X, Y = (P[k][0] - x0) * 2, (P[k][1] - y0) * 2
                dd.ellipse([X - 6, Y - 6, X + 6, Y + 6], outline=(255, 0, 0), width=3)
        dd.text((150, 385), pid, fill=(255, 120, 120))
        tiles.append(big)
    if tiles:
        hs = Image.new('RGB', (400 * 5, 400 * ((len(tiles) + 4) // 5)))
        for i, t in enumerate(tiles):
            hs.paste(t, ((i % 5) * 400, (i // 5) * 400))
        p2 = os.path.join(a.out, f'{a.char}_hands_check.png')
        hs.save(p2)
        print('点検シート:', os.path.relpath(p1), os.path.relpath(p2))
    missing = [pid for pid in HAND_POSES if pid in poses and 'palm' not in poses[pid]]
    if missing:
        print('palm がまだないポーズ:', ' '.join(missing), '→ hands_check.png を見て character.json に書く')


if __name__ == '__main__':
    main()
