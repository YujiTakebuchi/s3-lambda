import * as fs from "node:fs/promises";
import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import {
  listBucketsS3,
  createBucketS3,
  deleteObjectsS3,
  putObjectS3,
} from "./aws-s3.mjs";

const createS3Client = (config = {}) => {
  return new S3Client(config);
};

const createListBucketsCommand = (input) => {
  return new ListBucketsCommand(input);
};

const createCreateBucketCommand = (input) => {
  return new CreateBucketCommand(input);
};

const createPutObjectCommand = (input) => {
  return new PutObjectCommand(input);
};

const createDeleteObjectsCommand = (input) => {
  return new DeleteObjectsCommand(input);
};

const createListBucketsCommandInput = () => {
  const input = {};
  return input;
};

const createCreateBucketCommandInput = (bucket) => {
  const input = {
    Bucket: bucket,
  };
  return input;
};

const createPutObjectCommandInputByLocalFile = async (
  bucket,
  filePath,
  contentType,
  fileName
) => {
  return fs
    .readFile(filePath)
    .then((f) => {
      const input = {
        Bucket: bucket,
        Body: f,
        ContentType: contentType,
        Key: fileName,
      };
      return input;
    })
    .catch((err) => {
      const errorMessage = "Failed to read local file...";
      console.error(errorMessage);
      console.error(err);
      const responseJson = JSON.stringify({
        statusCode: 400,
        body: {
          errorMessage,
        },
      });
      throw new Error(responseJson);
    });
};

const createDeleteObjectsCommandInput = (bucket, fileNameList) => {
  const input = {
    Bucket: bucket,
    Delete: {
      Objects: fileNameList.map((fn) => {
        return {
          Key: fn,
        };
      }),
    },
  };
  return input;
};

export const handler = async (event, context, callback) => {
  dotenv.config();
  const env = process.env;
  const bucket = env.S3_BUCKET_NAME;
  const region = env.AWS_REGION;
  console.log("region");
  console.log(region);
  console.log("bucket name");
  console.log(bucket);
  const s3Client = createS3Client({
    region,
    endpoint: env.LOCALSTACK_HOSTNAME
      ? `http://${env.LOCALSTACK_HOSTNAME}:4566`
      : null,
    forcePathStyle: true,
  });

  // バケット一覧
  const input = createListBucketsCommandInput();
  const command = createListBucketsCommand(input);
  return listBucketsS3(s3Client, command)
    .then((res) => {
      console.log(res);
      console.log(res.Buckets);
      return res;
    })
    .catch((err) => {
      console.error(err);
      callback(err);
      return err;
    });

  // バケット作成
  // const input = createCreateBucketCommandInput(bucket);
  // const command = createCreateBucketCommand(input);
  // return createBucketS3(s3Client, command)
  //   .then((res) => {
  //     console.log(res);
  //     return res;
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     callback(err);
  //     return err;
  //   });

  // ファイルアップロード
  // return createPutObjectCommandInputByLocalFile(
  //   bucket,
  //   "./uploads/AVIF_logo.png",
  //   "image/png",
  //   "AVIF_logo.png"
  // )
  //   .then((input) => {
  //     console.log(input);
  //     const command = createPutObjectCommand(input);
  //     return putObjectS3(s3Client, command);
  //   })
  //   .then((res) => {
  //     console.log(res);
  //     return res;
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     callback(err);
  //     return err;
  //   });

  // ファイル削除
  // const input = createDeleteObjectsCommandInput(bucket, ["AVIF_logo.png"]);
  // const command = createDeleteObjectsCommand(input);
  // return deleteObjectsS3(s3Client, command)
  //   .then((res) => {
  //     console.log(res);
  //     return res;
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     callback(err);
  //     return err;
  //   });
};
