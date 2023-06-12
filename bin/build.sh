#!/usr/bin/env bash

# Stop if any command fails.
set -e

# Stop on unset variables.
set -u

# Be in project root.
cd "${0%/*}/.."

# Install dependencies from npm.
npm i

# Clean directory.
dir=dist
if [ -d $dir ]; then rm -r $dir; fi
mkdir -p $dir

# Copy static resources.
cp -r resources/ $dir

# Compile.
elm make src/Main.elm --output $dir/v2/finance.js --optimize
elm-ffi $dir/v2/finance.js
elm-minify $dir/v2/finance.js
