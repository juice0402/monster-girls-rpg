"""Codex の絵（背景は無地の緑 #00FF00）から緑を抜く共通の関数。

ガチャ版の tools/import_codex.py から、どのゲームでも使える所だけ取り出した（2026-11-16）。
- unkey_green: 緑を抜いて RGBA にする（ふちは緑をまぜ戻して本当の色に）
- figures: 横に並んだ人や物を、左から順に1つずつ取り出す
- tight: ぴったりの大きさに切る
"""
import numpy as np
from PIL import Image
from scipy import ndimage as nd

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


