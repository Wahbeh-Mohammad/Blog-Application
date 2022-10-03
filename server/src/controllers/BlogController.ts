import { Request, Response } from "express";
import Blog, { BlogType } from "../models/Blog";
import Comment from "../models/Comment";
import Logger from "../config/Logger";
import ValidationUtils from "../utils/ValidationUtils";
import { isValidObjectId } from "mongoose";

const { isValidBlogTitle, isValidBlogContent } = ValidationUtils;

const CONTEXT = "CONTROLLER - BLOG";

const allBlogs = async (req: Request, res: Response) => {
    try {
        const blogList = await Blog.find()
            .populate("createdBy", ["_id", "name"])
            .sort({ createdAt: "desc" })
            .exec();
        return res.json({ status: true, data: blogList });
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

const specificBlog = async (req: Request, res: Response) => {
    try {
        const { _id } = req.params;
        if (isValidObjectId(_id)) {
            const blog = await Blog.findById({ _id }).populate("createdBy", ["_id", "name"]).exec();
            if (blog === null) return res.json({ status: false, error: "Blog not found" });
            else {
                // Since mongoose has no clauses "NOT A RELATIONAL DB"
                // This query to fetch blog's comments
                const blogComments = await Comment.find({ blogId: blog._id })
                    .populate("createdBy", ["_id", "name"])
                    .exec();
                return res.json({ status: true, data: blog, comments: blogComments });
            }
        } else return res.json({ status: false, error: "Invalid blog id" });
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

const createBlog = async (req: Request, res: Response) => {
    try {
        const userDetails = req.body.userDetails;
        const { blogTitle, blogContent, blogType } = req.body;
        if (!isValidBlogTitle(blogTitle))
            return res.json({ status: false, error: "Invalid blog title, too short." });
        if (!isValidBlogContent(blogContent))
            return res.json({ status: false, error: "Invalid blog content, too short." });
        if (!Object.values(BlogType).includes(blogType))
            return res.json({ status: false, error: "Invalid blog type." });
        const newBlog = await Blog.create({
            createdBy: userDetails._id,
            blogTitle,
            blogContent,
            blogType,
        });
        if (newBlog !== null) return res.json({ status: true, data: newBlog._id });
        else {
            Logger.warn(CONTEXT, "Couldn't create a new blog", req);
            return res.json({
                status: false,
                error: "Couldn't create a new blog, please try again later",
            });
        }
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

const updateBlog = async (req: Request, res: Response) => {
    try {
        const { _id } = req.params;
        const { blogTitle, blogContent, blogType, userDetails } = req.body;
        if (!isValidObjectId(_id)) return res.json({ status: false, error: "Invalid blog id" });
        if (!isValidBlogTitle(blogTitle))
            return res.json({ status: false, error: "Invalid blog title." });
        if (!isValidBlogContent(blogContent))
            return res.json({ status: false, error: "Invalid blog content." });
        if (!Object.values(BlogType).includes(blogType))
            return res.json({ status: false, error: "Invalid blog type." });

        const blogToEdit = await Blog.findOne({ _id }).exec();

        if (blogToEdit === null) return res.json({ status: false, error: "Blog not found." });

        if (userDetails._id !== blogToEdit.createdBy.toString())
            return res.json({
                status: false,
                error: "Permission Denied, You do not own this blog.",
            });

        blogToEdit.blogTitle = blogTitle;
        blogToEdit.blogContent = blogContent;
        blogToEdit.blogType = blogType;

        await blogToEdit.save();
        return res.json({ status: true });
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

const deleteBlog = async (req: Request, res: Response) => {
    try {
        const { _id } = req.params;
        if (!isValidObjectId(_id)) return res.json({ status: false, error: "Invalid blog id." });

        const result = await Blog.deleteOne({ _id }).exec();
        if (result.deletedCount === 1) return res.json({ status: true });
        else return res.json({ status: false, error: "Couldn't delete blog, try again later" });
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

export default {
    allBlogs,
    specificBlog,
    createBlog,
    updateBlog,
    deleteBlog,
};
