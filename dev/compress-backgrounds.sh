#!/bin/bash

INPUT=backgrounds
OUTPUT=public/images/backgrounds

mkdir -p "$OUTPUT"

for file in $INPUT/*; do
  filename="${file##*/}"
  echo "Compressing $filename..."
  convert "$INPUT/$filename" -resize "3072x3072>" -quality "50%" "$OUTPUT/$filename"
done

echo "Done!"