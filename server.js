const mongoose = require("mongoose");
require("dotenv/config");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");


//Connecting to the Database (altas mongoDB)
mongoose.connect(process.env.DB_CONNECTION, () =>
  console.info("DB CONNECTED SUCCESSFULLY")
);

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!!  shutting down ...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
