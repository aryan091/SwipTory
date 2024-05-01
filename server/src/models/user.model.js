const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
  
    password: {
      type: String,
      required: true,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
  },
  {
      timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);