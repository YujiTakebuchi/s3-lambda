#!/bin/bash

zip -r app.zip . -x "Dockerfile" "package*.json" "*.log" "*.yml" "shells/*" ".git/*" ".gitignore"
aws lambda update-function-code --function-name s3-lambda --region ap-northeast-1 --zip-file fileb://app.zip