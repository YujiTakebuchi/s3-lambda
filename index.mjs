import * as fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { deleteObjectsS3, getObjectS3, putObjectS3 } from "./aws-s3.mjs";

const createS3Client = (config = {}) => {
  return new S3Client(config);
};

const createGeteObjectsCommand = (input) => {
  return new GetObjectCommand(input);
};

const createPutObjectCommand = (input) => {
  return new PutObjectCommand(input);
};

const createDeleteObjectsCommand = (input) => {
  return new DeleteObjectsCommand(input);
};

const createGetObjectsCommandInput = (bucket, fileName) => {
  const input = {
    Bucket: bucket,
    Key: fileName,
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

  // ファイルダウンロード
  const input = createGetObjectsCommandInput(bucket, "AVIF_logo.png");
  const command = createGeteObjectsCommand(input);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return getObjectS3(s3Client, command)
    .then((res) => {
      console.log("res");
      console.log(res);
      console.log("res.Body");
      console.log(res.Body);
      const body = res.Body;
      console.log("typeof Body");
      console.log(typeof body);
      const destFile = createWriteStream(
        path.join(__dirname, "AVIF_logo-download.png")
      );
      destFile.on("finish", () => {
        console.log("success");
      });
      destFile.write(body);
      destFile.end();
      // const toString = Object.prototype.toString;
      // console.log(toString.call(body));
      // body.pipe(destFile);
      const response = {
        statusCode: 200,
        body: {
          message: "Success to download file!",
        },
      };
      return JSON.stringify(response);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
      return err;
    });

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
