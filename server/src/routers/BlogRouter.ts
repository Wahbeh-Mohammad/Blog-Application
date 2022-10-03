import express from "express";
import BlogController from "../controllers/BlogController";
import requireAuth from "../middlewares/RequireAuth";
const router = express.Router();

router.get("/", requireAuth, BlogController.allBlogs);
router.get("/:_id", requireAuth, BlogController.specificBlog);
router.post("/new", requireAuth, BlogController.createBlog);
router.put("/:_id", requireAuth, BlogController.updateBlog);
router.delete("/:_id", requireAuth, BlogController.deleteBlog);

export default router;
