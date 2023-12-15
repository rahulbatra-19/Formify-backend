const User = require("../models/User");
const mongoose = require("mongoose");
const Form = require("../models/Form");
const Result = require("../models/Result");

module.exports.getForms = async function (req, res) {
  try {
    const formsbuilt = await Form.find({ owner: req.user._id });
    const result = await Result.find({ user: req.user._id }).populate({
      path: "form",
      model: "Form",
    });
    res.json({ formsbuilt, result });
  } catch (err) {
    return res.status(500).json({ error: "Error in fetching forms", err });
  }
};
