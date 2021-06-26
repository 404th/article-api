const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const {
    article_post_create,
    article_get_get,
    article_delete_remove,
    article_get_all,
    comment_post_create,
    comment_get_all,
} = require("./controllers/cont_article");
//
router.post(
    "/",
    [
        check("title", "title should be min 5 chars")
            .isString()
            .isLength({ min: 5 }),
        check("body", "body should be min 10 chars")
            .isString()
            .isLength({ min: 10 }),
    ],
    article_post_create(validationResult)
);

router.get("/:id", article_get_get());
router.delete("/:id", article_delete_remove());
router.get("/", article_get_all());

////
router.post(
    "/comment/:article_id",
    [
        check("comment_body", "comment_body should be filled")
            .isString()
            .isLength({ min: 10 }),
    ],
    comment_post_create(validationResult)
);
router.get("/comment/:article_id", comment_get_all());

module.exports = router;
