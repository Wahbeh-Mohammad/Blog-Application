import { Schema, model, Document } from "mongoose";

export interface SavedBlogInterface extends Document {
    userId: Schema.Types.ObjectId;
    blogId: Schema.Types.ObjectId;
}

const savedBlogSchema = new Schema<SavedBlogInterface>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
});

const SavedBlog = model<SavedBlogInterface>("SavedBlog", savedBlogSchema);
export default SavedBlog;
