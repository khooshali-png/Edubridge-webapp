import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PALETTE = {
  bg:     "#14171a",
  card:   "#1e242a",
  text:   "#d1d8e0",
  teal:   "#2a9d8f",
  rust:   "#e76f51",
  border: "#2a3340",
  muted:  "#6b7f90",
};

const SUBJECTS = [
  {
    id: "cyber",
    code: "CL",
    name: "Cyber Laws",
    icon: "⚖️",
    accent: "#6a9fd8",
    credits: 4,
    units: [
      { title: "Unit 1: Introduction to Cyber Law & IT Act 2000",  topics: ["Introduction to Cyber Law & IT Act 2000", "Digital Signatures & Electronic Records"] },
      { title: "Unit 2: Cyber Crimes",                              topics: ["Cyber Crimes (hacking, phishing, identity theft, etc.)", "Cyber Law Issues in E-Commerce"] },
      { title: "Unit 3: Intellectual Property & Data Protection",   topics: ["Intellectual Property Rights (IPR)", "Data Protection & Privacy Laws"] },
      { title: "Unit 4: Cyber Forensics & Amendments",             topics: ["Cyber Forensics", "Amendments in IT Act (2008)"] },
    ],
  },
  {
    id: "bi",
    code: "BI",
    name: "Business Intelligence",
    icon: "📊",
    accent: "#f4a261",
    credits: 4,
    units: [
      { title: "Unit 1: Introduction to BI & Data Warehousing",    topics: ["Introduction to Business Intelligence (BI)", "Data Warehousing Concepts"] },
      { title: "Unit 2: Data Mining & OLAP",                       topics: ["Data Mining Techniques", "OLAP (Online Analytical Processing)"] },
      { title: "Unit 3: ETL & BI Tools",                           topics: ["ETL (Extract, Transform, Load) Process", "BI Tools & Applications"] },
      { title: "Unit 4: Data Visualization & Big Data",            topics: ["Data Visualization & Reporting", "Big Data Basics"] },
    ],
  },
  {
    id: "infosec",
    code: "IS",
    name: "Information Security",
    icon: "🔐",
    accent: "#2a9d8f",
    credits: 4,
    units: [
      { title: "Unit 1: Basics & Cryptography",                    topics: ["Basics of Information Security", "Cryptography (Encryption & Decryption)"] },
      { title: "Unit 2: Network Security & Threats",               topics: ["Network Security", "Security Threats & Vulnerabilities"] },
      { title: "Unit 3: Authentication & Firewalls",               topics: ["Authentication & Access Control", "Firewalls & Intrusion Detection Systems"] },
      { title: "Unit 4: Risk Management & Policies",               topics: ["Risk Management", "Security Policies & Standards"] },
    ],
  },
  {
    id: "sqa",
    code: "SQA",
    name: "Software Quality Assurance",
    icon: "🧪",
    accent: "#e76f51",
    credits: 4,
    units: [
      { title: "Unit 1: Software Quality & Testing Basics",        topics: ["Introduction to Software Quality", "Software Testing Basics"] },
      { title: "Unit 2: Testing Techniques",                       topics: ["Testing Techniques (Black Box, White Box)", "Software Development Life Cycle (SDLC)"] },
      { title: "Unit 3: Quality Standards & Test Planning",        topics: ["Quality Standards (ISO, CMMI)", "Test Planning & Test Cases"] },
      { title: "Unit 4: Debugging & Automation",                   topics: ["Debugging & Verification", "Automation Testing Basics"] },
    ],
  },
  {
    id: "gis",
    code: "GIS",
    name: "Fundamentals of GIS",
    icon: "🗺️",
    accent: "#52b788",
    credits: 3,
    units: [
      { title: "Unit 1: Introduction to GIS",                      topics: ["Introduction to GIS (Geographic Information System)", "Spatial Data Models"] },
      { title: "Unit 2: Map Projections & Data",                   topics: ["Map Projections & Coordinate Systems", "GIS Data Input & Output"] },
      { title: "Unit 3: Remote Sensing & Analysis",                topics: ["Remote Sensing Basics", "GIS Analysis Techniques"] },
      { title: "Unit 4: Applications & GPS",                       topics: ["Applications of GIS", "GPS Concepts"] },
    ],
  },
  {
    id: "enet",
    code: "EN",
    name: "Enterprise Networking",
    icon: "🌐",
    accent: "#a78bfa",
    credits: 4,
    units: [
      { title: "Unit 1: Network Basics & Topologies",              topics: ["Basics of Computer Networks", "Network Topologies & Protocols"] },
      { title: "Unit 2: OSI & TCP/IP Models",                      topics: ["OSI & TCP/IP Models", "Routing & Switching"] },
      { title: "Unit 3: Network Devices & Wireless",               topics: ["Network Devices (Router, Switch, Hub)", "Wireless Networking"] },
      { title: "Unit 4: Network Security & Cloud",                 topics: ["Network Security Basics", "Cloud Networking"] },
    ],
  },
  {
    id: "ai",
    code: "AI",
    name: "Artificial Intelligence",
    icon: "🤖",
    accent: "#e9c46a",
    credits: 4,
    units: [
      { title: "Unit 1: Introduction & Problem Solving",           topics: ["Introduction to AI", "Problem Solving Methods"] },
      { title: "Unit 2: Search Algorithms",                        topics: ["Search Algorithms (BFS, DFS, A*)", "Knowledge Representation"] },
      { title: "Unit 3: Machine Learning & Neural Networks",       topics: ["Machine Learning Basics", "Neural Networks"] },
      { title: "Unit 4: NLP & Expert Systems",                     topics: ["Natural Language Processing (NLP)", "Expert Systems"] },
    ],
  },
];

