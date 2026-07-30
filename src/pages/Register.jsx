import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { AuthStore } from "../context/AuthContext";
import { ProductStore } from "../context/ProductContext";
import { toast } from "react-toastify";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";

/* ── Password Strength Logic ── */
const getPasswordStrength = (password) => {
  if (!password) return null;

  if (password.length < 6) return { score: 1, label: "Weak" };

  let score = 1;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak" };
  if (score <= 4) return { score, label: "Medium" };
  return { score, label: "Strong" };
};

/* bar color via inline style (dynamic — Tailwind can't purge-safe generate these) */
const strengthColor = (label) => {
  if (label === "Weak")   return "#FF4D4D";
  if (label === "Medium") return "#f59e0b";
  if (label === "Strong") return "#C8FF00";
  return "#333";
};

/* label text color class */
const strengthTextColor = (label) => {
  if (label === "Weak")   return "text-[#FF4D4D]";
  if (label === "Medium") return "text-[#f59e0b]";
  if (label === "Strong") return "text-[#C8FF00]";
  return "";
};

/* ──────────────────────────────────────── */
const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [emailExists, setEmailExists]     = useState(false);

  const { register, reset, handleSubmit } = useForm();
  const { registerUser, setRegisterUser, setLoggedIn } = useContext(AuthStore);
  const { clearCart } = useContext(ProductStore);

  const strength = getPasswordStrength(passwordValue);

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

  // Check if email already exists
  const existingUser = registerUser.find((user) => {
    return user.email.toLowerCase() === data.email.toLowerCase();
  });

  if (existingUser) {
    setEmailExists(true);
    return;
  }

  setEmailExists(false);

  // Check confirm password
  if (data.password !== data.confirmPassword) {
    toast.error("Passwords do not match!", {
      position: "bottom-right",
    });
    return;
  }

  const arr = [...registerUser, data];

  setRegisterUser(arr);
  setLoggedIn(data);

  localStorage.setItem("loggedInUser", JSON.stringify(data));
  localStorage.setItem("registeredUser", JSON.stringify(arr));
  clearCart(); // new account always starts with empty cart

  toast.success("Account created! Welcome to SkyMart", {
    position: "bottom-right",
  });

  navigate("/home");
  reset();
};

  /* Bar fills: score 1–5 mapped to 3 bars at thresholds 1, 3, 5 */
  const thresholds = [1, 3, 5];
  const barColor = (i) =>
    strength && strength.score >= thresholds[i]
      ? strengthColor(strength.label)
      : "#333333";

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
          Create account
        </h1>
        <p className="text-[#7a7a7a] text-sm mb-8">
          Join SkyMart and start shopping
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(formSubmit, onInvalid)}>

          {/* ── Email Already Exists Banner ── */}
          {emailExists && (
            <div className="flex items-center gap-2 bg-[#FF4D4D]/10 border border-[#FF4D4D]/50 text-[#FF4D4D] text-sm font-medium rounded-xl px-4 py-3">
              <span className="shrink-0">⚠</span>
              Email already registered!
            </div>
          )}

          {/* Full Name */}
          <div>
            <div className="flex items-center bg-[#272727] border border-[#333] rounded-xl px-4 transition-all duration-200 hover:bg-[#2e2e2e] hover:border-[#444] focus-within:border-[#C8FF00] focus-within:shadow-[0_0_0_3px_rgba(200,255,0,0.08)] focus-within:bg-[#2e2e2e]">
              <span className="text-[#7a7a7a] mr-3 flex items-center shrink-0">
                <User size={18} />
              </span>
              <input
                {...register("name", { required: "Full name is required" })}
                type="text"
                placeholder="Full name"
                autoComplete="name"
                className="flex-1 bg-transparent border-none outline-none text-white text-[0.95rem] py-4 font-[inherit] placeholder:text-[#7a7a7a]"
              />
            </div>
          </div>

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
                  onChange: () => setEmailExists(false),
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
                  onChange: (e) => setPasswordValue(e.target.value),
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
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

            {/* ── Password Strength Bars ── */}
            {passwordValue.length > 0 && strength && (
              <div className="mt-2 px-0.5">
                <div className="flex items-center gap-1.5">
                  {thresholds.map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: barColor(i) }}
                    />
                  ))}
                  <span className={`text-xs font-semibold ml-1 min-w-12 text-right transition-colors duration-300 ${strengthTextColor(strength.label)}`}>
                    {strength.label}
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex items-center bg-[#272727] border border-[#333] rounded-xl px-4 transition-all duration-200 hover:bg-[#2e2e2e] hover:border-[#444] focus-within:border-[#C8FF00] focus-within:shadow-[0_0_0_3px_rgba(200,255,0,0.08)] focus-within:bg-[#2e2e2e]">
              <span className="text-[#7a7a7a] mr-3 flex items-center shrink-0">
                <Lock size={18} />
              </span>
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                className="flex-1 bg-transparent border-none outline-none text-white text-[0.95rem] py-4 font-[inherit] placeholder:text-[#7a7a7a]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-[#7a7a7a] hover:text-[#aaa] cursor-pointer flex items-center p-1 bg-transparent border-none transition-colors duration-200"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-[#C8FF00] hover:bg-[#a8d900] text-[#0D0D0D] font-bold text-base rounded-xl py-4 flex items-center justify-center gap-2 cursor-pointer border-none transition-all duration-200 hover:shadow-[0_6px_24px_rgba(200,255,0,0.25)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Create Account <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-[#7a7a7a]">
          Already have an account?{" "}
          <button
            onClick={() => navigate('/login')}
            className="text-[#C8FF00] font-semibold bg-transparent border-none cursor-pointer hover:opacity-80 hover:underline transition-opacity"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;