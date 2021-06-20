const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("article", ArticleSchema);
module.exports = { Article };
