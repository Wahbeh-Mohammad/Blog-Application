import { Router } from "express";
import CommentController from "../controllers/CommentController";
import requireAuth from "../middlewares/RequireAuth";
const router = Router();

router.post("/new", requireAuth, CommentController.newComment);
router.put("/:_id", requireAuth, CommentController.updateComment);
router.delete("/:_id", requireAuth, CommentController.deleteComment);

export default router;
