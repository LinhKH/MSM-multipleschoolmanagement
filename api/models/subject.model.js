import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    // class: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Class",
    // },
    subject_name: {
      type: String,
      required: true,
    },
    subject_code: {
      type: String,
      required: true,
    },
    // teacher: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Teacher",
    // },
  },
  { timestamps: true }
);


const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;