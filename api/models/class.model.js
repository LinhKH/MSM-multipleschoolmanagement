import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    class_text: {
      type: String,
      required: true,
    },
    class_num: {
      type: Number,
      required: true,
    },
    attendee: {// giao vien chu nhiem
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true }
);

const Class = mongoose.model("Class", classSchema);

export default Class;
