import { Router } from "express";

import {
  getPostBySearch,
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  comment,
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = Router();

router.route("/").get(getPosts);
router.route("/search").get(getPostBySearch);
router.route("/").post(auth, createPost);
router.route("/:id").get(getPost);
router.route("/:id").patch(auth, updatePost);
router.route("/:id").delete(auth, deletePost);
router.route("/:id/likePost").patch(auth, likePost);
router.route("/:id/commentPost").post(auth, comment);

export default router;
