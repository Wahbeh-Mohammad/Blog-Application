import { Request, Response } from "express";
import Logger from "../config/Logger";
import AuthUtils from "../utils/AuthUtils";
const CONTEXT = "AUTH-CONTROLLER";

const verifyToken = (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        Logger.info(CONTEXT, `Verifying token : ${token}`);
        if (token === undefined) return res.json({ status: false, err: "Invalid Token" });
        const decodedPayload = AuthUtils.verifyToken(token);
        if (decodedPayload) return res.json({ status: true });
        else return res.json({ status: false, err: "Invalid Token" });
    } catch (err: any) {
        Logger.error(CONTEXT, err.message);
        return res.json({ status: false, err: err.message });
    }
};

export default {
    verifyToken,
};
