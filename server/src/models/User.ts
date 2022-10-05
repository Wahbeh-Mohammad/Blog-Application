import { Schema, model, Document } from "mongoose";

export enum UserType {
    ADMIN = "Admin",
    REGULAR = "Regular",
}

export enum Gender {
    FEMALE = "Female",
    MALE = "Male",
}

export interface UserInterface extends Document {
    username: string;
    password: string;
    biography: string;
    name: string;
    birthdate: Date;
    gender: Gender;
    userType: UserType;
}

const UserSchema: Schema = new Schema<UserInterface>(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        birthdate: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: Object.values(Gender),
            required: true,
        },
        userType: {
            type: String,
            enum: Object.values(UserType),
            default: UserType.REGULAR,
        },
        biography: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const User = model<UserInterface>("User", UserSchema);

export default User;
