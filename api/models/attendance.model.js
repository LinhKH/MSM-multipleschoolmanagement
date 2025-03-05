import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    // subject: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Subject",
    // },
    // teacher: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Teacher",
    // },
    
    status: {
      type: String,
      enum: ["Present", "Absent"],  // co mat, vang mat
      required: true,
    },
    // date: {
    //   type: Date,
    //   required: true,
    //   default: new Date(),
    // },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;