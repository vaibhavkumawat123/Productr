import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: String,
    productType: String,
    quantity: Number,
    mrp: Number,
    price: Number,
    brand: String,
    exchange: Boolean,

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
