#!/bin/bash
npm i
npm run prebuild
cp -r ./dist /var/www
sudo systemctl restart nginx
echo "====== DONE ======"