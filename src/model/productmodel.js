import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: String,
    description: String,
    qty: String,
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