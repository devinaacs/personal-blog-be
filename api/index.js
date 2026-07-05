const { createServer } = require("../dist/vercel");

let serverPromise;

module.exports = async (req, res) => {
  if (!serverPromise) {
    serverPromise = createServer();
  }

  const server = await serverPromise;
  server(req, res);
};
