const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Done"],
    default: "Pending",
  },
  totalAmount: { type: Number, required: true },
  customRequests: { type: String },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
