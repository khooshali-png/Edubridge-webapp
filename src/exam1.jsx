import React from "react";
import { useNavigate } from "react-router-dom";

const P = {
  bg:     "#14171a",
  card:   "#1e242a",
  text:   "#d1d8e0",
  teal:   "#2a9d8f",
  rust:   "#e76f51",
  border: "#2a3340",
  muted:  "#6b7f90",
};

export default function Exam1() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: P.bg, minHeight: "100vh", color: P.text, display: "flex", flexDirection: "column" }}>

      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", background: P.card, borderBottom: `1px solid ${P.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "#1a3a2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={P.teal}>
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-1 13L5 12.5v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3l-6 3.5z"/>
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 900, color: P.text }}>EduBridge</span>
        </div>

        {/* Right: icons + user */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ width: 38, height: 38, borderRadius: 10, background: P.bg, border: `1px solid ${P.border}`, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>🔔</button>
          <button style={{ width: 38, height: 38, borderRadius: 10, background: P.bg, border: `1px solid ${P.border}`, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>⚙️</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 14px", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: P.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>NS</div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: P.text }}>Namrata Sharma</p>
              <p style={{ margin: 0, fontSize: 10, color: P.muted }}>Computer Science</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PAGE TITLE ── */}
      <div style={{ padding: "28px 40px 0" }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: P.text }}>Exams</h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: P.muted }}>Manage your upcoming and past examination schedules.</p>
      </div>

      {/* ── CENTER EMPTY STATE ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", minHeight: 500 }}>

        {/* Illustration */}
        <div style={{ width: 190, height: 165, background: "#162820", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 36, position: "relative", boxShadow: `0 8px 48px ${P.teal}18` }}>
          {/* Clipboard icon */}
          <div style={{ width: 82, height: 82, background: P.teal + "18", borderRadius: 18, border: `2px solid ${P.teal}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="3" width="14" height="18" rx="2" stroke={P.teal} strokeWidth="1.8" fill={P.teal + "22"}/>
              <path d="M9 3h6v2H9V3z" fill={P.teal} opacity=".6"/>
              <path d="M8 10h8M8 14h5" stroke={P.teal} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          {/* Green check circle */}
          <div style={{ position: "absolute", bottom: 26, right: 26, width: 34, height: 34, borderRadius: "50%", background: P.teal, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${P.teal}99` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* NO EXAMS NOW */}
        <h2 style={{ margin: "0 0 16px", fontSize: 28, fontWeight: 900, color: P.text, letterSpacing: 3, textTransform: "uppercase" }}>
          NO EXAMS NOW
        </h2>
        <p style={{ margin: "0 0 36px", fontSize: 14, color: P.muted, textAlign: "center", maxWidth: 430, lineHeight: 2 }}>
          You have no upcoming or ongoing exams at this moment.<br />
          Your schedule is clear! Take this time to catch up on<br />
          assignments or review your previous course materials.
        </p>

        {/* Back to Dashboard button only */}
        <button onClick={() => navigate("/student")}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 32px", background: P.teal, border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px ${P.teal}55` }}>
          🏠 Back to Dashboard
        </button>

        {/* Divider + Stats */}
        <div style={{ marginTop: 52, width: "100%", maxWidth: 480 }}>
          <div style={{ height: 1, background: P.border, marginBottom: 36 }} />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 42, fontWeight: 900, color: P.text }}>0</p>
              <p style={{ margin: "6px 0 0", fontSize: 11, fontWeight: 700, color: P.muted, letterSpacing: 1.5, textTransform: "uppercase" }}>Pending</p>
            </div>
            <div style={{ width: 1, background: P.border }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 42, fontWeight: 900, color: P.text }}>12</p>
              <p style={{ margin: "6px 0 0", fontSize: 11, fontWeight: 700, color: P.muted, letterSpacing: 1.5, textTransform: "uppercase" }}>Completed</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: `1px solid ${P.border}`, padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: 12, color: P.muted }}>© 2024 EduBridge. All exams are subject to university policy.</p>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="#" style={{ fontSize: 12, color: P.muted, textDecoration: "none" }}>Privacy Policy</a>
          <a href="#" style={{ fontSize: 12, color: P.muted, textDecoration: "none" }}>Exam Guidelines</a>
        </div>
      </div>

    </div>
  );
}