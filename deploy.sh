#!/bin/bash

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

cd $SCRIPTPATH

echo "Copying files..."
rm -rf /var/www/html/*
cp -rf * /var/www/html/
chgrp -R www-data /var/www/html/*

echo "Done."