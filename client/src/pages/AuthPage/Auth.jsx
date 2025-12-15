import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OtpVerify from "./OtpVerify";
import authImage from "../../assets/authImage.png";

const Auth = () => {
  const { token, loading } = useAuth();

  const [mode, setMode] = useState("login");

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [signupData, setSignupData] = useState(null);

  if (!loading && token) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return (
    <div className="w-full h-screen flex bg-[#f5f7ff]">
      {/* LEFT IMAGE */}
      <div className="w-1/2 h-full relative">
        <img
          src={authImage}
          alt="Auth"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-1/2 flex flex-col justify-center items-center">
        {/*  LOGIN  */}
        {step === 1 && mode === "login" && (
          <LoginForm
            setEmail={setEmail}
            onOtpSent={() => setStep(2)}
            switchMode={() => {
              setMode("signup");
              setStep(1); 
              setSignupData(null); 
            }}
          />
        )}

        {/*  SIGNUP  */}
        {step === 1 && mode === "signup" && (
          <SignupForm
            setEmail={setEmail}
            setSignupData={setSignupData}
            onOtpSent={() => setStep(2)}
            switchMode={() => {
              setMode("login");
              setStep(1); 
              setSignupData(null);
            }}
          />
        )}

        {/*  OTP VERIFY  */}
        {step === 2 && (
          <OtpVerify
            email={email}
            mode={mode} 
            signupData={signupData}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;
