#!/bin/bash

# Get all subdirectories in the current working directory
subpaths=$(find . -mindepth 1 -maxdepth 1 -type d)

rm -rf ../static/typst/*

# Loop through each subpath
for p in $subpaths; do
  # Change directory to the subpath
  # Execute the typst-ts-cli compile command
    dir_name=$(basename "$p")
    
    mkdir ../static/typst/$dir_name
    typst-ts-cli compile \
        --workspace "$p" \
        --entry "$p/main.typ"\
        --output "../static/typst/$dir_name" \
        --dynamic-layout
done