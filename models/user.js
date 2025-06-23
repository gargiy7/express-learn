const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  image: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Types.ObjectId,
      required: true,
      ref: "Products",
    },
  ],
});


module.exports = model("User", userSchema);
