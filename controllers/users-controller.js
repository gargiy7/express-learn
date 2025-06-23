const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUser = async (req, res, next) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    const error = new Error("Not able to fetch the data,SOMETHING WENT wrong");
    error.code = 429;
    return next(error);
  }
};

const signUp = async (req, res, next) => {
  const { name, email, password, image } = req.body;

  // manully check if user already exist
  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      const error = new Error("User already exist, Login instead");
      error.code = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error("Signing Up failed, try again");
    error.code = 489;
    return next(error);
  }

  // hash the password using bcrypt
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    const error = new Error("NOT able to process sign UP right now");
    error.code = 489;
    return next(error);
  }

  // creating the user, if it passes the above checks and hashing
  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image,
    products: [],
  });
  try {
    await createdUser.save();

    // creating jwt token for signup
    const token = await jwt.sign(
      {
        userId: createdUser._id,
        email: createdUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "12h" }
    );
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.status(201).json({
      token: token,
      user: createdUser,
    });
  } catch (err) {
    const error = new Error("NOT able to process sign UP right now");
    error.code = 489;
    return next(error);
  }
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //check if user exist or not
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Invalid User, User doesn't exist");
      error.code = 401;
      return next(error);
    }

    // check if password (hashedPassword is correct)
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      const error = new Error(
        "Invalid User Credentials(Password)  Could not Log you in"
      );
      error.code = 401;
      return next(error);
    }

    // creating jwt token for login
    const token = await jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.status(202).json({
      message: "logging In successful ",
      user: existingUser,
      // email: existingUser.email,
      // userId: existingUser._id,
      token: token,
    });
  } catch (err) {
    const error = new Error("server side error ");
    error.code = 454;
    return next(error);
  }
};

const logoutUser = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
};

exports.getUser = getUser;
exports.signUp = signUp;
exports.logIn = logIn;
exports.logoutUser = logoutUser;
