import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: String,
    description: String,
    qty: {
      type: Number,
      min: 0,
    },
    productcode: String,
    color: String,
    images: [{ type: String }],
    discountprice: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
    },
    brand: String,
    model: String,
    specification: {
      type: Map,
      of: String,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

function currentLocalTimePlusOffset() {
  const now = new Date();
  const offset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + offset);
}

productSchema.pre("save", function (next) {
  const currentTime = currentLocalTimePlusOffset();
  this.createdAt = currentTime;
  this.updatedAt = currentTime;
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  const currentTime = currentLocalTimePlusOffset();
  this.set({ updatedAt: currentTime });
  next();
});

const productmodel = model("product", productSchema);
export default productmodel;
