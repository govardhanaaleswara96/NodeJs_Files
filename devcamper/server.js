const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const loggerMiddleware = require("./middleware/logger");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
// load router files
const bootcampRouter = require("./routes/bootcamps");
//load env vars
dotenv.config({ path: "./config/config.env" });
// connect to database
connectDB();

const app = express();

//body parser
app.use(express.json());

// app.use(loggerMiddleware);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes
app.use("/api/v1/bootcamps", bootcampRouter);

//middleware for error
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .underline.bold
  );
});

//Handle unhandled promis rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`.red.bold);
  server.close(() => {
    process.exit(1);
  });
});
