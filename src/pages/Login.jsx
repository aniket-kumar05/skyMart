import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { AuthStore } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";

/* ──────────────────────────────────────── */
const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, reset, handleSubmit } = useForm();
  const { setLoggedIn, registerUser } = useContext(AuthStore);

  /* Single toast for all validation errors */
  const onInvalid = (errors) => {
    const allRequired = Object.values(errors).every((e) => e.type === "required");
    if (allRequired) {
      toast.error("All fields are required", { position: "bottom-right" });
    } else {
      const firstMsg = Object.values(errors)[0]?.message;
      toast.error(firstMsg || "Please fix the form errors", { position: "bottom-right" });
    }
  };

  const formSubmit = (data) => {
    const user = registerUser.find(
      (val) => val.email === data.email && val.password === data.password
    );

    if (!user) {
      toast.error("Invalid email or password", { position: "bottom-right" });
      reset();
      return;
    }

    setLoggedIn(user);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    toast.success("Welcome back!", { position: "bottom-right" });
    navigate("/home");
    reset();
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-4 py-10">

      {/* ── Logo ── */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-11 h-11 bg-[#C8FF00] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(200,255,0,0.15)]">
          <Zap size={22} color="#0D0D0D" fill="#0D0D0D" />
        </div>
        <span className="text-2xl font-semibold tracking-tight text-white">
          Sky<span className="text-[#C8FF00]">Mart</span>
        </span>
      </div>

      {/* ── Card ── */}
      <div className="w-full max-w-120 bg-[#1C1C1C] border border-[#333] rounded-2xl p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="text-[#7a7a7a] text-sm mb-8">
          Sign in to your SkyMart account
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(formSubmit, onInvalid)}>

          {/* Email */}
          <div>
            <div className="flex items-center bg-[#272727] border border-[#333] rounded-xl px-4 transition-all duration-200 hover:bg-[#2e2e2e] hover:border-[#444] focus-within:border-[#C8FF00] focus-within:shadow-[0_0_0_3px_rgba(200,255,0,0.08)] focus-within:bg-[#2e2e2e]">
              <span className="text-[#7a7a7a] mr-3 flex items-center shrink-0">
                <Mail size={18} />
              </span>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                type="email"
                placeholder="Email address"
                autoComplete="email"
                className="flex-1 bg-transparent border-none outline-none text-white text-[0.95rem] py-4 font-[inherit] placeholder:text-[#7a7a7a]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center bg-[#272727] border border-[#333] rounded-xl px-4 transition-all duration-200 hover:bg-[#2e2e2e] hover:border-[#444] focus-within:border-[#C8FF00] focus-within:shadow-[0_0_0_3px_rgba(200,255,0,0.08)] focus-within:bg-[#2e2e2e]">
              <span className="text-[#7a7a7a] mr-3 flex items-center shrink-0">
                <Lock size={18} />
              </span>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters required" },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                className="flex-1 bg-transparent border-none outline-none text-white text-[0.95rem] py-4 font-[inherit] placeholder:text-[#7a7a7a]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-[#7a7a7a] hover:text-[#aaa] cursor-pointer flex items-center p-1 bg-transparent border-none transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-[#C8FF00] hover:bg-[#a8d900] text-[#0D0D0D] font-bold text-base rounded-xl py-4 flex items-center justify-center gap-2 cursor-pointer border-none transition-all duration-200 hover:shadow-[0_6px_24px_rgba(200,255,0,0.25)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-[#7a7a7a]">
          Don't have an account?{" "}
          <button
            onClick={() => navigate('/register')}
            className="text-[#C8FF00] font-semibold bg-transparent border-none cursor-pointer hover:opacity-80 hover:underline transition-opacity"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;