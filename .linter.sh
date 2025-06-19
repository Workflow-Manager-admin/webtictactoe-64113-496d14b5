#!/bin/bash
cd /home/kavia/workspace/code-generation/webtictactoe-64113-496d14b5/webtictactoe
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

