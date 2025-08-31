#!/bin/bash


npm run build --prefix ./ui

rm -fr ./dist
mv -f ./ui/dist ./

go build .