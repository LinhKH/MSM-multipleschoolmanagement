import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    student_class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    // class: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Class",
    // },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },

    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    guardian: { // nguoi giam ho
      type: String,
      required: true,
    },
    guardian_phone: {
      type: String,
      required: true,
    },
    student_image: {
      type: String,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
