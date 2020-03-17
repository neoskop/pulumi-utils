#!/bin/bash

set -e

for dir in modules/*; do
    echo -e "\e[36;1m${dir}\e[0m"
    echo -e "\e[34;1m${@}\e[0m"
    (cd $dir && eval "$@"); 
done;