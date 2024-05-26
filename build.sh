#!/bin/bash
npm i
npm run prebuild
cp -r ./dist /root/frontend/
sudo docker restart nginx
echo "====== DONE ======"