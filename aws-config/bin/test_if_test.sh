#!/usr/bin/env bash

if [[ ${REACT_APP_STAGE} == "testing" ]]
then
    apt-get update -y && apt-get install -y xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
    npm install -g serve wait-on
    serve -s build & wait-on http://localhost:5000
    node_modules/.bin/cypress run --record --key d0af29c6-efda-46fe-9ba0-eb5a27c0ab37
fi