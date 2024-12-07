import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserData } from "../../contexts/userDataContext";
const Auth = () => {
  const [email, setEmail] = useState("");
  const userData = useUserData();
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const handleEmailSubmit = async () => {
    // Call the backend API to send OTP
    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/auth/sendEmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    if (response.ok) {
      const token = (await response.json()).otpToken;
      setToken(token);
      setStep(2);
    }
  };

  const handleOtpSubmit = async () => {
    // Call the backend API to verify OTP
    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/auth/verifyOtp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, otpToken: token }),
      }
    );
    if (response.ok) {
      const idToken = (await response.json()).idToken;
      console.log("TOKEN", idToken);
      localStorage.setItem("idToken", idToken);
      userData.setUserData({ idToken });
      navigate("/");
      toast.success("OTP Verified");
    } else {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              Enter your Email
            </h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
              placeholder="Email"
            />
            <button
              onClick={handleEmailSubmit}
              className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
            >
              Submit
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
              placeholder="OTP"
            />
            <button
              onClick={handleOtpSubmit}
              className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
