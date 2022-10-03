import { Schema, model } from "mongoose";

export interface CommentInterface extends Document {
    createdBy: Schema.Types.ObjectId;
    blogId: Schema.Types.ObjectId;
    commentContent: string;
}

const commentSchema = new Schema<CommentInterface>(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        blogId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Blog",
        },
        commentContent: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
const Comment = model<CommentInterface>("Comment", commentSchema);
export default Comment;
