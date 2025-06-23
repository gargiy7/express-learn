const mongoose = require("mongoose");
const Product = require("../models/product");
const User = require("../models/user");

const getHomPage = async (req, res, next) => {
  try {
    const allProducts = await Product.find();
    res.status(216).json(allProducts);
  } catch (err) {
    const error = new Error("Not able to fetch the data, SOMETHING WENT wrong");
    error.code = 429;
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  console.log("coming from the params product id ");
  //res.send(req.params);
  const productId = req.params.pId;
  try {
    const findProduct = await Product.findById(productId);
    if (!findProduct) {
      const error = new Error("This product does not exist");
      error.code = 489;
      return next(error);
    }
    res.status(215).json({ foundProduct: findProduct });
  } catch (err) {
    const error = new Error("Not able to fetch the data, SOMETHING WENT wrong");
    error.code = 429;
    return next(error);
  }
};

const getProductsByUserId = async (req, res, next) => {
  //res.send(req.params);
  const userId = req.params.userId;

  try {
    const user = req.user;
    const userProducts = await Product.find({ creator: userId });
    if (!userProducts || userProducts.length == 0) {
      const error = new Error("This user does not have any product");
      error.code = 489;
      return next(error);
    }
    res.status(215).json({ userProducts });
  } catch (err) {
    const error = new Error("Not able to fetch the data, SOMETHING WENT wrong");
    error.code = 429;
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  // console.log(req.body);
  const { title, price, category, image, creator } = req.body;
  const createdProduct = new Product({
    title,
    price,
    category,
    image,
    creator,
  });

  try {
    const existingUser = await User.findById(creator);
    if (!existingUser) {
      const error = new Error(" this user doesn't exist");
      error.code = 401;
      return next(error);
    }

    // session start
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProduct.save({ session: sess });
    existingUser.products.push(createdProduct);
    await existingUser.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession(); // optional but good practice

    res.status(201).json({
      message: "New product added successfully",
      product: createdProduct,
    });
  } catch (err) {
    const error = new Error("Creating New Product FAILED !!!!");
    error.code = 489;
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const productId = req.params.pId;
  const { title, price, category, image } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      title,
      price,
      category,
      image,
    });
    if (!updatedProduct) {
      const error = new Error("This product does not exist");
      error.code = 419;
      return next(error);
    }
    res.status(203).json({ updatedProduct });
  } catch (err) {
    const error = new Error("Not able to update the product");
    error.code = 449;
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.pId;
  try {
    const deletedProduct = await Product.findById(productId).populate(
      "creator"
    );
    if (!deletedProduct) {
      const error = new Error("This product does not exist");
      error.code = 419;
      return next(error);
    }

    // session start
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await deletedProduct.deleteOne({ session: sess }); // ✅ better than .remove()
    deletedProduct.creator.products.pull(deletedProduct._id); // ✅ pull by ID
    await deletedProduct.creator.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession(); // optional but good practice

    res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct });
  } catch (err) {
    const error = new Error("Not able to delete the desired product");
    error.code = 429;
    return next(error);
  }
};

exports.getHomPage = getHomPage;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProductsByUserId = getProductsByUserId;
