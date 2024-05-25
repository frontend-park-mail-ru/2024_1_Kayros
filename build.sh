#!/bin/bash
cd /home/ubuntu/frontend
git -C /home/ubuntu/frontend pull
npm i
npm run prebuild
cp -r ./dist /var/www
sudo systemctl restart nginx
echo "====== DONE ======"