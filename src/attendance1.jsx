import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const P = {
  bg:     "#14171a",
  card:   "#1e242a",
  text:   "#d1d8e0",
  teal:   "#2a9d8f",
  rust:   "#e76f51",
  border: "#2a3340",
  muted:  "#6b7f90",
};

const SUBJECTS = ["BI", "CYBER LAWS", "AI", "SOFTWARE QUALITY ASSURANCE", "ENTERPRISE NETWORKING"];

export default function AttendancePage() {
  const navigate = useNavigate();
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const uid = localStorage.getItem("uid")
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ── Real-time: listen for THIS student's attendance ──
  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "attendance"), where("studentUid", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => d.data());
      setRecords(data);
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  // Build summary per subject
  const summary = SUBJECTS.map(sub => {
    const subRecords = records.filter(r => r.subject === sub);
    const present    = subRecords.filter(r => r.status === "present").length;
    const total      = subRecords.length;
    const pct        = total ? Math.round((present / total) * 100) : null;
    return { subject: sub, present, total, pct };
  });

  const totalPresent = records.filter(r => r.status === "present").length;
  const totalClasses = records.length;
  const overall      = totalClasses ? Math.round((totalPresent / totalClasses) * 100) : null;

  // Recent records sorted by date
  const recent = [...records].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: P.bg, minHeight: "100vh", color: P.text }}>

      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", background: P.card, borderBottom: `1px solid ${P.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#1a3a2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={P.teal}><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-1 13L5 12.5v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3l-6 3.5z"/></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900 }}>EduBridge</span>
          </div>
          <button onClick={() => navigate("/student")} style={{ padding: "7px 16px", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.muted, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Dashboard</button>
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>My Attendance</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: P.teal }} />
          <span style={{ fontSize: 12, color: P.teal, fontWeight: 600 }}>Live</span>
        </div>
      </div>

      <div style={{ padding: "28px 36px 60px" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: 48, color: P.muted }}>
            <p style={{ fontSize: 24 }}>⏳</p>
            Loading your attendance...
          </div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: P.muted }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>📋</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: P.text, marginBottom: 8 }}>No Attendance Records Yet</p>
            <p style={{ fontSize: 14 }}>Your attendance will appear here in real-time once your teacher marks it!</p>
          </div>
        ) : (
          <>
            {/* Overall Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Overall Attendance", value: overall !== null ? `${overall}%` : "—", color: overall >= 75 ? P.teal : P.rust, icon: "📊" },
                { label: "Classes Attended",   value: totalPresent, color: P.teal, icon: "✅" },
                { label: "Total Classes",       value: totalClasses, color: "#6a9fd8", icon: "📅" },
              ].map(c => (
                <div key={c.label} style={{ background: P.card, borderRadius: 14, padding: "20px 22px", border: `1px solid ${P.border}` }}>
                  <p style={{ margin: "0 0 8px", fontSize: 13, color: P.muted }}>{c.icon} {c.label}</p>
                  <p style={{ margin: 0, fontSize: 32, fontWeight: 900, color: c.color }}>{c.value}</p>
                </div>
              ))}
            </div>

            {/* Per Subject */}
            <div style={{ background: P.card, borderRadius: 16, border: `1px solid ${P.border}`, padding: "20px 24px", marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 18px", fontSize: 17, fontWeight: 800 }}>Subject-wise Breakdown</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {summary.map(s => (
                  <div key={s.subject}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{s.subject}</span>
                      <span style={{ fontSize: 13, color: s.pct === null ? P.muted : s.pct >= 75 ? P.teal : P.rust, fontWeight: 700 }}>
                        {s.pct !== null ? `${s.present}/${s.total} (${s.pct}%)` : "No classes yet"}
                      </span>
                    </div>
                    <div style={{ height: 7, background: P.bg, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s.pct || 0}%`, background: s.pct >= 75 ? P.teal : P.rust, borderRadius: 4, transition: "width .5s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Records */}
            <div style={{ background: P.card, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${P.border}` }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Recent Activity</h3>
              </div>
              {recent.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: i < recent.length - 1 ? `1px solid ${P.border}` : "none", background: i % 2 === 0 ? P.card : "#191f25" }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{r.subject}</span>
                  <span style={{ fontSize: 13, color: P.muted }}>{r.date}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: r.status === "present" ? P.teal + "22" : P.rust + "22", color: r.status === "present" ? P.teal : P.rust, border: `1px solid ${r.status === "present" ? P.teal : P.rust}44` }}>
                    {r.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}