import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const TEAL = "#2a9d8f";
const MUT  = "#8aaba0";
const BDR  = "#dde8e4";

export default function TeacherSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", department: "", school: "EduBridge University", teacher_id: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(""); };

  const handleSignup = async () => {
    const { name, email, department, password } = form;
    if (!name || !email || !department || !password) { setError("Please fill in all required fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid:        user.uid,
        name,
        email,
        role:       "teacher",
        department,
        school:     form.school,
        teacherId:  form.teacher_id || "T-" + Math.floor(Math.random() * 90000 + 10000),
        createdAt:  serverTimestamp(),
      });

      localStorage.setItem("uid",  user.uid);
      localStorage.setItem("user", JSON.stringify({ uid: user.uid, name, email, role: "teacher", department }));

      setSuccess(true);
      setTimeout(() => navigate("/teacher"), 1500);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("This email is already registered. Please login.");
      else setError("Signup failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "#f0f4f2", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: "36px 32px 32px", width: "100%", maxWidth: 420, boxShadow: "0 8px 40px rgba(0,0,0,.12)" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: "#e8f4f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={TEAL}><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-1 13L5 12.5v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3l-6 3.5z"/></svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#1a2a24" }}>EduBridge</span>
        </div>

        <h1 style={{ margin: "0 0 8px", fontSize: 30, fontWeight: 900, color: "#c8d4d0", lineHeight: 1.2 }}>Create Teacher Account</h1>
        <p style={{ margin: "0 0 28px", fontSize: 15, color: "#4a6a5a", fontWeight: 500 }}>Please provide your professional credentials to begin.</p>

        {success && <div style={{ background: "#e8f4f0", border: `1px solid ${TEAL}44`, borderRadius: 12, padding: "14px", marginBottom: 16, textAlign: "center", color: TEAL, fontWeight: 700 }}>✅ Account created! Redirecting...</div>}
        {error   && <div style={{ background: "#fef0ee", border: "1px solid #e76f5144", borderRadius: 12, padding: "12px 14px", marginBottom: 16, color: "#e74c3c", fontSize: 13, fontWeight: 600 }}>⚠️ {error}</div>}

        <label style={S.label}>Full Name</label>
        <div style={S.inputWrap}>
          <span style={S.icon}>👤</span>
          <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Dr. Jane Smith" style={S.input} />
        </div>

        <label style={S.label}>Work Email</label>
        <div style={S.inputWrap}>
          <span style={S.icon}>✉️</span>
          <input value={form.email} onChange={e => update("email", e.target.value)} placeholder="jane.smith@school.edu" type="email" style={S.input} />
        </div>

        <label style={S.label}>Department / Primary Subject</label>
        <div style={{ ...S.inputWrap, position: "relative" }}>
          <span style={S.icon}>📚</span>
          <select value={form.department} onChange={e => update("department", e.target.value)}
            style={{ ...S.input, appearance: "none", cursor: "pointer", color: form.department ? "#1a2a24" : MUT }}>
            <option value="" disabled>Select your department</option>
            <option>Computer Science</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>English</option>
            <option>History</option>
            <option>Biology</option>
            <option>Commerce</option>
          </select>
          <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: MUT, fontSize: 12 }}>▾</span>
        </div>

        <label style={S.label}>School Name</label>
        <div style={S.inputWrap}>
          <span style={S.icon}>🏫</span>
          <input value={form.school} onChange={e => update("school", e.target.value)} placeholder="East Side High School" style={S.input} />
        </div>

        <label style={S.label}>Employee ID <span style={{ color: MUT, fontWeight: 400 }}>(Optional)</span></label>
        <div style={S.inputWrap}>
          <span style={S.icon}>🪪</span>
          <input value={form.teacher_id} onChange={e => update("teacher_id", e.target.value)} placeholder="EID-123456" style={S.input} />
        </div>

        <label style={S.label}>Password</label>
        <div style={{ ...S.inputWrap, position: "relative" }}>
          <span style={S.icon}>🔒</span>
          <input value={form.password} onChange={e => update("password", e.target.value)}
            type={showPass ? "text" : "password"} placeholder="••••••••"
            style={{ ...S.input, paddingRight: 48 }} />
          <button onClick={() => setShowPass(!showPass)}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: MUT }}>
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
        <p style={{ margin: "-12px 0 20px", fontSize: 12, color: MUT }}>Must be at least 8 characters.</p>

        <button onClick={handleSignup} disabled={loading || success}
          style={{ width: "100%", padding: "16px", background: TEAL, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", opacity: loading ? 0.7 : 1, boxShadow: `0 4px 20px ${TEAL}44` }}>
          {loading ? "Creating Account..." : "Create My Account →"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 8px" }}>
          <div style={{ flex: 1, height: 1, background: BDR }} />
          <span style={{ fontSize: 13, color: MUT, whiteSpace: "nowrap" }}>Already have an account?</span>
          <div style={{ flex: 1, height: 1, background: BDR }} />
        </div>
        <p style={{ textAlign: "center", margin: "8px 0 20px" }}>
          <span onClick={() => navigate("/")} style={{ fontSize: 14, color: MUT, cursor: "pointer", fontWeight: 600 }}>Login to Educator Portal</span>
        </p>

        <p style={{ textAlign: "center", fontSize: 12, color: "#aabab5", margin: 0 }}>
          By signing up, you agree to our <a href="#" style={{ color: TEAL }}>Terms of Service</a> and <a href="#" style={{ color: TEAL }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

const S = {
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#6a8a80", marginBottom: 6 },
  inputWrap: { position: "relative", marginBottom: 16 },
  icon: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" },
  input: { width: "100%", padding: "13px 14px 13px 42px", background: "#1e2e28", border: "1.5px solid #2a3a30", borderRadius: 12, fontSize: 14, color: "#e8f0ec", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
};