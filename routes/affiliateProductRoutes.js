import express from "express";
import {
  getAllAffiliateProducts,
  getAffiliateProductById,
  createAffiliateProduct,
  updateAffiliateProduct,
  deleteAffiliateProduct,
  buyAffiliateProduct,
} from "../controllers/affiliateProductController.js";
import protect from "../middlewares/authMiddlewares.js";
import admin from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", getAllAffiliateProducts);
router.get("/:id", getAffiliateProductById);
router.post("/", protect, admin, createAffiliateProduct);
router.put("/:id", protect, admin, updateAffiliateProduct);
router.delete("/:id", protect, admin, deleteAffiliateProduct);
router.post("/:id/buy", buyAffiliateProduct);

export default router;
