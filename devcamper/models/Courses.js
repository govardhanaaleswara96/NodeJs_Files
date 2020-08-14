const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please Add A Course Title"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Please Add A Description"],
  },
  weeks: {
    type: String,
    trim: true,
    required: [true, "Please Add A Number OF Weeks"],
  },
  tuition: {
    type: String,
    trim: true,
    required: [true, "Please Add A Tuition Cost"],
  },
  minimumSkill: {
    type: String,
    trim: true,
    required: [true, "Please Add A Minimum Skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "bootcamps",
    required: true,
  },
});

module.exports = mongoose.model("Course", CourseSchema);
