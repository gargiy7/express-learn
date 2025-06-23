const { Schema, model, Types } = require("mongoose");

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    maxlength: 50,
  },
  image: {
    type: String,
    required: true,
  },
  creator: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = model("Product", productSchema);
