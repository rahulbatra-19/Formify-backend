const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  avatar: String,
  googleId: String,
  formsBuilt: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
    },
  ],
  formsFilled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
    },
  ],
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
