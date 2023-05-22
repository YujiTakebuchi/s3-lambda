#!/bin/bash

zip -r app.zip . -x "Dockerfile" "package*.json" "*.log" "*.yml" "shells/*" ".git/*" ".gitignore"
awslocal lambda create-function --region ap-northeast-1 --function-name s3-lambda --zip-file fileb://app.zip --role arn:aws:iam::000000000000:role/lambda-role --handler index.handler --runtime nodejs18.x