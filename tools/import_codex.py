"""Codex が描いた「緑の背景・横一列」の絵から、1人ずつ取り出してポーズの PNG にする。

Codex は1回の編集で1人だけ変えた絵（step1, step2, …）を出すので、ポーズごとに
「どの絵の何人目か」を指定して取り出す。色は画風の見本の同じ位置の人に合わせる。

使い方（リポジトリのいちばん上で）:
  python3 tools/import_codex.py lilith \
      --master assets/characters/lilith/master/lilith_style_master_green.png \
      P01=master:1 P02=master:2 P04=/tmp/sheetD_step1.png:1 P07=/tmp/sheetA_step3.png:3
  - `<ポーズ>=<絵>:<何人目>`。<絵> に `master` と書くと見本の絵（色合わせなし）
  - 色合わせの相手は、見本の同じ「何人目」。ちがう人に合わせるときは `:<何人目>:<見本の何人目>`
  - --check <PNG>: 取り出した全ポーズを見本と並べた点検の1枚を作る

やること:
  1. 緑 #00FF00 を抜く（ふちは緑をまぜ戻して本当の色に＝髪の細い毛の黒いふちが出ない）
  2. 人を「かたまり」で見つけて左から順に数える（翼がふれて1つになったら、間のいちばん細い所で切る）
  3. 見本の同じ人と、色の平均とばらつきをそろえる（Codex は編集のたびに少し鮮やかになるため）
  4. 体ぴったりで切って、character.json の poseFile に保存（同じ名前は上書き）
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import load_char, pose_path  # noqa: E402

GREEN = np.array([0, 255, 0], np.float32)


def unkey_green(path):
    """緑の背景を抜いて RGBA（float）にする。ふちは緑をまぜ戻して本当の色を出す"""
    a = np.array(Image.open(path).convert('RGB')).astype(np.float32)
    gn = a[..., 1] - np.maximum(a[..., 0], a[..., 2])
    alpha = np.clip((235 - gn) / 255, 0, 1)
    alpha[alpha < 0.06] = 0
    safe = np.maximum(alpha, 1e-3)[..., None]
    fg = (a - (1 - alpha)[..., None] * GREEN) / safe
    fg = np.clip(fg, 0, 255)
    # まだ緑が残るふちは、緑を赤と青の大きいほうまで下げる
    g_hi = fg[..., 1] > np.maximum(fg[..., 0], fg[..., 2])
    edge = (alpha < 0.98) & g_hi
    fg[..., 1] = np.where(edge, np.maximum(fg[..., 0], fg[..., 2]), fg[..., 1])
    return np.dstack([fg, alpha * 255])


def figures(rgba, expect=4):
    """左から順に、人ごとの (切り出した RGBA, x0) を返す"""
    solid = rgba[..., 3] > 20
    lab, n = nd.label(nd.binary_closing(solid, iterations=2))
    sizes = nd.sum(solid, lab, range(1, n + 1))
    objs = nd.find_objects(lab)
    big = sorted([(i + 1, o) for i, o in enumerate(objs) if sizes[i] > 20000], key=lambda t: t[1][1].start)
    parts = []
    for lbl, o in big:
        x0, x1 = o[1].start, o[1].stop
        mask = nd.binary_dilation(lab == lbl, iterations=2)
        if len(big) < expect and (x1 - x0) > 900:  # 翼がふれて2人が1つになった
            cols = (lab[:, x0:x1] == lbl).sum(0).astype(float)
            lo, hi = int((x1 - x0) * .3), int((x1 - x0) * .7)
            cut = x0 + lo + int(np.argmin(cols[lo:hi]))
            parts += [(mask, x0, cut), (mask, cut, x1)]
        else:
            parts.append((mask, x0, x1))
    out = []
    for mask, x0, x1 in parts:
        f = rgba.copy()
        f[..., 3] *= mask
        out.append(f[:, x0:x1])
    if len(out) != expect:
        raise SystemExit(f'人が {len(out)} 人に分かれた（{expect} 人のはず）')
    return out


def match_color(fig, ref):
    out = fig.copy()
    m, mr = fig[..., 3] > 200, ref[..., 3] > 200
    for c in range(3):
        f, r = fig[..., c][m], ref[..., c][mr]
        out[..., c] = (fig[..., c] - f.mean()) / (f.std() + 1e-6) * r.std() + r.mean()
    out[..., :3] = np.clip(out[..., :3], 0, 255)
    return out


def tight(f):
    ys, xs = np.nonzero(f[..., 3] > 8)
    return f[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('char')
    ap.add_argument('--master', required=True)
    ap.add_argument('--check')
    ap.add_argument('items', nargs='+')
    a = ap.parse_args()
    data = load_char(a.char)
    cache = {}

    def figs_of(path):
        if path not in cache:
            cache[path] = figures(unkey_green(path))
        return cache[path]

    mfigs = figs_of(a.master)
    done = []
    for item in a.items:
        pid, rest = item.split('=', 1)
        src, *nums = rest.rsplit(':', 2) if rest.count(':') >= 2 else rest.rsplit(':', 1)
        idx = int(nums[0]) - 1
        ref = int(nums[1]) - 1 if len(nums) > 1 else idx
        if src == 'master':
            fig = mfigs[idx]
        else:
            fig = match_color(figs_of(src)[idx], mfigs[ref])
        fig = tight(fig)
        out = pose_path(a.char, data, pid)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        Image.fromarray(fig.round().astype(np.uint8), 'RGBA').save(out, optimize=True)
        done.append((pid, fig))
        print(f'{pid}: {fig.shape[1]}×{fig.shape[0]} → {os.path.relpath(out)}')
    if a.check:
        hmax = max(f.shape[0] for _, f in done)
        cw = max(f.shape[1] for _, f in done) // 2 + 16
        cols = 8
        rows = (len(done) + cols - 1) // cols
        sheet = Image.new('RGB', (cw * cols, (hmax // 2 + 30) * rows), (40, 40, 48))
        d = ImageDraw.Draw(sheet)
        for i, (pid, f) in enumerate(done):
            im = Image.fromarray(f.round().astype(np.uint8), 'RGBA')
            im = im.resize((im.width // 2, im.height // 2), Image.LANCZOS)
            x, y = (i % cols) * cw, (i // cols) * (hmax // 2 + 30)
            bg = Image.new('RGBA', im.size, (40, 40, 48, 255))
            bg.alpha_composite(im)
            sheet.paste(bg.convert('RGB'), (x + (cw - im.width) // 2, y + hmax // 2 - im.height))
            d.text((x + 6, y + hmax // 2 + 6), pid, fill=(255, 255, 0))
        sheet.save(a.check)
        print('点検シート:', a.check)


if __name__ == '__main__':
    main()
