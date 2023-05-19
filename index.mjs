import * as fs from "node:fs/promises";
import dotenv from "dotenv";

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
  return createPutObjectCommandInputByLocalFile(
    bucket,
    "./uploads/metal-gear-solid-jamming.gif",
    "image/gif",
    "metal-gear-solid-jamming.gif"
  ).then((data) => {
    console.log(data);
  });
};
