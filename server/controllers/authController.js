import User from "../models/userModel.js";
import Otp from "../models/OtpModel.js";
import CustomError from "../utils/CustomError.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

/*  SEND OTP FOR SIGNUP  */
export const sendSignupOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) throw new CustomError(400, "Email is required");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError(400, "Email already registered");
    }

    await Otp.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    try {
      await sendEmail(
        email,
        "Your Signup OTP",
        `Your OTP is ${otp}. It will expire in 5 minutes.`
      );
    } catch (mailErr) {
      console.error("❌ Email failed:", mailErr.message);
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    next(error);
  }
};

/*  VERIFY OTP & SIGNUP  */
export const verifySignupOTP = async (req, res, next) => {
  try {
    const { userName, email, password, otp } = req.body;

    if (!userName || !email || !password || !otp) {
      throw new CustomError(400, "All fields are required");
    }

    const otpData = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpData) throw new CustomError(400, "OTP not found");

    if (Date.now() > otpData.expiresAt.getTime()) {
      await Otp.deleteOne({ email });
      throw new CustomError(400, "OTP expired");
    }

    if (otpData.otp !== otp) {
      throw new CustomError(400, "Invalid OTP");
    }

    const user = await User.create({
      userName,
      email,
      password,
      isVerified: true,
    });

    await Otp.deleteOne({ email });

    // 🔥 TOKEN
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*  SEND OTP FOR LOGIN  */
export const sendLoginOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new CustomError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError(400, "User not found");
    }

    await Otp.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmail(
      email,
      "Login OTP",
      `Your login OTP is ${otp}. It will expire in 5 minutes.`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    next(error);
  }
};

/*  VERIFY LOGIN OTP  */
export const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new CustomError(400, "Email and OTP required");
    }

    const otpData = await Otp.findOne({ email });
    if (!otpData) throw new CustomError(400, "OTP not found");

    if (Date.now() > otpData.expiresAt.getTime()) {
      await Otp.deleteOne({ email });
      throw new CustomError(400, "OTP expired");
    }

    if (otpData.otp !== otp) {
      throw new CustomError(400, "Invalid OTP");
    }

    const user = await User.findOne({ email });
    if (!user) throw new CustomError(400, "User not found");

    await Otp.deleteOne({ email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res) => {
  const { userName } = req.body;

  const updatedData = { userName };

  if (req.file) {
    updatedData.avatar = `/uploads/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updatedData, {
    new: true,
  });

  res.json({
    success: true,
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
    },
  });
};
