import { Request, Response } from "express";
import User, { Gender } from "../models/User";
import logger from "../config/Logger";
import CredentialValidations from "../utils/ValidationUtils";
import PasswordUtils from "../utils/PasswordUtils";
import AuthUtils from "../utils/AuthUtils";
const { isValidName, isValidUsername, isValidPassword } = CredentialValidations;
const CONTEXT = "USER-CONTROLLER";

const register = async (req: Request, res: Response) => {
    try {
        logger.info(CONTEXT, `${req.url} ${req.socket.remoteAddress}`);
        const { username, password, gender, birthdate, name } = req.body;

        if (!isValidUsername(username))
            return res.json({
                status: false,
                error: "Invalid Username, Too short.",
            });
        if (!isValidPassword(password))
            return res.json({
                status: false,
                error: "Invalid Password, Too short.",
            });
        if (!isValidName(name))
            return res.json({
                status: false,
                error: "Invalid real name, First and last name are required.",
            });
        if (!Object.values(Gender).includes(gender))
            return res.json({ status: false, error: "Invalid Gender" });

        const newUser = await User.create({
            username,
            password: PasswordUtils.hashPassword(password),
            gender,
            birthdate,
            name,
        });
        if (newUser)
            return res.json({
                status: true,
                token: AuthUtils.signToken(newUser.toObject()),
                id: newUser._id,
                username: newUser.username,
                name: newUser.name,
            });
    } catch (err: any) {
        if (err.name === "MongoServerError" && err.code === 11000) {
            logger.error(CONTEXT, "MongoError: Duplicate Key");
            return res.json({
                status: false,
                error: "Username already registered.",
            });
        } else {
            logger.error(CONTEXT, `${err.name} - ${err.message}`);
            return res.json({
                status: false,
                error: "Couldn't create new user, try again later.",
            });
        }
    }
};

const login = async (req: Request, res: Response) => {
    try {
        logger.info(CONTEXT, `${req.url} ${req.socket.remoteAddress}`);
        const { username, password } = req.body;
        const userFromDb = await User.findOne({
            username,
        }).exec();
        if (userFromDb !== null && PasswordUtils.comparePasswords(password, userFromDb.password))
            return res.json({
                status: true,
                token: AuthUtils.signToken(userFromDb.toObject()),
                id: userFromDb._id,
                username: userFromDb.username,
                name: userFromDb.name,
            });
        else if (userFromDb !== null && userFromDb.password !== password)
            return res.json({
                status: false,
                error: "Invalid Password",
            });
        else
            return res.json({
                status: false,
                error: "Username not registered",
            });
    } catch (err: any) {
        logger.error(CONTEXT, err.message);
        return res.json({ status: false, error: err.message });
    }
};

export default {
    register,
    login,
};
