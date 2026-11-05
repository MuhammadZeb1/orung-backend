import express from "express";
import { signup, login, verifyOtp } from "../controllers/authController.js";
import { googleLogin } from "../controllers/googleAuthController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/google", googleLogin);
export default router;
