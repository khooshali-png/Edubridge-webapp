import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function analyzeStudent(student) {
  const timestamps = student.loginTimestamps || [];
  const hours = timestamps.map(ts => new Date(ts).getHours());

  if (hours.length === 0) {
    return { ...student, score: 0, risk: "NO DATA", color: "#6b7f90", bg: "#1a2a2e", icon: "⚪", msg: "Student has not logged in yet", timeStr: "—", lateNight: 0, healthy: 0, earlyMorn: 0, hours, pct: () => 0 };
  }

  const lateNight = hours.filter(h => h >= 22 || h < 4).length;
  const earlyMorn = hours.filter(h => h >= 4 && h < 6).length;
  const healthy   = hours.filter(h => h >= 7 && h < 20).length;
  const pct       = n => Math.round((n / hours.length) * 100);

  const avg = hours.reduce((a, b) => a + b, 0) / hours.length;
  const h12 = Math.floor(avg) % 12 === 0 ? 12 : Math.floor(avg) % 12;
  const mn  = Math.round((avg % 1) * 60).toString().padStart(2, "0");
  const pm  = Math.floor(avg) >= 12 ? "PM" : "AM";
  const timeStr = `${h12}:${mn} ${pm}`;

  const score = Math.min(100, Math.round(pct(lateNight) * 0.6 + pct(earlyMorn) * 0.8));

  let risk, color, bg, icon, msg;
  if (score >= 60)      { risk = "CRITICAL";  color = "#ef4444"; bg = "#2d1010"; icon = "🔴"; msg = "Chronic Late-Night Activity — Immediate Wellness Alert"; }
  else if (score >= 35) { risk = "HIGH RISK"; color = "#f97316"; bg = "#2d1a0a"; icon = "🟠"; msg = "Irregular Login Pattern — Student may be burning out"; }
  else if (score >= 15) { risk = "MODERATE";  color = "#eab308"; bg = "#2a2010"; icon = "🟡"; msg = "Evening-heavy logins — Monitor for fatigue"; }
  else                  { risk = "HEALTHY";   color = "#22c55e"; bg = "#0f2d1a"; icon = "🟢"; msg = "Normal login hours — Student is well-rested"; }

  return { ...student, score, risk, color, bg, icon, msg, timeStr, lateNight, healthy, earlyMorn, hours, pct };
}

function fmtH(h) { const hr = h % 12 === 0 ? 12 : h % 12; return `${hr}${h >= 12 ? "PM" : "AM"}`; }

