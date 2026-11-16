# assets

絵・音のファイルを置く所（png・webp・jpg・mp3・ogg など）。コードには base64 を書かず、`ASSET('名前.png')` と書くと、`node tools/build.mjs` のときに data: URL にして index.html へ埋めこむ。

いまのドット絵はコードで描いているので、ここはまだ空。Codex の立ち絵・会話の顔ができたらここに置く。
