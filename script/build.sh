#!/bin/bash


npm run build --prefix ./ui

rm -fr ./dist
mv -f ./ui/dist ./

CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build .