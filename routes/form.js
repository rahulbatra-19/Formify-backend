const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const passport = require("passport");

router.post("/create", passport.checkAuthentication, formController.create);
router.get("/:id", passport.checkAuthentication, formController.getFormbyId);
router.post("/submit/:id", passport.checkAuthentication, formController.submit);
router.get(
  "/get/all",
  passport.checkAuthentication,
  formController.getAllForms
);

module.exports = router;
