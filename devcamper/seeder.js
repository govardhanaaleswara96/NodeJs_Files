const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// load env vars
dotenv.config({ path: "./config/config.env" });

//load models
const bootCamp = require("./models/bootcamps");
const Courses = require("./models/Courses");

//connect DB

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

// Read JSON files
const bootCamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
// import into DB
const importData = async () => {
  try {
    await bootCamp.create(bootCamps);
    await Courses.create(courses);
    console.log("Data Imported..".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
// delete into DB
const deleteData = async () => {
  try {
    await bootCamp.deleteMany();
    await Courses.deleteMany();
    console.log("Data Destroed...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
