const mongoose = require("mongoose");

const subQuestionsSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
});

const QuesSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
  },
  image: String,
  question: String,
  type: {
    type: String, // Type of question ('Comprehension', 'Cloze', 'Categorize', etc.)
    enum: ["Comprehension", "Cloze", "Categorize"], // Define possible question types
  },
  clozeOptions: [String],
  clozeAnswer: String,
  categorizeQuestionsCategories: [String],
  categorizeQuestionsitems: [String],
  categorizeQuestionsAnswer: {
    type: mongoose.Schema.Types.Mixed,
  },
  ComprehensionSubQuestions: [subQuestionsSchema],
  points: Number,
});

const QuestionsModel = mongoose.model("Questions", QuesSchema);
module.exports = QuestionsModel;
