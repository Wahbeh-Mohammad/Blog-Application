import { Router } from "express";
import UserController from "../controllers/UserController";
import requireAuth from "../middlewares/RequireAuth";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/", requireAuth, UserController.userDetails);
router.post("/bio", requireAuth, UserController.changeUserBiography);

export default router;
