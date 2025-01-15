const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comments: String,
  images: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", ReviewSchema);
