#!/bin/bash


npm run build --prefix ./ui

rm -fr ./dist
mv -f ./ui/dist ./

CGO_ENABLED=0 go build .