#!/usr/bin/env zx
const path = require('path');
const fg = require('fast-glob');

const root = path.resolve('.');

const stream = fg.stream(['src/docker/**/Dockerfile'], { dot: true });
const ignoreLanguages = ['scala']
for await (const entry of stream) {
    cd(path.join(root, entry.replace(/\/Dockerfile/, '')))
    const name = entry.replace(/src\/docker\//, '').replace(/\/Dockerfile/, '')
    if (ignoreLanguages.includes(name)) continue
    await $`docker build -t ${name}:runcode .`
}