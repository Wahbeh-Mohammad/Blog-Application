import express from "express";
import mongoose, { CallbackError } from "mongoose";
import cors from "cors";
import logger from "./config/Logger";
import config from "./config/Config";
import { UserRouter, AuthRouter, BlogRouter, CommentRouter, SavedBlogRouter } from "./routers";

const CONTEXT = "MAIN";
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const build = () => {
    mongoose.connect(config.server.mongoUri, (error: CallbackError) => {
        if (error) logger.error(CONTEXT, error.message);
        else logger.info(CONTEXT, "MongoDB Connection Established");
    });

    app.listen(config.server.port, () => {
        logger.info(CONTEXT, `Server up and running on http://localhost:${config.server.port}`);
    });
};

build();

const routePrefix = "api/v1";
app.get(`/${routePrefix}/healthCheck`, (req, res) => {
    logger.info(CONTEXT, "Health Check");
    return res.sendStatus(200);
});
app.use(`/${routePrefix}/auth`, AuthRouter);
app.use(`/${routePrefix}/user`, UserRouter);
app.use(`/${routePrefix}/blog`, BlogRouter);
app.use(`/${routePrefix}/comment`, CommentRouter);
app.use(`/${routePrefix}/savedBlog`, SavedBlogRouter);
