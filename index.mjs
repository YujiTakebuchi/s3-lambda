import * as fs from "node:fs/promises";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { putObjectS3 } from "./aws-s3.mjs";

const createS3Client = (config = {}) => {
  return new S3Client(config);
};

const createPutObjectCommand = (input) => {
  return new PutObjectCommand(input);
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

export const handler = async (event, context, callback) => {
  dotenv.config();
  const env = process.env;
  const bucket = env.S3_BUCKET_NAME;
  const region = env.AWS_REGION;
  console.log(region);
  console.log(bucket);
  console.log(env.LOCALSTACK_HOSTNAME);
  const s3Client = createS3Client({
    region,
    endpoint: env.LOCALSTACK_HOSTNAME
      ? `http://${env.LOCALSTACK_HOSTNAME}:4566`
      : null,
  });
  return createPutObjectCommandInputByLocalFile(
    bucket,
    "./uploads/metal-gear-solid-jamming.gif",
    "image/gif",
    "metal-gear-solid-jamming.gif"
  )
    .then((input) => {
      console.log(input);
      const command = createPutObjectCommand(input);
      return putObjectS3(s3Client, command);
    })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.error(err);
      callback(err);
      return err;
    });
};
