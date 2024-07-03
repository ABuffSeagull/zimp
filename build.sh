#!/bin/env sh

export PATH="node_modules/.bin:$PATH"

elm-watch make --optimize

esbuild public/index.js --minify-whitespace --entry-names="[name]-[hash]" --outdir=dist

out_file=$(basename dist/index*.js)

cat public/index.html | sed "s/index.js/${out_file}/g" > dist/index.html
