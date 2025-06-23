const express = require("express");
const router = express.Router();
const {
  getHomPage,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByUserId,
} = require("../controllers/products-controller");
const { userAuth } = require("../middleware/check-auth");

router.get("/", getHomPage);

router.get("/:pId", getProductById);

//router.use(userAuth);

router.get("/user/:userId", getProductsByUserId);

router.post("/", createProduct);

router.patch("/:pId", updateProduct);

router.delete("/:pId", deleteProduct);

module.exports = router;
