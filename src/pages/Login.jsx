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
    <div style={{ minHeight: "100vh", display: "flex", background: "#0d0d0d", fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: "0 0 50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 56px",
        background: "#0d0d0d",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* subtle grid bg */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 1 }}>
          <div style={{
            width: 44, height: 44,
            background: "#C8FF00",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 24px rgba(200,255,0,0.3)",
          }}>
            <Zap size={22} color="#0d0d0d" fill="#0d0d0d" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.5px" }}>
            Sky<span style={{ color: "#C8FF00" }}>Mart</span>
          </span>
        </div>

        {/* Centre Copy */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "#C8FF00", fontSize: 13, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>
            WELCOME BACK
          </p>
          <h1 style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, margin: "0 0 12px" }}>
            Shop the future.
          </h1>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 800, color: "#C8FF00", lineHeight: 1.1, margin: "0 0 24px" }}>
            Today.
          </h2>
          <p style={{ color: "#6b6b6b", fontSize: 15, lineHeight: 1.7, maxWidth: 320, margin: "0 0 48px" }}>
            Thousands of products, lightning-fast delivery, and prices that make your wallet happy.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { value: "20K+", label: "Products" },
              { value: "50K+", label: "Users" },
              { value: "4.9★", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label} style={{
                flex: 1,
                border: "1px solid #2a2a2a",
                borderRadius: 14,
                padding: "16px 12px",
                background: "rgba(255,255,255,0.02)",
                textAlign: "center",
              }}>
                <p style={{ color: "#C8FF00", fontSize: 20, fontWeight: 700, margin: 0 }}>{stat.value}</p>
                <p style={{ color: "#5a5a5a", fontSize: 12, margin: "4px 0 0", fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom flair */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "#333", fontSize: 12 }}>© 2025 SkyMart. All rights reserved.</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: "0 0 50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 40px",
        background: "#111111",
        borderLeft: "1px solid #1e1e1e",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            Sign in
          </h2>
          <p style={{ color: "#555", fontSize: 14, margin: "0 0 32px" }}>
            Enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit(formSubmit, onInvalid)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Email */}
            <div style={{
              display: "flex", alignItems: "center",
              background: "#1a1a1a", border: "1px solid #2a2a2a",
              borderRadius: 12, padding: "0 16px",
              transition: "border-color 0.2s",
            }}
              onFocus={() => {}} // focus styles via CSS vars not needed here
            >
              <Mail size={16} color="#555" style={{ flexShrink: 0, marginRight: 12 }} />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                })}
                type="email"
                placeholder="Email address"
                autoComplete="email"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "#fff", fontSize: 14, padding: "15px 0", fontFamily: "inherit",
                }}
                onFocus={(e) => e.target.closest("div").style.borderColor = "#C8FF00"}
                onBlur={(e) => e.target.closest("div").style.borderColor = "#2a2a2a"}
              />
            </div>

            {/* Password */}
            <div style={{
              display: "flex", alignItems: "center",
              background: "#1a1a1a", border: "1px solid #2a2a2a",
              borderRadius: 12, padding: "0 16px",
            }}>
              <Lock size={16} color="#555" style={{ flexShrink: 0, marginRight: 12 }} />
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "#fff", fontSize: 14, padding: "15px 0", fontFamily: "inherit",
                }}
                onFocus={(e) => e.target.closest("div").style.borderColor = "#C8FF00"}
                onBlur={(e) => e.target.closest("div").style.borderColor = "#2a2a2a"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: 4, display: "flex" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                marginTop: 8,
                width: "100%",
                background: "#C8FF00",
                color: "#0d0d0d",
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                borderRadius: 12,
                padding: "15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#b8ef00";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(200,255,0,0.3)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#C8FF00";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Sign in <ArrowRight size={17} />
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#555" }}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#C8FF00", fontWeight: 600, fontSize: 13, fontFamily: "inherit",
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
            >
              Create one
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #444; }
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-right { flex: 1 !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;