import express from "express";
import AuthController from "../controllers/AuthController";
const router = express.Router();

router.get("/token", AuthController.verifyToken);

export default router;
