import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BG   = "#0f1a16";
const CARD = "#162820";
const CARD2= "#1a3028";
const TEAL = "#2a9d8f";
const RUST = "#e76f51";
const MUT  = "#7a9e90";
const TXT  = "#e8f0ec";
const BDR  = "#1e3530";

const DAYS = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"];

const SCHEDULE = {
  MONDAY: [
    { time: "09:00 - 10:30", subject: "AI",  sub: "Year 2 • Room 102",  color: TEAL },
    { time: "11:00 - 12:30", subject: "BI",   sub: "Year 3 • Room 201",  color: "#52b788" },
  ],
  TUESDAY: [
    { time: "09:00 - 10:30", subject: "CYBER LAWS",   sub: "Year 1 • Lab 301",   color: "#52b788" },
    { time: "14:00 - 15:30", subject: "SQA",   sub: "Year 2 • Hall B",    color: "#f4a261" },
  ],
  WEDNESDAY: [
    { time: "09:00 - 12:00", subject: "BI",    sub: "Year 3 • Lab 201",   color: TEAL },
    { time: "13:00 - 14:30", subject: "FGIS",  sub: "Year 4 • Room 402",  color: TEAL },
  ],
  THURSDAY: [
    { time: "11:00 - 12:30", subject: "AI",   sub: "Year 4 • Room 305",  color: "#52b788", highlight: true },
    { time: "15:00 - 16:30", subject: "EN",   sub: "Year 2 • Hall A",    color: "#f4a261" },
  ],
  FRIDAY: [
    { time: "10:00 - 11:30", subject: "EN",   sub: "MSc • Room 108",     color: "#52b788" },
    { time: "13:00 - 14:00", subject: "SQA",    sub: "Year 1 • Lab 102",   color: TEAL },
  ],
};

const SUBJECT_FULL = {
 CYBERLAWS: "CYBER LAWS",
  BI:  "BUSINESS INTELLIGENCE",
  AI:  "ARTIFICIAL INTELLIGENCE",
  SQA:   "SOFTWARE QUALITY ASSURANCE",
  EN:  "ENTERPRISE NETWORK",
};

