 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
// FIXED: Changed "../firebase" to "./firebase"
import { auth, db } from "./firebase";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole]       = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setError("User profile not found. Please sign up first.");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      if (userData.role === "student") {
        const now = new Date();
        const hour = now.getHours();
        await updateDoc(doc(db, "users", user.uid), {
          lastLogin: serverTimestamp(),
          loginHour: hour,
          loginTimestamps: [...(userData.loginTimestamps || []), now.toISOString()].slice(-30),
        });
      }

      localStorage.setItem("uid",  user.uid);
      localStorage.setItem("user", JSON.stringify({ ...userData, uid: user.uid }));

      if (userData.role === "student") navigate("/student");
      else navigate("/teacher");

    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("Login failed: " + err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div style={S.page}>
      <div style={S.bgPattern} />
      <div style={S.card}>
        <h1 style={S.title}>Welcome To EduBridge</h1>
        <p style={S.subtitle}>Sign in to continue</p>

        <div style={S.toggleWrap}>
          <button onClick={() => setRole("student")} style={{ ...S.toggleBtn, ...(role === "student" ? S.toggleActive : S.toggleInactive) }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={role === "student" ? "#fff" : "#a0b8b0"} style={{ flexShrink: 0 }}>
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-1 13L5 12.5v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3l-6 3.5z"/>
            </svg>
            Student
          </button>
          <button onClick={() => setRole("teacher")} style={{ ...S.toggleBtn, ...(role === "teacher" ? S.toggleActive : S.toggleInactive) }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={role === "teacher" ? "#fff" : "#a0b8b0"} style={{ flexShrink: 0 }}>
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/>
            </svg>
            Teacher
          </button>
        </div>

        {error && <div style={S.errorBox}>⚠️ {error}</div>}

        <label style={S.label}>Email</label>
        <div style={S.inputWrap}>
          <svg style={S.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="#7aada0">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSignIn()}
            placeholder="Enter your email" style={S.input} />
        </div>

        <label style={S.label}>Password</label>
        <div style={S.inputWrap}>
          <svg style={S.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="#7aada0">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          <input type={showPass ? "text" : "password"} value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSignIn()}
            placeholder="Enter your password" style={{ ...S.input, paddingRight: 44 }} />
          <button onClick={() => setShowPass(!showPass)} style={S.eyeBtn}>
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>

        <div style={S.rememberRow}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <div onClick={() => setRemember(!remember)}
              style={{ width: 18, height: 18, border: "2px solid #4a7a6a", borderRadius: 4, background: remember ? "#2a9d6e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {remember && <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>}
            </div>
            <span style={{ fontSize: 14, color: "#c8dcd4" }}>Remember me</span>
          </label>
          <a href="#" style={{ fontSize: 14, color: "#2adb8e", textDecoration: "none", fontWeight: 600 }}>Forgot password?</a>
        </div>

        <button onClick={handleSignIn} disabled={loading}
          style={{ ...S.signInBtn, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Signing in..." : `Sign In as ${role === "student" ? "Student" : "Teacher"}`}
        </button>

        <p style={S.signupText}>
          Don't have an account?{" "}
          <span onClick={() => navigate(role === "student" ? "/signup-student" : "/signup-teacher")}
            style={{ color: "#2adb8e", fontWeight: 700, cursor: "pointer" }}>
            Sign up as {role === "student" ? "Student" : "Teacher"}
          </span>
        </p>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 60% 40%, #1a4a3a 0%, #0d2a20 40%, #081a12 100%)", fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden" },
  bgPattern: { position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle, #2a6e5c22 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none", zIndex: 0 },
  card: { position: "relative", zIndex: 1, background: "rgba(15, 40, 28, 0.85)", backdropFilter: "blur(20px)", borderRadius: 24, padding: "40px 36px 36px", width: "100%", maxWidth: 400, boxShadow: "0 24px 80px rgba(0,0,0,.5)", border: "1px solid rgba(42,110,92,.3)" },
  title: { fontSize: 30, fontWeight: 900, color: "#ffffff", textAlign: "center", margin: "0 0 6px" },
  subtitle: { fontSize: 14, color: "#7aada0", textAlign: "center", margin: "0 0 28px" },
  toggleWrap: { display: "flex", background: "rgba(10,30,20,.6)", borderRadius: 12, padding: 4, gap: 4, marginBottom: 24, border: "1px solid rgba(42,110,92,.25)" },
  toggleBtn: { flex: 1, padding: "10px 0", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  toggleActive: { background: "#2a9d6e", color: "#fff", boxShadow: "0 2px 12px rgba(42,157,110,.4)" },
  toggleInactive: { background: "transparent", color: "#7aada0" },
  errorBox: { background: "#3a1010", border: "1px solid #e76f5144", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#e76f51", fontWeight: 600 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#c8dcd4", marginBottom: 8 },
  inputWrap: { position: "relative", marginBottom: 18 },
  inputIcon: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" },
  input: { width: "100%", padding: "13px 14px 13px 44px", background: "rgba(10,30,20,.7)", border: "1.5px solid rgba(42,110,92,.4)", borderRadius: 12, fontSize: 14, color: "#e8f0ec", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  eyeBtn: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16 },
  rememberRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  signInBtn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #2a9d6e, #1e7a54)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(42,157,110,.45)" },
  signupText: { textAlign: "center", marginTop: 20, fontSize: 14, color: "#7aada0" },
};