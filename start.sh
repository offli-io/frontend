#!/bin/sh

# Replace "<API_URL>" string in config.js with env variable
sed -i "s/<API_URL>/$API_URL/g" /usr/share/nginx/html/config.js;

# Serve static content in build folder
nginx -g "daemon off;";
