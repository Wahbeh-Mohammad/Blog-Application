import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Logger from "../config/Logger";
import Blog from "../models/Blog";
import Comment from "../models/Comment";

const CONTEXT = "[COMMENT-CONTROLLER]";

const newComment = async (req: Request, res: Response) => {
    try {
        const { userDetails, blogId, commentContent } = req.body;
        if (isValidObjectId(blogId)) {
            const blog = await Blog.findById(blogId).exec();
            if (blog === null) return res.json({ status: false, error: "Blog not found" });
            const newComment = await Comment.create({
                createdBy: userDetails._id,
                blogId,
                commentContent,
            });

            await newComment.populate("createdBy", ["_id", "name"]);
            if (newComment)
                return res.json({
                    status: true,
                    data: newComment,
                });
            else {
                Logger.warn(CONTEXT, "Failed to create new comment", req);
                return res.json({ status: false, error: "Failed to create new Comment" });
            }
        }
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

const deleteComment = async (req: Request, res: Response) => {
    try {
        const { _id } = req.params;
        if (!isValidObjectId(_id)) return res.json({ status: false, error: "Invalid Comment ID" });
        const deleteResult = await Comment.deleteOne({ _id }).exec();
        if (deleteResult.deletedCount === 1) return res.json({ status: true });
        else
            return res.json({
                status: false,
                error: "Failed to delete comment/ Comment not found.",
            });
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

const updateComment = async (req: Request, res: Response) => {
    try {
        const { _id } = req.params;
        const { userDetails, commentContent } = req.body;
        if (!isValidObjectId(_id)) return res.json({ status: false, error: "Invalid Comment ID" });

        const commentFromDb = await Comment.findById({ _id }).exec();

        if (commentFromDb === null) return res.json({ status: false, error: "Comment not found." });

        if (userDetails._id !== commentFromDb.createdBy.toString())
            return res.json({
                status: false,
                error: "Permission denied, you do not own this comment.",
            });

        commentFromDb.commentContent = commentContent;
        await commentFromDb.save();

        return res.json({ status: true });
    } catch (err: any) {
        Logger.error(CONTEXT, err.message, err);
        return res.json({ error: err.message, status: false });
    }
};

export default {
    newComment,
    deleteComment,
    updateComment,
};
