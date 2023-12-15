const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const passport = require("passport");

router.post("/create", passport.checkAuthentication, questionController.create);
router.post(
  "/edit",
  passport.checkAuthentication,
  questionController.editOrCreateQuestions
);

module.exports = router;
