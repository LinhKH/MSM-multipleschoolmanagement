import mongoose from "mongoose";

const schollSchema = new mongoose.Schema(
  {
    school_name: {
      type: String,
      ref: "School",
    },
    email: {
      type: String,
      required: true,
    },
    owner_name: {
      type: String,
      required: true,
    },
    school_image: {
      type: String,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const School = mongoose.model("School", schollSchema);

export default School;
