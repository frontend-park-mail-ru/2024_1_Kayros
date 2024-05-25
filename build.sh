#!/bin/bash
npm i
npm run prebuild
cp -r dist/ /var/www/
service nginx restart
echo "DONE"
