#!/bin/bash
cd /home/ubuntu/frontend
git pull
npm run prebuild
sudo cp -r dist/ /var/www/
sudo service nginx restart
echo "DONE"
