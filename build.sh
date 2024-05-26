#!/bin/bash
npm i
npm run prebuild
cp -r ./dist /root/frontend/
docker restart nginx
echo "====== DONE ======"