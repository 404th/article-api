const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    article_id: mongoose.mongo.ObjectID,
    comments: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("comment", CommentSchema);
module.exports = { Comment };
