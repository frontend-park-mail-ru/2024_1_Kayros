#!/bin/bash
npm i
npm run prebuild
sudo cp -r ./dist /home/kayros/frontend/
sudo docker restart nginx
echo "====== DONE ======"