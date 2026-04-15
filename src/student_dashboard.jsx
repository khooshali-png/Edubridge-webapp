import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase";

const SIDEBAR_ITEMS = [
  { icon: "🏠", label: "Home" },
  { icon: "👤", label: "Attendance" },
  { icon: "📖", label: "Syllabus" },
  { icon: "📋", label: "Homework" },
  { icon: "✏️", label: "Exams" },
  { icon: "💰", label: "Fees" },
  { icon: "🚌", label: "Railway Concession" },
];

const NOTICES = [
  { tag: "EXAMS", tagColor: "#e67e22", time: "2h ago", title: "End Semester Exam Schedule Out", body: "The final examination dates for Spring 2024 have been published. Please...", action: "Download PDF ↓", actionColor: "#e67e22" },
  { tag: "ADMIN", tagColor: "#2a9d6e", time: "1d ago", title: "Railway Concession Renewal", body: "Renewal for the monthly railway travel concession is now open for the...", action: "Apply Now ↗", actionColor: "#2a9d6e" },
];

const DEADLINES = [
  { month: "OCT", day: "09", title: "Algorithm Lab Report",   sub: "CS-402 • 11:59 PM" },
  { month: "OCT", day: "12", title: "DBMS Minor Project",     sub: "CS-405 • Submission" },
  { month: "OCT", day: "15", title: "Soft Skills Quiz",       sub: "HU-201 • Online" },
];

const HOLIDAYS = [
  { date: "Oct 02", name: "Gandhi Jayanti", type: "National Holiday" },
  { date: "Oct 24", name: "Dussehra",       type: "Festival Holiday" },
  { date: "Nov 01", name: "Diwali",         type: "Festival Holiday" },
];

const CAL_DAYS = [
  [null,null,null,null,null,null,null],
  [24,25,26,27,28,29,30],
  [1,2,3,4,5,6,7],
  [8,9,10,11,12,13,14],
];