export default function Syllabus() {
  const navigate = useNavigate();
  const [openSubject, setOpenSubject] = useState(null);
  const [openUnit, setOpenUnit]       = useState({});

  const toggleSubject = (id) => {
    setOpenSubject(prev => prev === id ? null : id);
    setOpenUnit({});
  };

  const toggleUnit = (sid, uid) => {
    setOpenUnit(prev => ({ ...prev, [`${sid}-${uid}`]: !prev[`${sid}-${uid}`] }));
  };

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: PALETTE.bg, minHeight: "100vh", color: PALETTE.text }}>

      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", background: PALETTE.card, borderBottom: `1px solid ${PALETTE.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#1a3a2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={PALETTE.teal}><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-1 13L5 12.5v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3l-6 3.5z"/></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900 }}>EduBridge</span>
          </div>
          <button onClick={() => navigate("/student")}
            style={{ padding: "7px 16px", background: PALETTE.bg, border: `1px solid ${PALETTE.border}`, borderRadius: 8, color: PALETTE.muted, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            ← Dashboard
          </button>
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          📚 Syllabus
        </h2>
        <div style={{ fontSize: 13, color: PALETTE.muted }}>{SUBJECTS.length} Subjects</div>
      </div>

      {/* Body */}
      <div style={{ padding: "28px 36px 60px", maxWidth: 900, margin: "0 auto" }}>

        <p style={{ fontSize: 14, color: PALETTE.muted, marginBottom: 24 }}>
          Tap a subject to expand its units and topics.
        </p>

        {/* Subject cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SUBJECTS.map(sub => {
            const isOpen = openSubject === sub.id;
            return (
              <div key={sub.id} style={{ background: PALETTE.card, borderRadius: 14, border: `1.5px solid ${isOpen ? sub.accent : PALETTE.border}`, overflow: "hidden", transition: "border-color .2s" }}>

                {/* Subject header */}
                <div onClick={() => toggleSubject(sub.id)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: sub.accent + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `1px solid ${sub.accent}44` }}>
                      {sub.icon}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: sub.accent, background: sub.accent + "22", padding: "2px 8px", borderRadius: 6, letterSpacing: 1 }}>{sub.code}</span>
                        <span style={{ fontSize: 11, color: PALETTE.muted }}>{sub.credits} Credits</span>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 800, color: PALETTE.text }}>{sub.name}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, color: PALETTE.muted }}>{sub.units.length} Units</span>
                    <span style={{ fontSize: 18, color: sub.accent, transition: "transform .2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                  </div>
                </div>

                {/* Units */}
                {isOpen && (
                  <div style={{ borderTop: `1px solid ${PALETTE.border}`, padding: "12px 22px 18px" }}>
                    {sub.units.map((unit, ui) => {
                      const unitKey  = `${sub.id}-${ui}`;
                      const unitOpen = openUnit[unitKey];
                      return (
                        <div key={ui} style={{ marginBottom: 8 }}>
                          {/* Unit header */}
                          <div onClick={() => toggleUnit(sub.id, ui)}
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: PALETTE.bg, borderRadius: 10, cursor: "pointer", border: `1px solid ${unitOpen ? sub.accent + "55" : PALETTE.border}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 8, background: sub.accent + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: sub.accent }}>
                                {ui + 1}
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 700, color: PALETTE.text }}>{unit.title}</span>
                            </div>
                            <span style={{ fontSize: 14, color: sub.accent, transition: "transform .2s", display: "inline-block", transform: unitOpen ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                          </div>

                          {/* Topics */}
                          {unitOpen && (
                            <div style={{ padding: "10px 16px 4px 56px" }}>
                              {unit.topics.map((topic, ti) => (
                                <div key={ti} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", borderBottom: ti < unit.topics.length - 1 ? `1px solid ${PALETTE.border}` : "none" }}>
                                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: sub.accent, marginTop: 6, flexShrink: 0 }} />
                                  <span style={{ fontSize: 13, color: PALETTE.text, lineHeight: 1.5 }}>{topic}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}