"""ChatGPT が描いた「並べ描き」の1枚（横一列に何人か）を、1ポーズずつの透明 PNG に切り分ける。

使い方（リポジトリのいちばん上で）:
  python3 tools/import_sheet.py myu assets/characters/myu/source/myu_final1.png P01 P02 P03 P09
  python3 tools/import_sheet.py myu <シート> P13 P14 SP01 SP02 --only 4     # 4人目だけ取りこむ
  オプション: --bg auto|alpha|green|gray|black|white（ふつうは auto） --recolor（character.json の recolor を使う）

- 背景：本物の透明ならそのまま。緑 #00FF00・グレー・白・チェック柄なら色で消す（緑は色のにじみも消す）
- 切り分け：だれもいない縦の列（すき間）で区切る。人数より多く分かれたら、いちばん近いもの同士をくっつける
- 小さなゴミ（はなれた点）は消す。切り抜きは体ぴったり（余白なし）
- 保存先：character.json の poseFile（例 poses/myu_P01_idle.png）。同じ名前があれば上書き
"""
import argparse
import colorsys
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as nd

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import load_char, pose_path  # noqa: E402


def key_background(a, mode):
    """RGBA 配列の背景を透明にする"""
    rgb = a[..., :3].astype(int)
    alpha = a[..., 3].astype(int)
    if mode == 'auto':
        if (alpha < 16).mean() > 0.15:
            mode = 'alpha'
        else:
            border = np.concatenate([rgb[:4].reshape(-1, 3), rgb[-4:].reshape(-1, 3), rgb[:, :4].reshape(-1, 3), rgb[:, -4:].reshape(-1, 3)])
            med = np.median(border, 0)
            if med[1] > 180 and med[0] < 90 and med[2] < 90:
                mode = 'green'
            elif med.max() < 40:
                mode = 'black'
            elif (border.max(1) - border.min(1)).mean() < 12 and med.mean() > 200:
                mode = 'white'  # 白とグレーのチェック柄もここ
            else:
                mode = 'gray'
            print('背景は', mode, '（端の色', med.astype(int).tolist(), '）')
    if mode == 'alpha':
        return a
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    if mode == 'green':
        dist = g - np.maximum(r, b)
        keep = np.clip((60 - dist) / 40, 0, 1)
        out = a.copy()
        out[..., 1] = np.minimum(g, np.maximum(r, b) + 6).astype(np.uint8)  # 緑のにじみを消す
    else:
        target = {'gray': (128, 128, 128), 'black': (0, 0, 0), 'white': (255, 255, 255)}[mode]
        d = np.sqrt(((rgb - np.array(target)) ** 2).sum(2))
        keep = np.clip((d - 14) / 24, 0, 1)
        if mode == 'white':  # チェック柄の薄いグレーも消す
            d2 = np.sqrt(((rgb - np.array((204, 204, 204))) ** 2).sum(2))
            keep = np.minimum(keep, np.clip((d2 - 10) / 20, 0, 1))
        out = a.copy()
    out[..., 3] = (alpha * keep).astype(np.uint8)
    return out


def split_figures(alpha, count):
    """だれもいない縦の列で区切って、count 人分の横の範囲を返す"""
    occ = (alpha > 24).sum(0) > 2
    segs, x = [], 0
    w = len(occ)
    while x < w:
        if occ[x]:
            s = x
            while x < w and occ[x]:
                x += 1
            segs.append([s, x])
        x += 1
    segs = [s for s in segs if s[1] - s[0] > 6]
    while len(segs) > count:
        gaps = [segs[i + 1][0] - segs[i][1] for i in range(len(segs) - 1)]
        i = int(np.argmin(gaps))
        segs[i] = [segs[i][0], segs[i + 1][1]]
        del segs[i + 1]
    return segs


def clean(fig):
    """はなれた小さな点を消す（体からはなれた20ピクセルより小さいもの）"""
    m = fig[..., 3] > 24
    lab, n = nd.label(m)
    if n <= 1:
        return fig
    sizes = nd.sum(m, lab, range(1, n + 1))
    big = sizes.max()
    for i, sz in enumerate(sizes, 1):
        if sz < max(60, big * 0.002):
            fig[lab == i, 3] = 0
    return fig


def recolor(fig, rules):
    """character.json の recolor：色相・彩度の範囲にある色を、目標の色相・彩度に変える（明るさは残す）"""
    out = fig.copy()
    rgb = fig[..., :3] / 255.0
    flat = rgb.reshape(-1, 3)
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in flat]).reshape(rgb.shape)
    for rule in rules:
        h0, h1 = rule['hue']
        s0, s1 = rule['sat']
        th, ts, _ = colorsys.rgb_to_hsv(*[c / 255 for c in rule['to']])
        hdeg = hsv[..., 0] * 360
        sel = (hdeg >= h0) & (hdeg <= h1) & (hsv[..., 1] >= s0) & (hsv[..., 1] <= s1) & (hsv[..., 2] >= rule.get('val_min', 0)) & (fig[..., 3] > 0)
        idx = np.argwhere(sel)
        for y, x in idx:
            v = hsv[y, x, 2]
            r, g, b = colorsys.hsv_to_rgb(th, ts, v)
            out[y, x, :3] = (np.array([r, g, b]) * 255).astype(np.uint8)
        print(f"  色の直し「{rule.get('name', '')}」: {len(idx)} ピクセル")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('char')
    ap.add_argument('sheet')
    ap.add_argument('poses', nargs='+')
    ap.add_argument('--bg', default='auto')
    ap.add_argument('--only', type=int, nargs='*', help='取りこむ人の番号（左から1）')
    ap.add_argument('--recolor', action='store_true')
    a = ap.parse_args()
    data = load_char(a.char)
    im = np.array(Image.open(a.sheet).convert('RGBA'))
    im = key_background(im, a.bg)
    segs = split_figures(im[..., 3], len(a.poses))
    if len(segs) != len(a.poses):
        sys.exit(f'{len(a.poses)} 人のはずが {len(segs)} 人に分かれた（人が重なっている？）。シートを見て、--only や描き直しで対応する')
    for i, (pid, (x0, x1)) in enumerate(zip(a.poses, segs), 1):
        if a.only and i not in a.only:
            continue
        fig = clean(im[:, x0:x1].copy())
        if a.recolor and data.get('recolor'):
            fig = recolor(fig, data['recolor'])
        ys, xs = np.nonzero(fig[..., 3] > 24)
        fig = fig[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        out = pose_path(a.char, data, pid)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        Image.fromarray(fig).save(out)
        print(f'{pid}: {os.path.relpath(out)}  {fig.shape[1]}×{fig.shape[0]}')
    print('次：python3 tools/anchors.py', a.char, '→ 点検シートを見る')


if __name__ == '__main__':
    main()
