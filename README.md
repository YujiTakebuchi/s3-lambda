# s3-lambda | Lambda 開発環境整備リポジトリ

## 概要

AWS の Lambda を使って S3 へのアクセスを試すリポジトリ

## 使用している技術

- node.js v18
- AWS CLI v2
- AWS ECR(Elastic Container Registry)
- AWS Lambda
- AWS S3(Simple Storage Service)
- Docker

## 環境変数

### 設定する必要があるもの

**`export`コマンド等で設定**<br>

- `AWS_ACCOUNT_ID`: AWS のアカウント ID
- `AWS_REGION`: AWS のリージョン情報
- `AWS_S3_LAMBDA_ROLE_ARN`: S3 を扱った Lambda 関数実行のためのロール ARN

### 設定する必要がないもの

`LOCALSTACK_HOSTNAME`: LocalStack の Lambda を使用した場合に設定されている環境変数、AWS のエンドポイントとして localstack を指定する場合に使用する

## ファイル構成

`s3-lambda`<br>
|- `shells`<br>
| |- `ecr`: 本番環境へのイメージのビルド&デプロイ用シェルスクリプトを置いてるディレクトリ、詳細は本番環境へのビルドデプロイ項目に記載<br>
| |- `localstack`: LocalStack 環境への関数の作成、更新、実行用シェルスクリプトを置いてるディレクトリ、詳細は本番環境へのビルドデプロイ項目に記載<br>
|- `uploads`: アップロードするファイルを配置するディレクトリ
|- `index.mjs`: エントリポイント、主な処理はここで実行<br>

## 実行

- `shells/localstack`: ローカル環境での検証用のスクリプト置き場
- `shells/lambda`: 本番 AWS 環境へのビルド&デプロイスクリプト置き場
- `shells/ecr`: リアル AWS 環境での検証用スクリプト置き場

### ローカルでの検証

**`shells/localstack`**

シンプル(別スクリプト統合していない)なスクリプト

- `create-func-localstack.sh`: 関数の作成
- `update-func-localstack.sh`: 関数の更新
- `invoke-func-localstack.sh`: 関数の実行

別スクリプトを統合したスクリプト

- `create-invoke-localstack.sh`: 関数の作成、実行 (作成時に関数の Status が Pending 状態になるため実行は失敗する)
- `update-invoke-localstack.sh`: 関数の更新、実行

### 本番環境へのビルドデプロイ(zip ファイル)

**`shells/lambda`**

シンプル(別スクリプト統合していない)なスクリプト

- `create-func-lambda.sh`: 関数の作成
- `update-func-lambda.sh`: 関数の更新
- `invoke-func-lambda.sh`: 関数の実行

別スクリプトを統合したスクリプト

- `update-invoke-lambda.sh`: 関数の更新、実行

### 本番環境へのビルドデプロイ(Docker イメージ)

**`shells/ecr`**

シンプル(別スクリプト統合していない)なスクリプト

- `shells/ecr/build-handler-image.sh`: Docker イメージのビルド
- `shells/ecr/deploy-handler-aws-ecr.sh`: 本番環境 ECR へのデプロイ

別スクリプトを統合したスクリプト

- `build-deploy-lambda-image-aws-ecr.sh`: Docker イメージのビルド、ECR へのデプロイ

その後

- AWS コンソールにログインして Lambda にアクセス、新しいイメージのデプロイから latest バージョンを設定
