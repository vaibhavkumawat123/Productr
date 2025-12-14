import { useDispatch, useSelector } from "react-redux";
import { sendLoginOtp } from "../../redux/slices/authSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../components/ui/Spinner";

const LoginForm = ({ onOtpSent, switchMode, setEmail }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);
  const [emailInput, setEmailInput] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!emailInput) return toast.error("Email required");

    setEmail(emailInput);

    const res = await dispatch(sendLoginOtp({ email: emailInput }));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("OTP sent to your email 📩");
      onOtpSent();
    } else {
      toast.error(res.payload || "Failed to send OTP");
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-blue-950">
        Login to your Productr Account
      </h2>

      <form onSubmit={submit} className="w-[350px]">
        <h2 className="mb-2.5 font-medium">Email</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full border border-gray-400 rounded-xl p-2 mb-4"
        />

        <button
          disabled={loading}
          className="w-full bg-[#0b1b4a] text-white py-2 rounded-xl flex items-center justify-center gap-2"
        >
          {loading ? <Spinner /> : "Continue"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        New user?{" "}
        <span onClick={switchMode} className="text-blue-600 cursor-pointer">
          Signup
        </span>
      </p>
    </>
  );
};

export default LoginForm;
