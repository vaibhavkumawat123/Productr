import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  togglePublishProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", upload.array("images"), createProduct);
router.get("/", getProducts);
router.put("/:id", upload.array("images"), updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/publish", togglePublishProduct);

export default router;
