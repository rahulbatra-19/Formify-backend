const express = require("express");
const router = express.Router();
const multer = require("multer");
const homeController = require("../controllers/homeController");
const passport = require("passport");
const photosMiddleware = multer({ dest: "/tmp" });

router.get("/profile", (req, res) => {
  try {
    if (req.user) {
      res.json(req.user);
    } else {
      return res.status(500).json({ error: "Error in fetching user" });
    }
  } catch (err) {
    console.error("error", err);
  }
});

router.post(
  "/upload",
  passport.checkAuthentication,
  photosMiddleware.single("photo"),
  homeController.upload
);

router.use("/form", require("./form"));
router.use("/users", require("./users"));
router.use("/questions", require("./question"));

router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;
