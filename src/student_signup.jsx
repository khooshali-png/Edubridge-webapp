 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// FIXED: Changed "../firebase" to "./firebase"
import { auth, db } from "./firebase";

const TEAL = "#2a9d8f";
const MUT  = "#6b8a7a";
const TXT  = "#e8f0ec";

export default function StudentSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", year: "", course: "B.Tech Computer Science", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(""); };

  const handleSignup = async () => {
    const { name, email, year, course, password } = form;
    if (!name || !email || !year || !password) { setError("Please fill in all required fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid:        user.uid,
        name,
        email,
        role:       "student",
        course,
        year:       Number(year),
        studentId:  "STU-" + Math.floor(Math.random() * 90000 + 10000),
        createdAt:  serverTimestamp(),
        loginTimestamps: [],
        lastLogin:  null,
        loginHour:  null,
      });

      localStorage.setItem("uid",  user.uid);
      localStorage.setItem("user", JSON.stringify({ uid: user.uid, name, email, role: "student", course, year }));

      setSuccess(true);
      setTimeout(() => navigate("/student"), 1500);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("This email is already registered. Please login.");
      else setError("Signup failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "#0f1a14", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", color: TXT }}>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 480, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", boxSizing: "border-box" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", color: TEAL, fontSize: 22 }}>←</button>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Create Student Account</h2>
        <div style={{ width: 24 }} />
      </div>

      {/* Banner */}
      <div style={{ width: "100%", maxWidth: 480, height: 180, background: "linear-gradient(135deg, #1a3a2e, #2a5a44)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>🎓</div>

      <div style={{ width: "100%", maxWidth: 480, padding: "28px 24px 40px", boxSizing: "border-box" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 900, textAlign: "center" }}>Join Your School Community</h1>
        <p style={{ margin: "0 0 28px", fontSize: 14, color: MUT, textAlign: "center" }}>Get started with your learning journey today.</p>

        {success && <div style={{ background: "#1a3a2a", border: `1px solid ${TEAL}44`, borderRadius: 12, padding: "14px", marginBottom: 16, textAlign: "center", color: TEAL, fontWeight: 700 }}>✅ Account created! Redirecting...</div>}
        {error   && <div style={{ background: "#3a1010", border: "1px solid #e76f5144", borderRadius: 12, padding: "12px 14px", marginBottom: 16, color: "#e76f51", fontSize: 13, fontWeight: 600 }}>⚠️ {error}</div>}

        <label style={S.label}>Full Name</label>
        <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Enter your full name" style={S.input} />

        <label style={S.label}>Email Address</label>
        <input value={form.email} onChange={e => update("email", e.target.value)} placeholder="yourname@school.edu" type="email" style={S.input} />

        <label style={S.label}>Grade Level</label>
        <div style={{ position: "relative", marginBottom: 18 }}>
          <select value={form.year} onChange={e => update("year", e.target.value)}
            style={{ ...S.input, marginBottom: 0, appearance: "none", cursor: "pointer", color: form.year ? TXT : MUT }}>
            <option value="" disabled>Select Grade</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: MUT }}>▾</span>
        </div>

        <label style={S.label}>Course Name</label>
        <input value={form.course} onChange={e => update("course", e.target.value)} placeholder="e.g. B.Tech Computer Science" style={S.input} />

        <label style={S.label}>Password</label>
        <div style={{ position: "relative", marginBottom: 8 }}>
          <input value={form.password} onChange={e => update("password", e.target.value)}
            type={showPass ? "text" : "password"} placeholder="Create a password"
            style={{ ...S.input, marginBottom: 0, paddingRight: 48 }} />
          <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: MUT }}>
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
        <p style={{ margin: "0 0 24px", fontSize: 12, color: MUT }}>Must be at least 8 characters.</p>

        <button onClick={handleSignup} disabled={loading || success}
          style={{ width: "100%", padding: "16px", background: TEAL, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", opacity: loading ? 0.7 : 1, boxShadow: `0 4px 20px ${TEAL}44` }}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: MUT }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/")} style={{ color: TEAL, fontWeight: 700, cursor: "pointer" }}>Login</span>
        </p>
      </div>
    </div>
  );
}

const S = {
  label: { display: "block", fontSize: 14, fontWeight: 700, color: TXT, marginBottom: 8 },
  input: { width: "100%", padding: "14px 16px", background: "#1e2e28", border: "1.5px solid #2a3a30", borderRadius: 12, fontSize: 14, color: "#e8f0ec", outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 18 },
};