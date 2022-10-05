import { Router } from "express";
import SavedBlogController from "../controllers/SavedBlogController";
import requireAuth from "../middlewares/RequireAuth";

const router = Router();

router.get("/user", requireAuth, SavedBlogController.savedBlogsByUser);
router.get("/user/full", requireAuth, SavedBlogController.fullSavedBlogsByUser);
router.get("/:blogId", requireAuth, SavedBlogController.isSaved);
router.post("/:blogId", requireAuth, SavedBlogController.saveBlog);
router.delete("/:blogId", requireAuth, SavedBlogController.unsaveBlog);

export default router;
