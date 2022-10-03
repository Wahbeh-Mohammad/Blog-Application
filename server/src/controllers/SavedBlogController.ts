import SavedBlog from "../models/SavedBlog";
import { Request, Response } from "express";
import Logger from "../config/Logger";
import { isValidObjectId } from "mongoose";

const CONTEXT = "CONTROLLER - SavedBlog";

const savedBlogsByUser = async (req: Request, res: Response) => {
    try {
        const { userDetails } = req.body;
        const savedBlogs = await SavedBlog.find({ userId: userDetails._id })
            .populate("blogId", ["blogTitle", "_id"])
            .exec();
        if (savedBlogs.length !== 0) return res.json({ status: true, data: savedBlogs });
        else return res.json({ status: false });
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

const isSaved = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const { userDetails } = req.body;

        if (isValidObjectId(blogId)) {
            const isSaved = await SavedBlog.findOne({ userId: userDetails._id, blogId }).exec();
            if (isSaved !== null) return res.json({ status: true });
            else return res.json({ status: false });
        } else return res.json({ status: false });
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

const saveBlog = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const { userDetails } = req.body;

        if (isValidObjectId(blogId)) {
            const savedBlog = await SavedBlog.create({ userId: userDetails._id, blogId });
            if (savedBlog) return res.json({ status: true });
            else return res.json({ status: false, error: "Couldn't save blog, try again later" });
        } else return res.json({ status: false, error: "Invalid blog id." });
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

const unsaveBlog = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const { userDetails } = req.body;

        if (isValidObjectId(blogId)) {
            const deletedBlog = await SavedBlog.deleteOne({
                userId: userDetails._id,
                blogId,
            }).exec();
            if (deletedBlog.deletedCount === 1) return res.json({ status: true });
            else return res.json({ status: false, error: "Couldn't save blog, try again later" });
        } else return res.json({ status: false, error: "Invalid blog id." });
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

export default {
    savedBlogsByUser,
    isSaved,
    saveBlog,
    unsaveBlog,
};
