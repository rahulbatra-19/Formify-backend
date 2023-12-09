const User = require("../models/User");
const mongoose = require("mongoose");
const Form = require("../models/Form");
const Result = require("../models/Result");

module.exports.create = async function (req, res) {
   mongoose.connect(process.env.MONGODB_URI);

  try {
    let form = await Form.create({
      title: req.body.formname,
      owner: req.user,
      questions: [],
      image: req.body.image,
    });
    const userdata = await User.findById(req.user);
    if (!userdata) {
      return res.status(404).json({ error: "User not found" });
    }

    userdata.formsBuilt.push(form._id);
    await userdata.save();
    return res.json(form);
  } catch (err) {
    return res.status(500).json({ error: "Error in creating form", err });
  }
};

module.exports.getFormbyId = async function (req, res) {
   mongoose.connect(process.env.MONGODB_URI);

  try {
    const { id } = req.params;
    const form = await Form.findById(id).populate({
      path: "questions", 
      model: "Questions", 
      populate: {
        path: "ComprehensionSubQuestions", 
        model: "Questions",
      },
    });
    res.json(form);
  } catch (err) {
    return res.status(500).json({ error: "Error while fetching form", err });
  }
};

module.exports.submit = async function (req, res) {
   mongoose.connect(process.env.MONGODB_URI);

  try {
    const { id } = req.params;
    const result = await Result.create({
      user: req.user,
      form: req.body.form,
      ObtaintedPoints: req.body.ObtaintedPoints,
      TotalPoints: req.body.TotalPoints,
    });

    const formDoc = await Form.findById(id);
    if (!formDoc) {
      return res.status(404).json({ error: "Form not found" });
    }

    formDoc.users.push(req.user);
    await formDoc.save();

    const userdata = await User.findById(req.user);
    if (!userdata) {
      return res.status(404).json({ error: "User not found" });
    }

    userdata.formsFilled.push(id);
    await userdata.save();

    return res.json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error in creating form", message: err.message });
  }
};

module.exports.getAllForms = async function (req, res) {
   mongoose.connect(process.env.MONGODB_URI);

  try {
    const forms = await Form.find().populate({
      path: "questions", 
      model: "Questions", 
      populate: {
        path: "ComprehensionSubQuestions", 
        model: "Questions",
      },
    });
    res.json(forms);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error while fetching form", err });
  }
};
