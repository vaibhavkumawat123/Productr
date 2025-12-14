import { useDispatch, useSelector } from "react-redux";
import { sendSignupOtp } from "../../redux/slices/authSlice";
import { toast } from "react-hot-toast";
import Spinner from "../../components/ui/Spinner";

const SignupForm = ({ setEmail, setSignupData, onOtpSent, switchMode }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);

  const submit = async (e) => {
    e.preventDefault();

    const data = {
      userName: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    setEmail(data.email);
    setSignupData(data);

    const res = await dispatch(sendSignupOtp({ email: data.email }));

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
        Signup your Productr Account
      </h2>

      <form onSubmit={submit} className="w-[350px]">
        <input
          name="name"
          placeholder="Name"
          className="w-full border border-gray-400 rounded-xl p-2 mb-4"
        />
        <input
          name="email"
          placeholder="Email"
          className="w-full border border-gray-400 rounded-xl p-2 mb-4"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border border-gray-400 rounded-xl p-2 mb-4"
        />

        <button
          disabled={loading}
          className="w-full bg-[#0b1b4a] text-white py-2 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Spinner />
              <span>Sending OTP...</span>
            </>
          ) : (
            "Continue"
          )}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already user?{" "}
        <span onClick={switchMode} className="text-blue-600 cursor-pointer">
          Login
        </span>
      </p>
    </>
  );
};

export default SignupForm;
