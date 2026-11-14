"""動きの試しページの「この動きのこの時刻」を撮って、1枚に並べる（点検用。スクショはまとめて1枚）。

使い方:
  python3 tools/shots.py myu-motions.html "P05:1.05,P05:1.75,SP01:1.25" scratch/shots.png
  オプション: --debug（アンカーの点も出す） --phone（スマホの幅でページ全体の上のほう）
必要なもの: playwright（pip install playwright）と Chrome（なければ playwright install chromium）
ページの ?m=<動き>&t=<秒> で止めた絵を撮る（assets/engine/motion-engine.js の点検用のしくみ）
"""
import argparse
import asyncio
import functools
import http.server
import os
import shutil
import sys
import threading

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import ROOT  # noqa: E402


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=ROOT)
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv.server_address[1]


async def run(a):
    from playwright.async_api import async_playwright
    port = serve()
    chrome = shutil.which('google-chrome') or shutil.which('chromium')
    files, errs = [], []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=chrome, args=['--no-sandbox']) if chrome else await p.chromium.launch()
        if a.phone:
            pg = await b.new_page(viewport={'width': 390, 'height': 600}, device_scale_factor=2)
        else:
            pg = await b.new_page(viewport={'width': 1000, 'height': 900})
        pg.on('pageerror', lambda e: errs.append(str(e)))
        for fr in a.frames.split(','):
            m, t = fr.split(':')
            q = f'?m={m}&t={t}' + ('&debug=1' if a.debug else '')
            await pg.goto(f'http://127.0.0.1:{port}/{a.page}{q}')
            await pg.wait_for_function('window.__ready===true', timeout=30000)
            f = os.path.join(os.path.dirname(os.path.abspath(a.out)), f'_shot_{len(files)}.png')
            if a.phone:
                await pg.screenshot(path=f)
            else:
                await pg.locator('#scene').screenshot(path=f)
            files.append((f, m, t))
        await b.close()
    ims = [Image.open(f) for f, _, _ in files]
    cols = 3 if not a.phone else 4
    sc = .5
    w, h = int(ims[0].width * sc), int(ims[0].height * sc)
    rows = (len(ims) + cols - 1) // cols
    out = Image.new('RGB', (w * min(cols, len(ims)), h * rows))
    for i, im in enumerate(ims):
        im = im.convert('RGB').resize((w, h))
        ImageDraw.Draw(im).text((6, h - 16), f'{files[i][1]} t={files[i][2]}', fill=(255, 255, 0))
        out.paste(im, ((i % cols) * w, (i // cols) * h))
    out.save(a.out)
    for f, _, _ in files:
        os.remove(f)
    print('できた:', a.out, '／ページのエラー:', errs or 'なし')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('page')
    ap.add_argument('frames')
    ap.add_argument('out')
    ap.add_argument('--debug', action='store_true')
    ap.add_argument('--phone', action='store_true')
    a = ap.parse_args()
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    asyncio.run(run(a))


if __name__ == '__main__':
    main()
