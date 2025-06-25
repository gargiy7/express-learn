const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json()); // for parsing application/json
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// importing routes and their use
const productsRoutes = require("./routes/products-routes");
const usersRoutes = require("./routes/users-routes");

// handling CORS error
app.use(
  cors({
    // origin: "https://express-web-d8e4e.web.app",
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);

// error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({
    message: err.message || "Highly Unlkely but, Something'S Broken.",
  });
});

// connecting to database
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@devproject.fnbnu58.mongodb.net/${process.env.DB_NAME}`
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Example app listening on port  ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
