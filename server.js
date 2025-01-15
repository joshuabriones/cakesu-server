// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const passport = require("passport");
const dotenv = require("dotenv");
const session = require("express-session");
require("./config/passport");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Your frontend origin
  credentials: true, // Allow credentials (cookies)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"], // Allowed headers
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
connectDB();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  console.log(req.session);
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
