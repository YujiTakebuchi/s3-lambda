export const handler = async (event, context, callback) => {
  console.log("Hello Lambda!");
  return JSON.stringify({
    statusCode: 200,
    body: {
      message: "Hello Lambda!",
    },
  });
};
