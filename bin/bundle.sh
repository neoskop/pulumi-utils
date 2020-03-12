#!/bin/bash

MODULE=$1
cd $(dirname $(dirname $0))/modules/$MODULE

cp README.md dist
cp ../../LICENSE dist
jq ".main |= \"index.js\" | del(.scripts) | del(.devDependencies) | ." package.json > dist/package.json