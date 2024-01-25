const app = require("./src/app");
const { config } = require("dotenv");
config();

const PORT = process.env.PORT || 4400;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log(`Exit Server Express`);
  });
});
