const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", async (req, res) => {
  const { category } = req.query;

  try {
    // If a category is provided, filter by it; otherwise, return all products
    const filter = category ? { category: category.toLowerCase() } : {};
    const products = await Product.find(filter);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    console.log(req.body);
    const product = new Product(req.body);
    const savedProduct = await product.save();

    console.log(savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", protect, authorize("Admin"), async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, authorize("Admin"), async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
