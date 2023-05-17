#!/bin/bash

zip -r app.zip . -x "Dockerfile" "package*.json" "*.log" "*.yml" "*.sh"
aws lambda update-function-code --function-name s3-lambda --region ap-northeast-1 --zip-file fileb://app.zip