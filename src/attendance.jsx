 import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, doc, setDoc, serverTimestamp, query, where } from "firebase/firestore";
// FIXED: Changed "../firebase" to "./firebase"
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

export default function Attendance() {
  const navigate = useNavigate();
  const [students, setStudents]     = useState([]);
  const [date, setDate]             = useState(new Date().toISOString().split("T")[0]);
  const [subject, setSubject]       = useState("DBMS");
  const [search, setSearch]         = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d, i) => ({
        uid:    d.id,
        name:   d.data().name   || "Unknown",
        id:     d.data().studentId || `STU-${i+1}`,
        course: d.data().course || "",
        status: "present",
      }));
      list.sort((a, b) => a.name.localeCompare(b.name));
      setStudents(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggle = (uid, status) => {
    setStudents(prev => prev.map(s => s.uid === uid ? { ...s, status } : s));
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const promises = students.map(s =>
        setDoc(doc(db, "attendance", `${s.uid}_${subject}_${date}`), {
          studentUid: s.uid,
          studentName: s.name,
          subject,
          date,
          status: s.status,
          markedAt: serverTimestamp(),
        })
      );
      await Promise.all(promises);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Error saving attendance:", err);
    }
    setSaving(false);
  };

  const filtered     = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const presentCount = students.filter(s => s.status === "present").length;
  const absentCount  = students.filter(s => s.status === "absent").length;

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: P.bg, minHeight: "100vh", color: P.text }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", background: P.card, borderBottom: `1px solid ${P.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#1a3a2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={P.teal}><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-1 13L5 12.5v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3l-6 3.5z"/></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900 }}>EduBridge</span>
          </div>
          <button onClick={() => navigate("/teacher")}
            style={{ padding: "7px 16px", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.muted, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            ← Back
          </button>
        </div>

        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          Attendance
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: P.bg, border: `1px solid ${P.border}`, borderRadius: 10, padding: "8px 14px" }}>
          <span style={{ fontSize: 14, color: P.muted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter search"
            style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: P.text, width: 150, fontFamily: "inherit" }} />
        </div>
      </div>

      <div style={{ padding: "28px 36px 60px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {[
            { label: `✅ Present: ${presentCount}`, bg: "#1a3a2a", color: P.teal,  border: P.teal   + "44" },
            { label: `❌ Absent: ${absentCount}`,   bg: "#3a1a1a", color: P.rust,  border: P.rust   + "44" },
            { label: `📊 Total: ${students.length}`,bg: "#1a1f2e", color: "#6a9fd8",border:"#6a9fd844" },
          ].map(p => (
            <div key={p.label} style={{ padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
              {p.label}
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: P.teal }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: P.teal }} />
            Live — updates when new students sign up
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: P.card, border: `1px solid ${P.border}`, borderRadius: 10, padding: "9px 14px" }}>
            <span style={{ fontSize: 16 }}>📅</span>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: 13, color: P.text, background: "transparent", fontFamily: "inherit", colorScheme: "dark" }} />
          </div>
          <select value={subject} onChange={e => setSubject(e.target.value)}
            style={{ padding: "10px 16px", border: `1px solid ${P.border}`, borderRadius: 10, fontSize: 13, color: P.text, outline: "none", background: P.card, fontFamily: "inherit", cursor: "pointer" }}>
            <option>CYBER LAWS</option>
            <option>AI</option>
            <option>BI</option>
            <option>SOFTWARE QUALITY ASSURANCE</option>
            <option>INFORMATION SECURITY</option>
            <option>ENTERPRISE NETWORK</option>
            <option>FUNDAMENTAL OF GIS</option>
          </select>
        </div>

        {submitted && (
          <div style={{ background: "#1a3a2a", border: `1px solid ${P.teal}44`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, fontWeight: 600, fontSize: 14, color: P.teal }}>
            ✅ Attendance saved to Firebase!
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 48, color: P.muted }}>
            <p style={{ fontSize: 24, marginBottom: 8 }}>⏳</p>
            Loading students from Firebase...
          </div>
        ) : (
          <div style={{ background: P.card, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 260px", padding: "14px 24px", borderBottom: `1px solid ${P.border}`, background: "#181e24" }}>
              {["#", "Student Name", "Course", "Status"].map(h => (
                <span key={h} style={{ fontSize: 12, fontWeight: 700, color: P.muted }}>{h}</span>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: 48, color: P.muted }}>
                No students found.
              </div>
            ) : filtered.map((s, idx) => (
              <div key={s.uid} style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 260px", padding: "16px 24px", borderBottom: idx < filtered.length - 1 ? `1px solid ${P.border}` : "none", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: P.muted }}>{idx + 1}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{s.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: P.muted }}>{s.id}</p>
                </div>
                <span style={{ fontSize: 11, color: P.muted }}>{s.course}</span>
                <div style={{ display: "flex", gap: 20 }}>
                  {["present", "absent"].map(status => (
                    <label key={status} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => toggle(s.uid, status)}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${s.status === status ? (status === "present" ? P.teal : P.rust) : P.border}`, background: s.status === status ? (status === "present" ? P.teal : P.rust) : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {s.status === status && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 14, color: s.status === status ? (status === "present" ? P.teal : P.rust) : P.muted }}>{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ padding: "24px", display: "flex", justifyContent: "center", borderTop: `1px solid ${P.border}` }}>
              <button onClick={handleSubmit} disabled={saving}
                style={{ padding: "14px 56px", background: P.teal, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : "✅ Submit Attendance"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}