const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");
const mongoose = require("mongoose");

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONT_END_URL,
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(`${process.env.FRONT_END_URL}`);
  }
);

router.get("/auth/logout", function (req, res, next) {
  mongoose.connect(process.env.MONGODB_URI);

  req.logout(function (err) {
    // console.log("logged out");
    if (err) {
      return next(err);
    }
    res.send("done");
  });
});

router.get("/forms", userController.getForms);
module.exports = router;
