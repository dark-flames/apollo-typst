#!/bin/bash

# Get all subdirectories in the current working directory
subpaths=$(find . -mindepth 1 -maxdepth 1 -type d)

mkdir -p ../static/typst

# Loop through each subpath
for p in $subpaths; do
    dir_name=$(basename "$p")
    
    mkdir -p ../static/typst/$dir_name

    echo "Compile workspace: $dir_name"
      typst-ts-cli compile \
        --workspace "$p" \
        --entry "$p/main.typ"\
        --output "../static/typst/$dir_name" \
        --dynamic-layout
    
done