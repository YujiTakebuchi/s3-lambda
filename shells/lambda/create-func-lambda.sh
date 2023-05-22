#!/bin/bash

zip -r app.zip . -x "Dockerfile" "package*.json" "*.log" "*.yml" "shells/*" ".git/*" ".gitignore"
aws lambda create-function --region ap-northeast-1 --function-name s3-lambda --zip-file fileb://app.zip --role $AWS_S3_LAMBDA_ROLE_ARN --handler index.handler --runtime nodejs18.x