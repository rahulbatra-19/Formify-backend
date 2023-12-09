const mongoose = require("mongoose");

const FormResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
  },
  ObtaintedPoints: Number,
  TotalPoints: Number,
});

const Result = mongoose.model("Result", FormResultSchema);
module.exports = Result;
