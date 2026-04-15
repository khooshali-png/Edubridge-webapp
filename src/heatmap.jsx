import React, { useState } from "react";
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

const STUDENTS = [
  { name: "Namrata Sharma",   attendance: [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] }, // 95% Excellent
  { name: "Ankur Verma",      attendance: [0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0] }, // 40% High Risk
  { name: "Rishabh Singh",    attendance: [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1] }, // 90% Excellent
  { name: "Sakshi Gupta",     attendance: [0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0] }, // 35% High Risk
  { name: "Rahul Deshmukh",   attendance: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1] }, // 95% Excellent
  { name: "Ishika Agarwal",   attendance: [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1] }, // 95% Excellent
  { name: "Aryan Tripathi",   attendance: [1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1] }, // 90% Excellent
  { name: "Tanya Roy",        attendance: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] }, // 100% Excellent
  { name: "Neha Rathore",     attendance: [1,0,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1] }, // 65% Medium Risk
  { name: "Karan Joshi",      attendance: [1,1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1] }, // 70% Medium Risk
  { name: "Pooja Mehta",      attendance: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] }, // 100% Excellent
  { name: "Dev Sharma",       attendance: [1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0] }, // 60% Medium Risk
];

const DAYS = Array.from({ length: 20 }, (_, i) => `D${i + 1}`);
const WEEKS = ["W1", "W1", "W1", "W1", "W1", "W2", "W2", "W2", "W2", "W2", "W3", "W3", "W3", "W3", "W3", "W4", "W4", "W4", "W4", "W4"];

function getRisk(att) {
  const pct = (att.filter(Boolean).length / att.length) * 100;
  if (pct >= 90) return { label: "Excellent",    color: P.teal,    bg: "#1a3a2a" };
  if (pct >= 80) return { label: "Low Risk",     color: "#f4a261", bg: "#2a1f10" };
  if (pct >= 75) return { label: "Medium Risk",  color: P.rust,    bg: "#2a1210" };
  return              { label: "High Risk",     color: "#c0392b", bg: "#3a0a0a" };
}

function cellColor(val) {
  return val === 1 ? "#2a6e5c" : "#8b2a2a";
}

export default function Heatmap() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = STUDENTS.filter(s => {
    if (filter === "all") return true;
    const risk = getRisk(s.attendance).label.toLowerCase().replace(" ", "-");
    return risk === filter;
  });

  const selectedStudent = selected !== null ? STUDENTS[selected] : null;

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: P.bg, minHeight: "100vh", color: P.text }}>

      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", background: P.card, borderBottom: `1px solid ${P.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => navigate("/teacher")} style={{ padding: "7px 16px", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.muted, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back</button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.text }}>🌡️ Performance Heatmap</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["all","All Students"],["excellent","Excellent"],["high-risk","High Risk"],["medium-risk","Medium Risk"]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${filter === val ? P.teal : P.border}`, background: filter === val ? P.teal + "22" : "transparent", color: filter === val ? P.teal : P.muted, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 28px" }}>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total Students", value: STUDENTS.length, color: P.teal },
            { label: "Avg Attendance", value: Math.round(STUDENTS.reduce((a,s) => a + s.attendance.filter(Boolean).length/s.attendance.length*100, 0)/STUDENTS.length) + "%", color: P.teal },
            { label: "High Risk", value: STUDENTS.filter(s => getRisk(s.attendance).label === "High Risk").length, color: "#c0392b" },
            { label: "Excellent", value: STUDENTS.filter(s => getRisk(s.attendance).label === "Excellent").length, color: "#52b788" },
          ].map(c => (
            <div key={c.label} style={{ background: P.card, borderRadius: 12, padding: "16px 20px", border: `1px solid ${P.border}` }}>
              <p style={{ margin: 0, fontSize: 11, color: P.muted, fontWeight: 700, letterSpacing: 1 }}>{c.label.toUpperCase()}</p>
              <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 900, color: c.color }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div style={{ background: P.card, borderRadius: 14, padding: 20, border: `1px solid ${P.border}`, marginBottom: 20, overflowX: "auto" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 800, color: P.text }}>20-Day Attendance Grid</h3>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "160px repeat(20,28px)", gap: 3, marginBottom: 4 }}>
            <div />
            {DAYS.map((d, i) => (
              <div key={i} style={{ fontSize: 9, fontWeight: 700, color: P.muted, textAlign: "center", paddingBottom: 4 }}>{d}</div>
            ))}
          </div>

          {/* Student rows */}
          {filtered.map((s, si) => {
            const risk = getRisk(s.attendance);
            const pct = Math.round(s.attendance.filter(Boolean).length / s.attendance.length * 100);
            return (
              <div key={si} onClick={() => setSelected(selected === si ? null : si)}
                style={{ display: "grid", gridTemplateColumns: "160px repeat(20,28px)", gap: 3, marginBottom: 3, cursor: "pointer", borderRadius: 6, padding: "2px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: P.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</span>
                </div>
                {s.attendance.map((val, di) => (
                  <div key={di} style={{ width: 26, height: 20, borderRadius: 3, background: cellColor(val), opacity: 0.85 }} />
                ))}
              </div>
            );
          })}
        </div>

        {/* Selected student detail */}
        {selectedStudent && (
          <div style={{ background: P.card, borderRadius: 14, padding: 20, border: `1px solid ${P.teal}55` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: P.text }}>{selectedStudent.name}</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: P.muted, fontSize: 18 }}>✕</button>
            </div>
            {(() => {
              const risk = getRisk(selectedStudent.attendance);
              const pct = Math.round(selectedStudent.attendance.filter(Boolean).length / selectedStudent.attendance.length * 100);
              return (
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ background: risk.bg, border: `1px solid ${risk.color}44`, borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: risk.color }}>{pct}%</p>
                    <p style={{ margin: "4px 0 0", fontSize: 11, fontWeight: 700, color: risk.color }}>{risk.label}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: P.muted }}>Present: <strong style={{ color: P.teal }}>{selectedStudent.attendance.filter(Boolean).length} / {selectedStudent.attendance.length} days</strong></p>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {selectedStudent.attendance.map((val, i) => (
                        <div key={i} style={{ width: 20, height: 20, borderRadius: 3, background: cellColor(val), fontSize: 9, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
}