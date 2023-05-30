export const createBucketS3 = async (s3Client, createBucketCommand) => {
  return s3Client
    .send(createBucketCommand)
    .then((data) => {
      console.log("Success to create bucket!");
      console.log(data);
      const response = {
        statusCode: 200,
        body: {
          message: "Success to create bucket!",
        },
      };
      return JSON.stringify(response);
    })
    .catch((err) => {
      console.error("Failed to create bucket...");
      console.error(err);
      const response = {
        statusCode: 500,
        body: {
          message: "Failed to create bucket...",
        },
      };
      throw new Error(JSON.stringify(response));
    });
};

export const putObjectS3 = async (s3Client, uploadCommand) => {
  return s3Client
    .send(uploadCommand)
    .then((data) => {
      console.log("Success to upload file!");
      console.log(data);
      const response = {
        statusCode: 200,
        body: {
          message: "Success to upload file!",
        },
      };
      return JSON.stringify(response);
    })
    .catch((err) => {
      console.error("Failed to upload file...");
      console.error(err);
      const response = {
        statusCode: 500,
        body: {
          message: "Failed to upload file...",
        },
      };
      throw new Error(JSON.stringify(response));
    });
};

export const deleteObjectsS3 = async (s3Client, deleteCommand) => {
  return s3Client
    .send(deleteCommand)
    .then((data) => {
      console.log("Success to delete files!");
      console.log(data);
      const response = {
        statusCode: 200,
        body: {
          message: "Success to delete file!",
        },
      };
      return JSON.stringify(response);
    })
    .catch((err) => {
      console.error("Failed to delete file...");
      console.error(err);
      const response = {
        statusCode: 500,
        body: {
          message: "Failed to delete file...",
        },
      };
      throw new Error(JSON.stringify(response));
    });
};
