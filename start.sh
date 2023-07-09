#!/bin/sh

# Replace "<API_URL>" string in config.js with env variable
sed -i "s/<API_URL>/$API_URL/g" build/config.js;

# Serve static content in build folder
npx serve build;
