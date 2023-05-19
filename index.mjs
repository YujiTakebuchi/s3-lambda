export const handler = async (event, context, callback) => {
  return fs.readFile("./uploads/metal-gear-solid-jamming.gif").then((f) => {
    console.log(f);
  });
};
