import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    imageUrl: {
      type: [String],
      required: true,
    },
    editions: [
      {
        edition: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        discountPercent: {
          type: Number,
          required: true,
          default: 5,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", schema);
export default Book;