export default function Schedule() {
  const navigate   = useNavigate();
  const [activeDay, setActiveDay] = useState("MONDAY");
  const [view, setView]           = useState("grid");

  const allSessions = Object.values(SCHEDULE).flat();
  const totalHours  = 18;
  const totalStudents = 245;

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: BG, minHeight: "100vh", color: TXT }}>

      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", background: CARD, borderBottom: `1px solid ${BDR}`, position: "sticky", top: 0, zIndex: 50 }}>
        {/* Logo + back */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#1a3a2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={TEAL}><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-1 13L5 12.5v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3l-6 3.5z"/></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900 }}>EduBridge</span>
          </div>
          <button onClick={() => navigate("/teacher")}
            style={{ padding: "7px 16px", background: BG, border: `1px solid ${BDR}`, borderRadius: 8, color: MUT, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            ← Back
          </button>
        </div>

        {/* Teacher info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Prof. Sarah Jenkins</p>
            <p style={{ margin: 0, fontSize: 11, color: MUT }}>Computer Science</p>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#2a4a3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👩‍🏫</div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "28px 36px 60px" }}>

        {/* Page heading + upcoming chip */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900, letterSpacing: "-.5px" }}>Weekly Teaching Schedule</h1>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: MUT }}>Managing academic sessions for the Summer Term 2026</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: CARD, border: `1px solid ${RUST}44`, borderRadius: 14, padding: "14px 18px", minWidth: 200 }}>
            <div style={{ width: 38, height: 38, background: RUST + "22", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔔</div>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: RUST, letterSpacing: 1 }}>UPCOMING</p>
              <p style={{ margin: "3px 0 0", fontSize: 14, fontWeight: 800 }}>DBMS in 15 mins</p>
            </div>
          </div>
        </div>

        {/* ── WEEKLY OVERVIEW ── */}
        <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BDR}`, padding: "24px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Weekly Overview</h2>
            {/* Grid / List toggle */}
            <div style={{ display: "flex", background: BG, borderRadius: 10, border: `1px solid ${BDR}`, overflow: "hidden" }}>
              {["grid","list"].map(v => (
                <button key={v} onClick={() => setView(v)}
                  style={{ padding: "8px 18px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: view === v ? TEAL : "transparent", color: view === v ? "#fff" : MUT, textTransform: "capitalize" }}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {view === "grid" ? (
            <>
              {/* Day tabs */}
              <div style={{ display: "flex", borderBottom: `1px solid ${BDR}`, marginBottom: 20, gap: 4 }}>
                {DAYS.map(day => (
                  <button key={day} onClick={() => setActiveDay(day)}
                    style={{ padding: "10px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 800, letterSpacing: 1, color: activeDay === day ? TEAL : MUT, borderBottom: activeDay === day ? `2px solid ${TEAL}` : "2px solid transparent", marginBottom: -1 }}>
                    {day}
                  </button>
                ))}
              </div>

              {/* Session cards grid — all 5 days */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
                {DAYS.map(day => (
                  <div key={day} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {SCHEDULE[day].map((sess, i) => (
                      <div key={i} style={{ background: BG, borderRadius: 12, padding: "14px", border: `1px solid ${sess.highlight ? RUST : BDR}`, borderLeft: `3px solid ${sess.color}`, position: "relative" }}>
                        {sess.highlight && <div style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: RUST }} />}
                        <p style={{ margin: "0 0 6px", fontSize: 10, color: sess.color, fontWeight: 700 }}>{sess.time}</p>
                        <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, color: TXT }}>{sess.subject}</p>
                        <p style={{ margin: 0, fontSize: 11, color: MUT }}>{sess.sub}</p>
                      </div>
                    ))}
                    {SCHEDULE[day].length < 2 && (
                      <div style={{ background: "transparent", borderRadius: 12, padding: "20px 14px", border: `1.5px dashed ${BDR}`, textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: 12, color: BDR }}>No Sessions</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* LIST VIEW */
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DAYS.map(day => (
                <div key={day}>
                  <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: MUT, letterSpacing: 1 }}>{day}</p>
                  {SCHEDULE[day].map((sess, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: BG, borderRadius: 10, padding: "12px 16px", marginBottom: 6, borderLeft: `3px solid ${sess.color}` }}>
                      <span style={{ fontSize: 11, color: sess.color, fontWeight: 700, minWidth: 110 }}>{sess.time}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, flex: 1 }}>{sess.subject}</span>
                      <span style={{ fontSize: 11, color: MUT }}>{SUBJECT_FULL[sess.subject]}</span>
                      <span style={{ fontSize: 11, color: MUT }}>{sess.sub}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── BOTTOM STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

          {/* Weekly Load */}
          <div style={{ background: CARD, borderRadius: 14, padding: "20px 22px", border: `1px solid ${BDR}` }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: MUT }}>Weekly Load</p>
            <p style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 900, color: TEAL }}>{totalHours} Hours</p>
            <div style={{ height: 5, background: BG, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "75%", background: `linear-gradient(90deg, ${TEAL}, #3dcfc0)`, borderRadius: 3 }} />
            </div>
          </div>

          {/* Total Students */}
          <div style={{ background: CARD, borderRadius: 14, padding: "20px 22px", border: `1px solid ${BDR}` }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: MUT }}>Total Students</p>
            <p style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 900, color: RUST }}>{totalStudents} Active</p>
            <div style={{ height: 5, background: BG, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "82%", background: `linear-gradient(90deg, ${RUST}, #f4956a)`, borderRadius: 3 }} />
            </div>
          </div>

          {/* Next Deadline */}
          <div style={{ background: CARD, borderRadius: 14, padding: "20px 22px", border: `1px solid ${BDR}` }}>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: MUT }}>Next Deadline</p>
            <p style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 900, color: TXT }}>Grade Submission</p>
            <p style={{ margin: 0, fontSize: 13, color: RUST, fontWeight: 700 }}>Due in 2 days (July 15)</p>
          </div>

        </div>

      </div>
    </div>
  );
}