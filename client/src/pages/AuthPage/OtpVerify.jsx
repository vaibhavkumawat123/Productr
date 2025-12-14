import { useDispatch, useSelector } from "react-redux";
import { verifyLoginOtp, verifySignupOtp } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Spinner from "../../components/ui/Spinner";
import { h2 } from "motion/react-client";

const OtpVerify = ({ email, mode, signupData }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, error } = useSelector((s) => s.auth);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      return toast.error("Enter valid OTP");
    }

    let res;

    if (mode === "login") {
      res = await dispatch(verifyLoginOtp({ email, otp: finalOtp }));
    } else {
      res = await dispatch(verifySignupOtp({ ...signupData, otp: finalOtp }));
    }

    if (res.meta.requestStatus === "fulfilled") {
      login({
        token: res.payload.token,
        user: res.payload.user,
      });

      toast.success("Login successful 🎉");
      navigate("/dashboard/home");
    } else {
      toast.error(res.payload || "Invalid OTP");
    }
  };

  return (
    <form onSubmit={submit} className="w-[350px] text-center">
      {/* OTP BOXES */}
      <h2 className="text-lg font-medium mb-4">Please verify your otp</h2>
      <div className="flex justify-between mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-semibold focus:outline-none focus:border-blue-600"
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        disabled={loading}
        className="w-full bg-[#0b1b4a] text-white py-2 rounded-xl flex items-center justify-center"
      >
        {loading ? <Spinner /> : "Verify OTP"}
      </button>
    </form>
  );
};

export default OtpVerify;
