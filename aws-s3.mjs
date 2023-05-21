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