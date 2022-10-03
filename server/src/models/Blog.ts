import { model, Schema, Document } from "mongoose";

export enum BlogType {
    LEARNING = "Learning",
    DEVLOG = "Devlog",
    TOPICS = "Topics",
    MISC = "Misc",
}

export interface BlogInterface extends Document {
    blogTitle: string;
    blogContent: string;
    blogType: BlogType;
    createdBy: Schema.Types.ObjectId;
}

const blogSchema = new Schema<BlogInterface>(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        blogTitle: {
            type: String,
            required: true,
        },
        blogContent: {
            type: String,
            required: true,
        },
        blogType: {
            type: String,
            enum: Object.values(BlogType),
            required: true,
        },
    },
    { timestamps: true }
);

const Blog = model<BlogInterface>("Blog", blogSchema);
export default Blog;
