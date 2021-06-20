const { Article } = require("../../models/article");
const { Comment } = require("../../models/comment");
const createError = require("../../createError");
const { mongo } = require("mongoose");

// create
const article_post_create = (validationResult) => async (req, res) => {
  const ERRORS = validationResult(req);
  if (!ERRORS.isEmpty()) {
    return res.status(403).json({
      data: {},
      errors: [...ERRORS.errors],
    });
  }

  try {
    const { title, body } = req.body;

    const article = await Article.create({ title, body });
    if (article) {
      return res.status(200).json({
        data: {
          value: article,
          msg: "Article created!",
          param: "article",
          location: "cont_article.js",
        },
        errors: [],
      });
    } else {
      return res.status(500).json({
        data: {},
        errors: [
          createError(
            new Error(),
            "article not created",
            "article",
            "cont_article.js"
          ),
        ],
      });
    }
  } catch (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        data: {},
        errors: [
          createError(
            new Error(`error while creating article: ${err}`),
            "error while creating article",
            "article",
            "cont_article.js"
          ),
        ],
      });
    }
  }
};

// get
const article_get_get = () => async (req, res) => {
  // const ERRORS = validationResult(req);
  // if (!ERRORS.isEmpty()) {
  //   return res.status(403).json({
  //     data: {},
  //     errors: [...ERRORS.errors],
  //   });
  // }

  try {
    const { id } = req.params;
    console.log("id", id);
    const article = await Article.findById(id);
    if (article._id == id) {
      console.log(article);
      return res.status(200).json({
        data: {
          value: article,
          msg: "get",
          param: "article",
          location: "cont_article.js",
        },
        errors: [],
      });
    } else {
      throw new Error();
    }
  } catch (err) {
    if (err) {
      console.log(err);
      return res.status(404).json({
        data: {},
        errors: [
          createError(
            new Error(`error while creating article: ${err}`),
            "error while creating article",
            "article",
            "cont_article.js"
          ),
        ],
      });
    }
  }
};

const article_delete_remove = () => async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.deleteOne({ _id: id });
    if (article) {
      await Comment.deleteOne({ article_id: id });
      return res.status(200).json({
        data: {
          value: article,
          msg: "delete",
          param: "article",
          location: "cont_article.js",
        },
        errors: [],
      });
    } else {
      return res.status(400).json({
        data: {},
        errors: [
          createError(
            new Error(`error while deleting article: ${err}`),
            "error while deleting article",
            "article",
            "cont_article.js"
          ),
        ],
      });
    }
  } catch (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        data: {},
        errors: [
          createError(
            new Error(`error while deleting article: ${err}`),
            "error while deleting article",
            "article",
            "cont_article.js"
          ),
        ],
      });
    }
  }
};

const article_get_all = () => async (_, res) => {
  try {
    const articles = await Article.find();
    if (articles.length >= 1) {
      return res.status(200).json({
        data: {
          value: articles,
          msg: "get all",
          param: "articles",
          location: "cont_article.js",
        },
        errors: [],
      });
    } else if (articles.length === 0) {
      return res.status(200).json({
        data: {
          value: {},
          msg: "no articles",
          param: "no articles",
          location: "cont_article.js",
        },
        errors: [],
      });
    } else {
      return res.status(400).json({
        data: {},
        errors: [
          createError(
            new Error(`error while getting all article: ${err}`),
            "error while getting all articles",
            "articles",
            "cont_article.js"
          ),
        ],
      });
    }
  } catch (err) {
    if (err) {
      return res.status(500).json({
        data: {},
        errors: [
          createError(
            new Error(`error while getting all articles: ${err}`),
            "error while getting all articles",
            "articles",
            "cont_article.js"
          ),
        ],
      });
    }
  }
};

//////////// comments
const comment_post_create = (validationResult) => async (req, res) => {
  const ERRORS = validationResult(req);
  if (!ERRORS.isEmpty()) {
    return res.status(403).json({
      data: {},
      errors: [...ERRORS.errors],
    });
  }

  try {
    const { comment_body } = req.body;
    const { article_id } = req.params;

    const article = await Comment.findOne({ article_id });

    if (!article) {
      const comments = await Comment.create({
        article_id: article_id,
        comments: [comment_body],
      });
      return res.status(200).json({
        data: {
          value: comments,
          msg: "Comment created!",
          param: "comment",
          location: "cont_article.js",
        },
        errors: [],
      });
    } else {
      let updated = await Comment.updateOne(
        { article_id: article_id },
        {
          $push: {
            comments: comment_body,
          },
        }
      );

      return res.status(200).json({
        data: {
          value: updated,
          msg: "Comment posted!",
          param: "comment",
          location: "cont_article.js",
        },
        errors: [],
      });
    }
  } catch (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        data: {},
        errors: [
          createError(
            new Error(`error while comment: ${err}`),
            "error while creating comment",
            "commenta",
            "cont_article.js"
          ),
        ],
      });
    }
  }
};

const comment_get_all = () => async (req, res) => {
  const { article_id } = req.params;
  const { page } = req.query;
  let cmts;

  try {
    const comments = await Comment.findOne({
      article_id,
    }).select("comments");

    if (!comments) {
      return res.status(200).json({
        data: {
          value: [],
          msg: "no comments",
          param: "comments",
          location: "cont_article.js",
        },
        errors: [],
      });
    }

    if (page * 3 < comments.comments.length) {
      cmts = comments.comments.slice(0, page * 3);
    } else {
      cmts = comments.comments;
    }

    if (cmts.length >= 1) {
      return res.status(200).json({
        data: {
          value: cmts,
          msg: "get all",
          param: "comments",
          location: "cont_article.js",
        },
        errors: [],
      });
    }
  } catch (err) {
    if (err) {
      return res.status(500).json({
        data: {},
        errors: [
          createError(
            new Error(`error while getting all articles: ${err}`),
            err,
            "articles",
            "cont_article.js"
          ),
        ],
      });
    }
  }
};

module.exports = {
  article_post_create,
  article_get_get,
  article_delete_remove,
  article_get_all,
  comment_post_create,
  comment_get_all,
};
