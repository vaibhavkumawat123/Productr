import express from "express";
import {
  sendSignupOTP,
  verifySignupOTP,
  sendLoginOTP,
  verifyLoginOtp,
  updateProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

/*  Signup with OTP  */
router.post("/signup/send-otp", sendSignupOTP);
router.post("/signup/verify-otp", verifySignupOTP);

/*  Login with OTP  */
router.post("/login/send-otp", sendLoginOTP);
router.post("/login/verify-otp", verifyLoginOtp);

// Profile update
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("avatar"), 
  updateProfile
);

export default router;