export default function BurnoutPredictor() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [sel, setSel]           = useState(null);
  const [dismissed, setDismissed] = useState([]);
  const chartRef  = useRef(null);
  const chartInst = useRef(null);

  // ── Real-time: listen for all students ──
  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      setStudents(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const data  = students.map(analyzeStudent);
  const crits = data.filter(s => s.risk === "CRITICAL" || s.risk === "HIGH RISK");
  const selS  = sel ? data.find(s => s.uid === sel) : null;

  // Chart for selected student
  useEffect(() => {
    if (!sel || !chartRef.current || !selS) return;
    if (chartInst.current) chartInst.current.destroy();

    const bins = Array(24).fill(0);
    selS.hours.forEach(h => bins[h]++);

    chartInst.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: Array.from({ length: 24 }, (_, i) => i === 0 ? "12AM" : i < 12 ? `${i}AM` : i === 12 ? "12PM" : `${i - 12}PM`),
        datasets: [{
          data: bins,
          backgroundColor: bins.map((_, i) => (i >= 22 || i < 4) ? "#ef444499" : (i >= 4 && i < 7) ? "#f9731699" : (i >= 20 && i < 22) ? "#eab30899" : "#22c55e55"),
          borderColor:     bins.map((_, i) => (i >= 22 || i < 4) ? "#ef4444"   : (i >= 4 && i < 7) ? "#f97316"   : (i >= 20 && i < 22) ? "#eab308"   : "#22c55e"),
          borderWidth: 1, borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { color: "#7a9e90", stepSize: 1 }, grid: { color: "#1a2e28" } },
          x: { ticks: { color: "#7a9e90", font: { size: 9 } }, grid: { display: false } }
        }
      }
    });
    return () => chartInst.current?.destroy();
  }, [sel, selS]);

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "#0a1410", minHeight: "100vh", color: "#e8f0ec" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#0f2d1a,#152820)", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, borderBottom: "1px solid #1a2e28", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => navigate("/teacher")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #2a6e5c", color: "#a8d5c2", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back</button>
          <div style={{ width: 44, height: 44, background: "#1a3a2e", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧠</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#e8f0ec", margin: 0 }}>Academic Burnout Predictor</h1>
            <p style={{ fontSize: 11, color: "#7a9e90", margin: "3px 0 0" }}>
              Real-time login tracking · Flags sleep deprivation risk
              <span style={{ marginLeft: 12, color: "#2a9d8f" }}>● Live</span>
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[["🔴","Critical"],["🟠","High Risk"],["🟡","Moderate"],["🟢","Healthy"],["⚪","No Data"]].map(([ic,lb]) => (
            <div key={lb} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 12 }}>{ic}</span><span style={{ fontSize: 11, color: "#a8bfb5" }}>{lb}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ALERT BANNER */}
      {crits.filter(s => !dismissed.includes(s.uid)).length > 0 && (
        <div style={{ background: "#2d1010", borderBottom: "1px solid #ef4444", padding: "12px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#fca5a5" }}>Wellness Alert — {crits.filter(s => !dismissed.includes(s.uid)).length} student(s) showing risky login patterns</p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#f87171" }}>{crits.filter(s => !dismissed.includes(s.uid)).map(s => s.name).join(", ")} · Logging in during late-night hours</p>
          </div>
          <button onClick={() => setDismissed(crits.map(s => s.uid))} style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Dismiss</button>
        </div>
      )}

      <div style={{ padding: "20px 24px 60px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* SUMMARY CARDS */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { ic: "👥", lb: "Monitored",  v: data.length,                              c: "#2d5be3" },
            { ic: "🔴", lb: "Critical",   v: data.filter(s => s.risk === "CRITICAL").length,  c: "#ef4444" },
            { ic: "🟠", lb: "High Risk",  v: data.filter(s => s.risk === "HIGH RISK").length, c: "#f97316" },
            { ic: "🟡", lb: "Moderate",   v: data.filter(s => s.risk === "MODERATE").length,  c: "#eab308" },
            { ic: "🟢", lb: "Healthy",    v: data.filter(s => s.risk === "HEALTHY").length,   c: "#22c55e" },
          ].map(c => (
            <div key={c.lb} style={{ background: "#152820", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 10px rgba(0,0,0,.4)", flex: 1, minWidth: 110 }}>
              <span style={{ fontSize: 26 }}>{c.ic}</span>
              <div>
                <p style={{ fontSize: 26, fontWeight: 800, color: c.c, margin: 0 }}>{c.v}</p>
                <p style={{ fontSize: 11, color: "#7a9e90", margin: 0 }}>{c.lb}</p>
              </div>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div style={{ background: "#152820", borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#7a9e90", letterSpacing: 1, margin: "0 0 12px" }}>HOW THE ENGINE WORKS</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { ic: "🔐", t: "Firebase Auth Tracking",   d: "Every login is timestamped automatically via Firebase Authentication" },
              { ic: "🧮", t: "Avg Login Hour",            d: "Calculates each student's average login hour across all sessions" },
              { ic: "⏰", t: "Danger Window 10PM–4AM",    d: "Logins in this window are flagged as high risk automatically" },
              { ic: "👨‍⚕️", t: "Real-time Teacher Alert", d: "Dashboard updates live — no refresh needed to see new risk patterns" },
            ].map(item => (
              <div key={item.t} style={{ display: "flex", gap: 10, flex: 1, minWidth: 200, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24 }}>{item.ic}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#e8f0ec" }}>{item.t}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "#7a9e90", lineHeight: 1.5 }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STUDENT GRID */}
        <div style={{ background: "#152820", borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#7a9e90", letterSpacing: 1, margin: "0 0 14px" }}>
            STUDENT WELLNESS MONITOR — Click any student to see their login timeline
          </p>

          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#7a9e90" }}>⏳ Loading students from Firebase...</div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#7a9e90" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>👥</p>
              No students have signed up yet. They will appear here automatically!
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 12 }}>
              {data.map(st => (
                <div key={st.uid} onClick={() => setSel(sel === st.uid ? null : st.uid)}
                  style={{ borderRadius: 12, padding: 14, cursor: "pointer", transition: "all .15s", background: sel === st.uid ? st.bg : "#0f1d18", border: `1.5px solid ${sel === st.uid ? st.color : "#1a2e28"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a3a2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#e8f0ec", border: `2px solid ${st.color}` }}>
                        {st.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2) || "?"}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#e8f0ec" }}>{st.name}</p>
                        <p style={{ margin: 0, fontSize: 10, color: "#7a9e90" }}>{st.studentId || st.uid?.slice(0,8)}</p>
                      </div>
                    </div>
                    <span style={{ background: st.bg, color: st.color, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, border: `1px solid ${st.color}`, whiteSpace: "nowrap" }}>
                      {st.icon} {st.risk}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 9, color: "#7a9e90" }}>AVG LOGIN TIME</p>
                      <p style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 800, color: st.color }}>{st.timeStr}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: 9, color: "#7a9e90" }}>BURNOUT SCORE</p>
                      <p style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 800, color: st.color }}>{st.score}/100</p>
                    </div>
                  </div>

                  <div style={{ height: 5, background: "#1a2e28", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ height: "100%", width: st.score + "%", background: st.color, borderRadius: 3 }} />
                  </div>

                  {st.hours.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      {[
                        { v: st.pct(st.lateNight), c: "#ef4444", l: "Late Night" },
                        { v: st.pct(st.healthy),   c: "#22c55e", l: "Healthy" },
                        { v: st.pct(st.earlyMorn), c: "#f97316", l: "Early AM" },
                      ].map(b => (
                        <div key={b.l} style={{ flex: 1, background: "#0a1410", borderRadius: 6, padding: "5px 6px", textAlign: "center" }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: b.c }}>{b.v}%</p>
                          <p style={{ margin: 0, fontSize: 8, color: "#7a9e90" }}>{b.l}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <p style={{ margin: 0, fontSize: 11, color: "#7a9e90", fontStyle: "italic", lineHeight: 1.4 }}>{st.msg}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 10, color: "#4a6e62" }}>
                    {st.hours.length} login{st.hours.length !== 1 ? "s" : ""} tracked · Last: {st.loginTimestamps?.length ? new Date(st.loginTimestamps[st.loginTimestamps.length - 1]).toLocaleString() : "Never"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SELECTED STUDENT DETAIL */}
        {selS && selS.hours.length > 0 && (
          <div style={{ background: "#152820", borderRadius: 14, padding: 20, border: `1.5px solid ${selS.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#e8f0ec" }}>{selS.name} — Login Timeline</h2>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#7a9e90" }}>{selS.hours.length} logins tracked · Avg login: {selS.timeStr}</p>
              </div>
              <button onClick={() => setSel(null)} style={{ background: "#1a2e28", border: "none", color: "#e8f0ec", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            <canvas ref={chartRef} height={80} />

            <div style={{ marginTop: 14, padding: 14, background: selS.bg, borderRadius: 12, border: `1px solid ${selS.color}44` }}>
              <p style={{ margin: 0, fontWeight: 700, color: selS.color, fontSize: 13 }}>{selS.icon} Teacher Recommendation</p>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "#a8bfb5", lineHeight: 1.6 }}>
                {selS.risk === "CRITICAL"  && "⚠️ URGENT: Schedule immediate wellness check-in. Recommend counseling referral and deadline flexibility."}
                {selS.risk === "HIGH RISK" && "📋 Contact the student for 1-on-1 conversation. Suggest time management workshops."}
                {selS.risk === "MODERATE"  && "👁️ Keep monitoring. Encourage daytime study habits. Check in during next class."}
                {selS.risk === "HEALTHY"   && "✅ Student maintaining healthy login hours. No action needed."}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}