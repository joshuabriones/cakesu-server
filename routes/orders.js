const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { customer, products, totalAmount, customRequests } = req.body;

    // Create the order
    const newOrder = new Order({
      customer,
      products,
      totalAmount,
      customRequests,
    });

    // Save the order
    const savedOrder = await newOrder.save();

    // Update the user's orderHistory
    await User.findByIdAndUpdate(
      customer,
      { $push: { orderHistory: savedOrder._id } },
      { new: true }
    );

    // Send response with the saved order
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("customer products.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer products.product"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status, customRequests, products, totalAmount } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status, customRequests, products, totalAmount },
      { new: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
