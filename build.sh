#!/bin/bash
npm i
npm run prebuild
cp -r ./dist /home/kayros/frontend/
docker restart nginx
echo "====== DONE ======"