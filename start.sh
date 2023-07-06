#!/bin/sh

sed -i "s/<API_URL>/$API_URL/g" build/config.js;

npx serve build;
