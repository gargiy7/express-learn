const express = require("express");
const router = express.Router();
const {
  getUser,
  signUp,
  logIn,
  logoutUser,
  updateUser,
} = require("../controllers/users-controller");
const { userAuth } = require("../middleware/check-auth");

router.post("/signup", signUp);

router.post("/login", logIn);

router.post("/logout", logoutUser);

// to check who is logged in by jwt token in cookie
router.get("/profile/view", userAuth, getUser);

router.patch("/profile/:userId", updateUser);

module.exports = router;
