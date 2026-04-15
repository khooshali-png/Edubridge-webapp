import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const SIDEBAR_ITEMS = [
  
  { icon: "📊", label: "Analytics", active: true },
  { icon: "📚", label: "Classes" },
   
  { icon: "👥", label: "Student Attendance" },
  { icon: "🧠", label: "Burnout Predictor" },
 
];

const ATTENDANCE_GRID = [
  [1,1,1,1,1, 1,1,0,1,1, 1,1,1,1,0, 2,2,1,1,1],
  [1,1,1,1,0, 1,1,1,1,1, 0,1,1,1,1, 1,1,1,0,1],
  [1,1,0,1,1, 1,0,1,1,1, 1,1,1,0,1, 1,1,1,1,0],
  [1,1,1,0,1, 0,1,1,1,1, 1,1,1,1,1, 0,0,1,1,1],
  [1,1,1,1,1, 1,1,1,0,1, 0,1,1,1,1, 1,1,0,0,2],
];

const COL_LABELS = ["1","1U","31","10","7","5","10","16","7","8","5","F","S","1","2","3","4","8","9","10"];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Analytics");
  const donutRef   = useRef(null);
  const donut2Ref  = useRef(null);
  const donutInst  = useRef(null);
  const donut2Inst = useRef(null);

  useEffect(() => {
    const make = (ref, inst, data, colors) => {
      if (!ref.current) return;
      if (inst.current) inst.current.destroy();
      inst.current = new Chart(ref.current, {
        type: "doughnut",
        data: { datasets: [{ data, backgroundColor: colors, borderWidth: 0, cutout: "74%" }] },
        options: { responsive: false, plugins: { legend: { display: false } } },
      });
    };
    make(donutRef,  donutInst,  [75, 25], ["#2a6e5c", "#1a2e28"]);
    make(donut2Ref, donut2Inst, [92,  8], ["#c17f2a", "#2a1f10"]);
    return () => { donutInst.current?.destroy(); donut2Inst.current?.destroy(); };
  }, []);

  const cellBg = (v) => v === 1 ? "#2a6e5c" : v === 2 ? "#c17f2a" : "#8b2a2a";

  const handleMenu = (label) => {
    setActiveMenu(label);
    if (label === "Student Attendance") navigate("/attendance");
    if (label === "Dashboard") navigate("/teacher");
    if (label === "Burnout Predictor") navigate("/burnout");
    if (label === "Classes") navigate("/schedule");
  };

  return (
    <div style={S.page}>

      {/* ── LEFT SIDEBAR ── */}
      <div style={S.sidebar}>
        {/* Logo */}
        <div style={S.sideLogoWrap}>
          <div style={S.sideLogoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#a8d5c2">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-1 13L5 12.5v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3l-6 3.5z"/>
            </svg>
          </div>
          <span style={S.sideBrand}>EduBridge</span>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "8px 0" }}>
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activeMenu === item.label;
            return (
              <button key={item.label + item.icon}
                onClick={() => handleMenu(item.label)}
                style={{
                  ...S.sideItem,
                  background: isActive ? "#1e3d30" : "transparent",
                  borderLeft: isActive ? "3px solid #4ade80" : "3px solid transparent",
                  color: isActive ? "#a8d5c2" : "#5a8a78",
                }}>
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button onClick={() => navigate("/")} style={S.logoutBtn}>
          ➤ <span style={{ fontSize: 13 }}>Logout</span>
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={S.main}>

        {/* Top bar */}
        <div style={S.topBar}>
          <div />
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>🔔</button>
            <div style={S.avatar}>SJ</div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={S.content}>

          {/* ── DROPOUT RISK ENGINE ── */}
          <div style={S.riskCard}>
            {/* Left: Class Average */}
            <div style={S.riskStat}>
              <p style={S.statLabel}>CLASS AVERAGE</p>
              <p style={S.statBig}>84.2%</p>
              <p style={S.statSub}>(+ 2.4% vs last month)</p>
            </div>

            {/* Center: Risk Engine */}
            <div style={{ flex: 1 }}>
              
              
              <div ></div>
            </div>
          </div>

          {/* ── DIGITAL DIVIDE MAPPING ── */}
          <div style={{ ...S.card, background: "#3a1820" }}>
            <h2 style={S.cardTitle}>Digital Divide Mapping</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 16, flexWrap: "wrap" }}>
              {/* Legend */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[{ c: "#2a6e5c", l: "Present" }, { c: "#6b4c11", l: "Rate · High Alert" }].map(i => (
                  <div key={i.l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: i.c }} />
                    <span style={{ fontSize: 13, color: "#a8bfb5" }}>{i.l}</span>
                  </div>
                ))}
              </div>

              {/* Donut 1 - Connectivity */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <p style={S.donutLabel}>CONNECTIVITY LEVELS</p>
                  <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto" }}>
                    <canvas ref={donutRef} width={100} height={100} />
                    <div style={S.donutCenter}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "#e8f0ec" }}>75%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#7a9e90", margin: "0 0 4px" }}>Mobile Only</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#e8f0ec", margin: 0 }}>2%</p>
                </div>
              </div>

              {/* Donut 2 - Device Shared */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <p style={S.donutLabel}>DEVICE SHARED</p>
                  <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto" }}>
                    <canvas ref={donut2Ref} width={100} height={100} />
                    <div style={S.donutCenter}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "#e8f0ec" }}>92%</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#7a9e90" }}>Stable</p>
              </div>
            </div>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 14 }}>

            
            {/* Attendance Tracker */}
            <div style={S.card}>
              <h2 style={S.cardTitle}>Attendance Tracker</h2>
              <div style={{ marginTop: 12 }}>
                {/* Col labels */}
                <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
                  {COL_LABELS.map((l, i) => (
                    <div key={i} style={{ width: 24, fontSize: 8, color: "#7a9e90", textAlign: "center", flexShrink: 0 }}>{l}</div>
                  ))}
                </div>
                {/* Grid */}
                {ATTENDANCE_GRID.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                    {row.map((val, ci) => (
                      <div key={ci} style={{
                        width: 24, height: 24, borderRadius: 4,
                        background: cellBg(val), flexShrink: 0,
                      }} />
                    ))}
                  </div>
                ))}
                {/* Legend */}
                <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                  {[{ c: "#2a6e5c", l: "Present" }, { c: "#c17f2a", l: "Late" }, { c: "#8b2a2a", l: "Excused Absence" }].map(i => (
                    <div key={i.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: i.c }} />
                      <span style={{ fontSize: 10, color: "#7a9e90" }}>{i.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ── ACTION BUTTONS ── */}
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <button onClick={() => navigate("/attendance")} style={S.actionBtn}>
              ✅ Mark Attendance
            </button>
            <button onClick={() => navigate("/heatmap")} style={{ ...S.actionBtn, background: "none", border: "1.5px solid #2a6e5c", color: "#a8d5c2" }}>
              🌡️ Performance Heatmap
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

const S = {
  page:        { display: "flex", fontFamily: "'Segoe UI',sans-serif", background: "#0f1d18", minHeight: "100vh", color: "#e8f0ec" },

  // Sidebar
  sidebar:     { width: 200, background: "#0a1410", borderRight: "1px solid #1a2e28", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 },
  sideLogoWrap:{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 16px 24px", borderBottom: "1px solid #1a2e28", gap: 10 },
  sideLogoIcon:{ width: 48, height: 48, background: "#1a3a2e", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" },
  sideBrand:   { fontSize: 16, fontWeight: 800, color: "#e8f0ec", letterSpacing: ".5px" },
  sideItem:    { width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", border: "none", cursor: "pointer", textAlign: "left", transition: "all .15s" },
  logoutBtn:   { display: "flex", alignItems: "center", gap: 8, padding: "16px 20px", background: "none", border: "none", cursor: "pointer", color: "#5a8a78", fontSize: 14, fontWeight: 600, borderTop: "1px solid #1a2e28" },

  // Main
  main:        { marginLeft: 200, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" },
  topBar:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: "#0f1d18", borderBottom: "1px solid #1a2e28", position: "sticky", top: 0, zIndex: 50 },
  avatar:      { width: 36, height: 36, borderRadius: "50%", background: "#2a6e5c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#e8f0ec" },
  content:     { padding: "20px 24px 100px", display: "flex", flexDirection: "column", gap: 14 },

  // Risk card
  riskCard:    { background: "#152820", borderRadius: 16, padding: "22px 24px", display: "flex", gap: 24, alignItems: "flex-start", boxShadow: "0 4px 24px rgba(0,0,0,.4)", flexWrap: "wrap" },
  riskStat:    { minWidth: 130 },
  statLabel:   { fontSize: 10, color: "#7a9e90", letterSpacing: 1.5, margin: 0 },
  statBig:     { fontSize: 34, fontWeight: 900, color: "#e8f0ec", margin: "4px 0 2px", lineHeight: 1 },
  statSub:     { fontSize: 11, color: "#7a9e90", margin: 0 },
  cardTitle:   { fontSize: 20, fontWeight: 800, color: "#e8f0ec", margin: 0 },
  cardSublabel:{ fontSize: 10, color: "#7a9e90", letterSpacing: 2, margin: "4px 0 14px" },
  riskBox:     { flex: 1, minWidth: 180, background: "#0f1d18", borderRadius: 10, padding: 14 },
  alertBadge:  { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#c17f2a22", border: "1px solid" },
  barTrack:    { height: 4, background: "#1a2e28", borderRadius: 2, margin: "8px 0 6px", overflow: "hidden" },
  barFill:     { height: "100%", borderRadius: 2 },
  tag:         { fontSize: 9, fontWeight: 700, color: "#7a9e90", background: "#1a2e28", padding: "2px 8px", borderRadius: 20, letterSpacing: ".3px" },
  outlineBtn:  { marginTop: 16, padding: "8px 22px", background: "none", border: "1px solid #2a6e5c", borderRadius: 20, color: "#a8d5c2", fontSize: 12, fontWeight: 600, cursor: "pointer" },

  // Cards
  card:        { background: "#152820", borderRadius: 16, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,.4)" },
  donutLabel:  { fontSize: 9, color: "#7a9e90", letterSpacing: 1, marginBottom: 8 },
  donutCenter: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  badge:       { fontSize: 11, fontWeight: 800, padding: "6px 12px", borderRadius: 6, color: "#fff", flexShrink: 0 },

  // Action buttons
  actionBtn:   { flex: 1, padding: "14px", background: "#2a6e5c", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" },

};