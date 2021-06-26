const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const createError = require("./createError");
require("dotenv").config({ path: "./.env" });

app.use(cors());
app.use(express.json());

async function connMB(article_uri) {
    try {
        await mongoose.connect(
            article_uri,
            {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            },
            (err) => {
                if (err) {
                    console.log(err);
                    console.log("error while connecting to DB");
                } else {
                    console.log("Successfully connected to DB");
                }
            }
        );
    } catch (err) {
        return createError(
            new Error(err),
            "can't connect to db",
            "mongo",
            "server.js"
        );
    }
}

//start server
connMB(process.env.MONGODB_ARTICLES_URI);
//////////////

const articleRoute = require("./routes/article");
app.use("/article", articleRoute);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server is running on PORT:${PORT}`));
