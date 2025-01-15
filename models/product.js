const mongoose = require("mongoose");
const { Schema } = mongoose;

const { CATEGORIES } = require("../constants/index");

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: [
      CATEGORIES.Anniversary,
      CATEGORIES.Birthday,
      CATEGORIES.Custom,
      CATEGORIES.Vegan,
      CATEGORIES.Cupcake,
      CATEGORIES.Wedding,
    ],
    required: true,
  },
  flavor: { type: String, required: true },
  size: { type: String, required: true },
  images: { type: String, required: true },
  featured: { type: Boolean, default: false },
  stock: { type: Number, required: true },
  // seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Product", ProductSchema);
