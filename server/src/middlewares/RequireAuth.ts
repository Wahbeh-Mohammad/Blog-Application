import { Request, Response, NextFunction } from "express";
import AuthUtils from "../utils/AuthUtils";
import Logger from "../config/Logger";

const { verifyToken } = AuthUtils;

const CONTEXT = "MIDDLEWARE - RequireAuth";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (token === undefined) return res.json({ status: false, err: "Invalid Token" });

        const userDetails = verifyToken(token);
        Logger.info(
            CONTEXT,
            `Request by user: ${userDetails.username}, id: ${userDetails._id}, Destination: ${req.originalUrl}, Method: ${req.method}`
        );
        if (userDetails) {
            req.body.userDetails = userDetails;
            next();
        } else {
            Logger.warn(CONTEXT, `Invalid Token/Expired ${token} / Belongs to => ${userDetails}`);
            return res.json({ status: false, err: "Invalid Token" });
        }
    } catch (err: any) {
        Logger.error(CONTEXT, err.message);
        return res.json({ status: false, err: "Token expired" });
    }
};

export default requireAuth;
