#!/bin/bash


themes=("light" "dark")

# Get all subdirectories in the current working directory
subpaths=$(find . -mindepth 1 -maxdepth 1 -type d)

mkdir -p ../static/typst

typst-ts-cli package link --manifest \
  ../packages/typst-apollo/typst.toml

# Loop through each subpath
for p in $subpaths; do
    mkdir -p ../static/typst/$p
    echo "Compile workspace: $p"
    for theme in "${themes[@]}"; do
        echo "Theme: $theme"
        mkdir -p ../static/typst/$p/$theme

        typst-ts-cli compile \
          --workspace "$p" \
          --entry "$p/main.typ"\
          --input x-target="web-$theme" \
          --output "../static/typst/$p/$theme" \
          --trace=verbosity=0 \
          --dynamic-layout
    done
done