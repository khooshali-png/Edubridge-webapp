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

const TABS = ["Pending Assignments", "Completed", "Archived"];

const ASSIGNMENTS = {
  "Pending Assignments": [
    {
      subject: "FGIS",
      topic: "Database Design",
      icon: "🗄️",
      iconBg: "#1a2e2c",
      accentColor: "#2a9d8f",
      title: " ",
      due: "Due Tomorrow, 11:59 PM",
      priority: "High Priority",
      status: "PENDING",
      action: "View Details",
      actionColor: "#2a9d8f",
    },
    {
      subject: "EN",
      topic: "Marketing Strategy",
      icon: "📊",
      iconBg: "#2a1f10",
      accentColor: "#f4a261",
      title: "Unit 2: usage of EN",
      due: "Oct 28, 2023",
      attachments: "2 Attachments",
      status: "IN PROGRESS",
      action: "Continue",
      actionColor: "#2a9d8f",
    },
    {
      subject: "BI",
      topic: "Professional Skills",
      icon: "🌐",
      iconBg: "#1a1f2e",
      accentColor: "#457b9d",
      title: "Unit 1: NEW TO BI",
      due: "Oct 30, 2023",
      status: "SUBMITTED",
      action: "Review",
      actionColor: "#6b7f90",
    },
  ],
  "Completed": [
    {
      subject: "AI",
      topic: "Introduction",
      icon: "🗄️",
      iconBg: "#1a2e2c",
      accentColor: "#2a9d8f",
      title: "Unit 1: Introduction to AI",
      due: "Oct 10, 2023",
      status: "SUBMITTED",
      action: "Review",
      actionColor: "#6b7f90",
    },
    {
      subject: "EVS",
      topic: "Ecology",
      icon: "🌱",
      iconBg: "#1a2e1a",
      accentColor: "#52b788",
      title: "Unit 1: Environment & Ecology",
      due: "Oct 5, 2023",
      status: "SUBMITTED",
      action: "Review",
      actionColor: "#6b7f90",
    },
  ],
  "Archived": [
    {
      subject: "CSD",
      topic: "Basics",
      icon: "🌐",
      iconBg: "#1a1f2e",
      accentColor: "#457b9d",
      title: "Semester 3 — Communication Fundamentals",
      due: "Aug 15, 2023",
      status: "SUBMITTED",
      action: "View",
      actionColor: "#6b7f90",
    },
  ],
};

const STATUS_STYLE = {
  "PENDING":     { bg: "#2a1810", color: "#e76f51", border: "#e76f5144" },
  "IN PROGRESS": { bg: "#1a2e2c", color: "#2a9d8f", border: "#2a9d8f44" },
  "SUBMITTED":   { bg: "#1a2a1a", color: "#52b788", border: "#52b78844" },
};

export default function Homework() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Pending Assignments");

  const assignments = ASSIGNMENTS[activeTab] || [];

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: P.bg, minHeight: "100vh", color: P.text }}>

      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", background: P.card, borderBottom: `1px solid ${P.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        {/* Logo + back */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#1a3a2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={P.teal}>
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-1 13L5 12.5v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3l-6 3.5z"/>
              </svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: P.text }}>EduBridge</span>
          </div>
          <button onClick={() => navigate("/student")}
            style={{ padding: "7px 16px", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.muted, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            ← Dashboard
          </button>
        </div>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, position: "relative" }}>
            🔔<span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: P.rust, borderRadius: "50%", display: "block" }} />
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>⚙️</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", background: P.bg, borderRadius: 10, border: `1px solid ${P.border}` }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: P.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>NS</div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: P.text }}>Namrata Sharma</p>
              <p style={{ margin: 0, fontSize: 10, color: P.muted }}>Grade 11 · Science</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 32px 60px" }}>

        {/* Page heading */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900, color: P.text, letterSpacing: "-.5px" }}>
            Homework <span style={{ color: P.teal }}>Assignments</span>
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: P.muted }}>Manage and track your academic progress for the semester.</p>
        </div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", borderBottom: `1px solid ${P.border}`, marginBottom: 28, gap: 4 }}>
          {TABS.map(tab => {
            const active = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: "10px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: active ? 700 : 400, color: active ? P.teal : P.muted, borderBottom: active ? `2px solid ${P.teal}` : "2px solid transparent", marginBottom: -1, transition: "all .15s" }}>
                {tab}
                {tab === "Pending Assignments" && (
                  <span style={{ marginLeft: 8, background: P.teal + "22", color: P.teal, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, border: `1px solid ${P.teal}44` }}>
                    {ASSIGNMENTS["Pending Assignments"].length} Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── DUE SOON LABEL ── */}
        {activeTab === "Pending Assignments" && (
          <p style={{ fontSize: 16, fontWeight: 800, color: P.text, marginBottom: 16 }}>
            Due Soon
          </p>
        )}

        {/* ── ASSIGNMENT CARDS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {assignments.map((hw, i) => {
            const ss = STATUS_STYLE[hw.status] || STATUS_STYLE["PENDING"];
            return (
              <div key={i} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: "22px 24px", display: "flex", alignItems: "center", gap: 20, transition: "border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = hw.accentColor + "88"}
                onMouseLeave={e => e.currentTarget.style.borderColor = P.border}
              >
                {/* Icon box */}
                <div style={{ width: 54, height: 54, borderRadius: 12, background: hw.iconBg, border: `1px solid ${hw.accentColor}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {hw.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: hw.accentColor, letterSpacing: 1 }}>{hw.subject}</span>
                    <span style={{ color: P.border }}>•</span>
                    <span style={{ fontSize: 11, color: P.muted }}>{hw.topic}</span>
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: P.text, lineHeight: 1.4 }}>{hw.title}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 12, color: P.muted }}>📅 {hw.due}</span>
                    {hw.priority && (
                      <span style={{ fontSize: 12, color: P.rust, fontWeight: 700 }}>⚠ {hw.priority}</span>
                    )}
                    {hw.attachments && (
                      <span style={{ fontSize: 12, color: P.muted }}>📎 {hw.attachments}</span>
                    )}
                  </div>
                </div>

                {/* Status + Action */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 6, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, letterSpacing: .8 }}>
                      {hw.status}
                    </span>
                  </div>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: hw.actionColor, padding: 0 }}>
                    {hw.action}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {assignments.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: P.muted }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: P.text }}>No assignments here</p>
            <p style={{ fontSize: 13 }}>This section is empty right now.</p>
          </div>
        )}

      </div>
    </div>
  );
}