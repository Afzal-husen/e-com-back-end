import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product's name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter product's name"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product's price"],
    maxLength: [8, "The price cannot exceed 4 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  stocks: {
    type: Number,
    default: 1,
  },
  category: {
    type: String,
    required: [true, "Please enter product's category"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  reviewscount: {
    type: Number,
    default: 0
  },
},{timestamps: true});

export default mongoose.model("Product", ProductSchema)