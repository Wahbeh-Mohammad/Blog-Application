import jwt from "jsonwebtoken";
import { UserInterface } from "../models/User";
import config from "../config/Config";

const signToken = (payload: UserInterface) => {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expireTime,
    });
};

const verifyToken = (token: string) => {
    return jwt.verify(token, config.jwt.secret) as UserInterface;
};

export default {
    signToken,
    verifyToken,
};
