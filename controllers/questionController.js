const User = require("../models/User");
const mongoose = require("mongoose");
const Form = require("../models/Form");
const Question = require("../models/Question");

module.exports.create = async function (req, res) {
   mongoose.connect(process.env.MONGODB_URI);

  try {
    const questions = req.body;
    let ques = await Question.create(questions);
    return res.json(ques);
  } catch (err) {
    return res.status(500).json({ error: "Error in creating question", err });
  }
};
module.exports.editOrCreateQuestions = async function (req, res) {
   mongoose.connect(process.env.MONGODB_URI);

  try {
    const questions = req.body;

    const updatedQuestions = [];

    for (const ques of questions) {
      const existingQuestion = await Question.findById(ques._id);

      if (existingQuestion) {
        existingQuestion.set(ques);
        await existingQuestion.save();
        updatedQuestions.push(existingQuestion);
      } else {

        const newQuestion = new Question(ques);
        await newQuestion.save();
        let formDoc = await Form.findById(ques.form);
        formDoc.set({
          ...formDoc,
          questions: [...formDoc.questions, newQuestion._id],
        });
        await formDoc.save();
        updatedQuestions.push(newQuestion);
      }
    }

    return res.json(updatedQuestions);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error in updating/creating questions", err });
  }
};
