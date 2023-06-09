import * as fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "path";
import { Readable } from "stream";
import { fileURLToPath } from "url";
import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import {
  listBucketsS3,
  createBucketS3,
  deleteBucketS3,
  getObjectS3,
  putObjectS3,
  deleteObjectsS3,
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

const createDeleteBucketCommand = (input) => {
  return new DeleteBucketCommand(input);
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

const createDeleteBucketCommandInput = (bucket) => {
  const input = {
    Bucket: bucket,
  };
  return input;
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

  // バケット一覧
  // const input = createListBucketsCommandInput();
  // const command = createListBucketsCommand(input);
  // return listBucketsS3(s3Client, command)
  //   .then((res) => {
  //     console.log(res);
  //     console.log(res.Buckets);
  //     return res;
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     callback(err);
  //     return err;
  //   });

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

  // バケット削除
  // const input = createDeleteBucketCommandInput(bucket);
  // const command = createDeleteBucketCommand(input);
  // return deleteBucketS3(s3Client, command)
  //   .then((res) => {
  //     console.log(res);
  //     return res;
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     callback(err);
  //     return err;
  //   });

  // ファイルダウンロード
  const input = createGetObjectsCommandInput(bucket, "AVIF_logo.png");
  const command = createGeteObjectsCommand(input);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return getObjectS3(s3Client, command)
    .then((res) => {
      const body = res.Body;
      if (res.Body instanceof Readable) {
        body
          .pipe(createWriteStream("AVIF_logo-download.png"))
          .on("error", (err) => reject(err))
          .on("close", () => resolve(0));
        const response = {
          statusCode: 200,
          body: {
            message: "Success to download file!",
          },
        };
        return JSON.stringify(response);
      } else {
        const errMsg = "This is not ReadableStream object!";
        const errRes = {
          statusCode: 400,
          body: {
            message: errMsg,
          },
        };
        console.error(errRes);
        throw new Error(errMsg);
      }
    })
    .catch((err) => {
      console.error(err);
      callback(err);
      return err;
    });

  // バケット一覧に含まれてないバケット作成
  // const input = createListBucketsCommandInput();
  // const command = createListBucketsCommand(input);
  // return listBucketsS3(s3Client, command)
  //   .then((res) => {
  //     console.log("ListBucket response");
  //     console.log(res);
  //     const buckets = res.Buckets;
  //     console.log("List of bucket");
  //     console.log(buckets);
  //     const bucketNames = buckets.map((b) => b.Name);
  //     console.log("List of bucket name");
  //     console.log(bucketNames);
  //     if (bucketNames.includes(bucket)) {
  //       const response = {
  //         statusCode: 200,
  //         body: {
  //           message: "Bucket is already exist!",
  //         },
  //       };
  //       return JSON.stringify(response);
  //     } else {
  //       const inputCreateBucket = createCreateBucketCommandInput(bucket);
  //       const commandCreateBucket =
  //         createCreateBucketCommand(inputCreateBucket);
  //       return createBucketS3(s3Client, commandCreateBucket);
  //     }
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