const CGPA_MAP = {
  "kashishkhooshali@gmail.com": { cgpa: 8.0,  pct: 80.0, badge: null },
  "mittar@gmail.com":           { cgpa: 9.0,  pct: 90.0, badge: "TOP 10% BADGE" },
  "khooshali1@gmail.com":       { cgpa: 9.5,  pct: 95.0, badge: "TOP 10% BADGE" },
  "ishita@gmail.com":           { cgpa: 6.0,  pct: 60.0, badge: null },
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Home");
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) { setUser(JSON.parse(stored)); }
        const uid = localStorage.getItem("uid");
        if (uid) {
          const snap = await getDoc(doc(db, "users", uid));
          if (snap.exists()) {
            const data = { ...snap.data(), uid };
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          }
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("uid");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getFirstName = (name) => {
    if (!name) return "Student";
    return name.split(" ")[0];
  };

  const email     = user?.email || "";
  const cgpaInfo  = CGPA_MAP[email] || null;
  const cgpaValue = user?.cgpa ?? cgpaInfo?.cgpa ?? null;
  const cgpaPct   = cgpaValue ? (cgpaValue / 10) * 100 : 0;
  const cgpaBadge = cgpaInfo?.badge || (cgpaValue >= 9 ? "TOP 10% BADGE" : null);
  const cgpaColor = cgpaValue >= 9 ? "#2a9d8f" : cgpaValue >= 7.5 ? "#52b788" : cgpaValue >= 6 ? "#e9c46a" : cgpaValue ? "#e76f51" : "#6b7f90";

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#14171a", color: "#2a9d8f", fontSize: 18, fontFamily: "'Segoe UI',sans-serif" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* ── SIDEBAR ── */}
      <div style={S.sidebar}>
        <div style={S.logoWrap}>
          <div style={S.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#2a9d6e">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-1 13L5 12.5v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3l-6 3.5z"/>
            </svg>
          </div>
          <span style={S.brand}>EduBridge</span>
        </div>

        <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {SIDEBAR_ITEMS.map(item => {
            const isActive = activeMenu === item.label;
            return (
              <button key={item.label}
                onClick={() => {
                  setActiveMenu(item.label);
                  if (item.label === "Syllabus")    navigate("/syllabus");
                  if (item.label === "Attendance")  navigate("/student-attendance");
                  if (item.label === "Homework")    navigate("/homework");
                  if (item.label === "Exams")       navigate("/exams");
                  if (item.label === "Fees")        navigate("/fees");
                  if (item.label === "Railway Concession") navigate("/railway");
                }}
                style={{ ...S.sideBtn, background: isActive ? "#2a9d8f" : "transparent", color: isActive ? "#fff" : "#6b7f90", borderRadius: isActive ? 10 : 0 }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={S.sideBottom}>
          <div style={S.userRow}>
            <div style={S.userAvatar}>{getInitials(user?.name)}</div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#d1d8e0" }}>{user?.name || "Student"}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#6b7f90" }}>ID: {user?.studentId || "—"}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={S.logoutBtn}>
            <span style={{ fontSize: 14 }}>⎋</span> Logout
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={S.main}>
        <div style={S.topBar}>
          <h2 style={S.pageTitle}>Student Dashboard</h2>
        </div>

        <div style={S.body}>
          <div style={{ display: "flex", gap: 20 }}>
            {/* LEFT COLUMN */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={S.welcomeCard}>
                <div style={S.welcomeAvatar}>
                  <span style={{ fontSize: 60 }}>👦</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h1 style={S.welcomeTitle}>Welcome {getFirstName(user?.name)}!</h1>
                  <p style={S.welcomeSub}>
                    {user?.course || "—"} &nbsp;•&nbsp;
                    {user?.year ? `Year ${user.year}` : "—"}
                    {user?.semester ? `, Semester ${user.semester}` : ""}
                  </p>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#6b7f90" }}>{user?.email}</p>
                </div>
              </div>

              {/* CGPA Card */}
              <div style={S.cgpaCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <p style={S.cgpaLabel}>CURRENT STANDING</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ ...S.cgpaValue, color: cgpaColor }}>
                        {cgpaValue !== null ? cgpaValue.toFixed(2) : "—"}
                      </span>
                      <span style={S.cgpaSub}>/ 10.0 CGPA</span>
                    </div>
                  </div>
                  {cgpaBadge && (
                    <div style={{ ...S.topBadge, background: cgpaValue >= 9.5 ? "#e76f51" : "#2a9d8f" }}>
                      {cgpaBadge}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#6b7f90" }}>Academic Progress</span>
                  <span style={{ fontSize: 13, color: cgpaColor, fontWeight: 700 }}>
                    {cgpaValue !== null ? `${cgpaPct.toFixed(1)}%` : "—"}
                  </span>
                </div>
                <div style={S.progressTrack}>
                  <div style={{ ...S.progressFill, width: `${cgpaPct}%`, background: `linear-gradient(90deg, ${cgpaColor}, ${cgpaColor}aa)` }} />
                </div>
                <p style={S.progressNote}>
                  {cgpaValue === null
                    ? "Results will appear once grades are published."
                    : cgpaValue >= 9.5 ? "🏆 Outstanding performance! You are in the top 5% of your batch."
                    : cgpaValue >= 9   ? "⭐ Excellent! You are in the top 10% of your batch."
                    : cgpaValue >= 8   ? "👍 Great performance! Keep it up."
                    : cgpaValue >= 7   ? "📈 Good standing. Room to improve!"
                    : "📚 Consider seeking academic support to improve your CGPA."}
                </p>
              </div>

              {/* Notices */}
              <div style={{ marginTop: 20 }}>
                <h3 style={S.sectionTitle}>📢 &nbsp;Important Notices</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                  {NOTICES.map(n => (
                    <div key={n.title} style={{ ...S.noticeCard, borderLeft: `3px solid ${n.tagColor}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ ...S.noticeTag, color: n.tagColor, borderColor: n.tagColor }}>{n.tag}</span>
                        <span style={{ fontSize: 11, color: "#6b7f90" }}>{n.time}</span>
                      </div>
                      <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#d1d8e0", lineHeight: 1.4 }}>{n.title}</p>
                      <p style={{ margin: "0 0 12px", fontSize: 12, color: "#6b7f90", lineHeight: 1.6 }}>{n.body}</p>
                      <a href="#" style={{ fontSize: 12, fontWeight: 700, color: n.actionColor, textDecoration: "none" }}>{n.action}</a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Holidays */}
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <h3 style={S.sectionTitle}>🏖️ &nbsp;Upcoming Holidays</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14 }}>
                  {HOLIDAYS.map(h => (
                    <div key={h.name} style={S.holidayCard}>
                      <p style={{ margin: "0 0 4px", fontSize: 11, color: "#2a9d8f", fontWeight: 700 }}>{h.date}</p>
                      <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#d1d8e0" }}>{h.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#6b7f90" }}>{h.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ width: 280, flexShrink: 0 }}>
              <div style={S.calCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#d1d8e0" }}>October 2023</h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={S.calNavBtn}>‹</button>
                    <button style={S.calNavBtn}>›</button>
                  </div>
                </div>
                <div style={S.calGrid}>
                  {["SU","MO","TU","WE","TH","FR","SA"].map(d => (
                    <div key={d} style={{ fontSize: 10, fontWeight: 700, color: "#6b7f90", textAlign: "center", padding: "4px 0" }}>{d}</div>
                  ))}
                </div>
                {CAL_DAYS.map((week, wi) => (
                  <div key={wi} style={S.calGrid}>
                    {week.map((day, di) => (
                      <div key={di} style={{ ...S.calDay, color: day === null ? "transparent" : day === 3 ? "#fff" : day > 20 ? "#3a4f5c" : "#d1d8e0", background: day === 3 ? "#2a9d8f" : "transparent", borderRadius: "50%", fontWeight: day === 3 ? 800 : 400 }}>
                        {day || ""}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div style={{ ...S.calCard, marginTop: 16 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#d1d8e0" }}>Upcoming Deadlines</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {DEADLINES.map(d => (
                    <div key={d.title} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={S.deadlineDateBox}>
                        <span style={{ fontSize: 9, color: "#2a9d8f", fontWeight: 700, letterSpacing: 1 }}>{d.month}</span>
                        <span style={{ fontSize: 22, fontWeight: 900, color: "#d1d8e0", lineHeight: 1 }}>{d.day}</span>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#d1d8e0" }}>{d.title}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7f90" }}>{d.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={S.calendarBtn}>View Full Calendar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page:         { display: "flex", fontFamily: "'Segoe UI',sans-serif", background: "#14171a", minHeight: "100vh", color: "#d1d8e0" },
  sidebar:      { width: 230, background: "#1e242a", borderRight: "1px solid #2a3340", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 },
  logoWrap:     { display: "flex", alignItems: "center", gap: 10, padding: "22px 20px 18px", borderBottom: "1px solid #2a3340" },
  logoIcon:     { width: 36, height: 36, background: "#1a2e2c", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  brand:        { fontSize: 18, fontWeight: 900, color: "#d1d8e0" },
  sideBtn:      { width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", border: "none", cursor: "pointer", textAlign: "left", transition: "all .15s", margin: "1px 0" },
  sideBottom:   { borderTop: "1px solid #2a3340", padding: "14px 16px" },
  userRow:      { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  userAvatar:   { width: 36, height: 36, borderRadius: "50%", background: "#2a9d8f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 },
  logoutBtn:    { width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "#14171a", border: "none", borderRadius: 8, color: "#6b7f90", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  main:         { marginLeft: 230, flex: 1, display: "flex", flexDirection: "column" },
  topBar:       { display: "flex", alignItems: "center", gap: 20, padding: "14px 28px", background: "#1e242a", borderBottom: "1px solid #2a3340", position: "sticky", top: 0, zIndex: 50 },
  pageTitle:    { fontSize: 18, fontWeight: 800, color: "#d1d8e0", margin: 0 },
  body:         { padding: "24px 28px 40px", overflowY: "auto" },
  welcomeCard:  { background: "#1e242a", borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "center", gap: 24, marginBottom: 20, boxShadow: "0 4px 24px rgba(0,0,0,.3)" },
  welcomeAvatar:{ width: 100, height: 100, borderRadius: "50%", background: "#14171a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "3px solid #2a9d8f" },
  welcomeTitle: { fontSize: 28, fontWeight: 900, color: "#d1d8e0", margin: 0, letterSpacing: "-.3px" },
  welcomeSub:   { fontSize: 14, color: "#6b7f90", margin: "6px 0 0" },
  cgpaCard:     { background: "#1e242a", borderRadius: 16, padding: "22px 24px", boxShadow: "0 4px 24px rgba(0,0,0,.3)" },
  cgpaLabel:    { fontSize: 10, color: "#6b7f90", letterSpacing: 2, margin: "0 0 4px", fontWeight: 700 },
  cgpaValue:    { fontSize: 48, fontWeight: 900, lineHeight: 1 },
  cgpaSub:      { fontSize: 16, color: "#6b7f90" },
  topBadge:     { color: "#fff", fontSize: 11, fontWeight: 800, padding: "8px 14px", borderRadius: 8, letterSpacing: ".5px" },
  progressTrack:{ height: 8, background: "#14171a", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4, transition: "width .5s" },
  progressNote: { fontSize: 12, color: "#6b7f90", margin: "8px 0 0", fontStyle: "italic" },
  sectionTitle: { fontSize: 18, fontWeight: 800, color: "#d1d8e0", margin: 0 },
  noticeCard:   { background: "#1e242a", borderRadius: 12, padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,.25)" },
  noticeTag:    { fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, border: "1px solid", letterSpacing: ".5px" },
  holidayCard:  { background: "#1e242a", borderRadius: 12, padding: "14px 16px", border: "1px solid #2a3340" },
  calCard:      { background: "#1e242a", borderRadius: 16, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,.25)" },
  calGrid:      { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 },
  calDay:       { fontSize: 12, textAlign: "center", padding: "6px 2px", cursor: "default", lineHeight: 1.2 },
  calNavBtn:    { background: "none", border: "none", cursor: "pointer", color: "#6b7f90", fontSize: 18, padding: "0 4px" },
  deadlineDateBox: { background: "#14171a", borderRadius: 8, padding: "6px 10px", textAlign: "center", minWidth: 44, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, border: "1px solid #2a3340" },
  calendarBtn:  { width: "100%", marginTop: 18, padding: "10px", background: "none", border: "1px solid #2a9d8f", borderRadius: 10, color: "#2a9d8f", fontSize: 13, fontWeight: 700, cursor: "pointer" },
};