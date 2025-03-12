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
    date: {
      type: Date,
      required: true,
    },
    
    status: {
      type: String,
      enum: ["Present", "Absent"],  // co mat, vang mat
      default: "Present",
      required: true,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;