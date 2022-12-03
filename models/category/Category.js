import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2022/04/15/19/54/flowers-7135053_960_720.jpg",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", CategorySchema);
