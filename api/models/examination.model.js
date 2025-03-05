import mongoose from "mongoose";


// bai kiem tra
const examinationSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    // teacher: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Teacher",
    // },
    examDay: {
      type: String,
      required: true,
    },
    examType: {
      type: String, // 15 phut, 1 tiet, giua ki, cuoi ki
      required: true,
    },
    // startTime: {
    //   type: Date,
    //   required: true,
    // },
    // endTime: {
    //   type: Date,
    //   required: true,
    // },
  },
  { timestamps: true }
);

const Examination = mongoose.model("Examination", examinationSchema);

export default Examination;
