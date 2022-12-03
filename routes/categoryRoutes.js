import express from "express";
import {
  createCategory,
  fetchCategories,
  fetchCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category/categoryController.js";
import { authenticateUser } from "../middlewares/auth/authentication.js";
import {
  photoUploadMiddle,
  categoryImgResize,
} from "../middlewares/uploads/photoUpload.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticateUser,
    photoUploadMiddle.single("image"),
    categoryImgResize,
    createCategory
  )
  .get(fetchCategories);

router
  .route("/:id")
  .get(fetchCategory)
  .patch(authenticateUser, updateCategory)
  .delete(authenticateUser, deleteCategory);

export default router;
