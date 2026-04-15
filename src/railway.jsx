import React, { useState, useRef } from "react";
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

// ── Generate certificate HTML and trigger download ──
function downloadCertificate(travelClass) {
  const classLabel = travelClass === "first" ? "FIRST" : "SECOND";
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Railway Concession Certificate</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Inter', Arial, sans-serif; background:#f0f0f0; display:flex; justify-content:center; align-items:center; min-height:100vh; padding:24px; }
  .card { background:#fff; width:700px; border-radius:10px; overflow:hidden; box-shadow:0 8px 40px rgba(0,0,0,.15); }
  .header { display:flex; align-items:center; justify-content:space-between; padding:22px 28px; border-bottom:1px solid #eee; }
  .logo-circle { width:60px; height:60px; background:#c0392b; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; font-size:9px; font-weight:900; line-height:1.3; text-align:center; }
  .brand { margin-left:14px; }
  .brand h1 { font-size:22px; font-weight:900; color:#c0392b; letter-spacing:1px; }
  .brand p { font-size:10px; color:#888; letter-spacing:1.5px; margin-top:2px; }
  .serial { text-align:right; }
  .serial .label { font-size:10px; color:#888; }
  .serial .num { font-size:16px; font-weight:900; color:#c0392b; margin-top:2px; }
  .ribbon { background:#c0392b; color:#fff; text-align:center; padding:11px; font-size:13px; font-weight:800; letter-spacing:3px; }
  .body { display:flex; padding:28px; gap:28px; }
  .left { width:185px; flex-shrink:0; }
  .photo { width:185px; height:200px; background:#222; border-radius:4px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
  .photo img { width:100%; height:100%; object-fit:cover; }
  .photo-placeholder { color:#fff; font-size:48px; display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:linear-gradient(135deg,#2a9d8f,#1e7a6e); }
  .verified { background:#1a1a2a; color:#2a9d8f; font-size:9px; font-weight:800; text-align:center; padding:5px; margin-top:5px; letter-spacing:2px; border-radius:2px; }
  .qr-box { width:185px; height:80px; background:#fde8e8; border-radius:4px; margin-top:10px; display:flex; align-items:center; justify-content:center; font-size:9px; color:#888; letter-spacing:1px; flex-direction:column; gap:4px; }
  .right { flex:1; }
  .field-label { font-size:9px; color:#888; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:4px; }
  .field-value { font-size:20px; font-weight:800; color:#111; margin-bottom:14px; }
  .field-row { display:flex; gap:32px; margin-bottom:14px; }
  .field-small .field-value { font-size:14px; }
  .inst-block { border-left:3px solid #2a9d8f; padding-left:12px; margin-bottom:14px; position:relative; }
  .inst-block h3 { font-size:16px; font-weight:800; color:#111; }
  .inst-block p { font-size:10px; color:#888; margin-top:2px; }
  .approved-stamp { position:absolute; right:0; top:0; width:58px; height:58px; border-radius:50%; border:2px solid #27ae60; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:8px; font-weight:900; color:#27ae60; text-align:center; line-height:1.4; }
  .route-row { display:flex; gap:10px; margin-bottom:14px; }
  .route-box { background:#f5f5f5; border-radius:6px; padding:8px 14px; text-align:center; }
  .route-box .rl { font-size:9px; color:#888; font-weight:700; letter-spacing:1px; }
  .route-box .rv { font-size:13px; font-weight:900; color:#111; margin-top:2px; }
  .arrow { display:flex; align-items:center; color:#888; font-size:18px; padding-top:8px; }
  .validity-bar { background:#1a1a2a; border-radius:8px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; }
  .vf .vl { font-size:9px; color:#aaa; letter-spacing:1.5px; }
  .vf .vv { font-size:15px; font-weight:900; color:#fff; margin-top:3px; }
  .divider-v { width:1px; background:#333; }
  .vu .vl { font-size:9px; color:#aaa; letter-spacing:1.5px; text-align:right; }
  .vu .vv { font-size:15px; font-weight:900; color:#f4a261; margin-top:3px; text-align:right; }
  .footer { border-top:1px solid #eee; padding:16px 28px; display:flex; justify-content:space-between; align-items:flex-end; }
  .footer p { font-size:9px; color:#aaa; max-width:320px; line-height:1.7; }
  .signature { text-align:right; }
  .signature .sig-name { font-size:13px; font-weight:700; color:#2a5fa5; font-style:italic; }
  .signature .sig-title { font-size:9px; color:#888; font-weight:700; letter-spacing:1px; margin-top:4px; border-top:1px solid #ccc; padding-top:4px; }
  .watermark { position:fixed; opacity:.04; font-size:80px; font-weight:900; transform:rotate(-30deg); color:#000; pointer-events:none; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-30deg); }
</style>
</head>
<body>
<div style="position:relative">
  <div class="watermark">APPROVED</div>
  <div class="card">
    <!-- Header -->
    <div class="header">
      <div style="display:flex;align-items:center">
        <div class="logo-circle">WESTERN<br/>RAILWAY</div>
        <div class="brand">
          <h1>WESTERN RAILWAY</h1>
          <p>GOVERNMENT OF INDIA &bull; MINISTRY OF RAILWAYS</p>
        </div>
      </div>
      <div class="serial">
        <div class="label">Serial No.</div>
        <div class="num">WR-2026-094821</div>
      </div>
    </div>

    <!-- Ribbon -->
    <div class="ribbon">SEASON TICKET CONCESSION CERTIFICATE</div>

    <!-- Body -->
    <div class="body">
      <div class="left">
        <div class="photo">
          <div class="photo-placeholder">👩</div>
        </div>
        <div class="verified">IDENTITY VERIFIED</div>
        <div class="qr-box">
          <div style="font-size:28px">▦</div>
          <div>SCAN TO VERIFY</div>
        </div>
      </div>

      <div class="right">
        
        <hr style="border:none;border-top:1px solid #eee;margin-bottom:14px"/>

        <div class="field-row">
          <div class="field-small">
            <div class="field-label">ID NUMBER</div>
            <div class="field-value" style="font-size:14px">ED-2026-9910</div>
          </div>
          <div class="field-small">
            <div class="field-label">DATE OF BIRTH / GENDER</div>
            <div class="field-value" style="font-size:14px">14/05/2004 &bull; FEMALE</div>
          </div>
        </div>

        <div class="inst-block">
          <div class="field-label">EDUCATIONAL INSTITUTION</div>
          <h3>EduBridge University</h3>
          <p>Recognized under Govt. Education Dept.</p>
          <div class="approved-stamp">APPROVED<br/>2025-26</div>
        </div>

        <div class="route-row">
          <div class="route-box">
            <div class="rl">FROM</div>
            <div class="rv">BANDRA</div>
          </div>
          <div class="arrow">→</div>
          <div class="route-box">
            <div class="rl">TO</div>
            <div class="rv">CHURCHGATE</div>
          </div>
          <div class="route-box">
            <div class="rl">CLASS</div>
            <div class="rv">${classLabel}</div>
          </div>
          <div class="route-box">
            <div class="rl">TYPE</div>
            <div class="rv">MST</div>
          </div>
        </div>

        <div class="validity-bar">
          <div class="vf">
            <div class="vl">VALIDITY FROM</div>
            <div class="vv">01 OCT 2025</div>
          </div>
          <div class="divider-v"></div>
          <div class="vu">
            <div class="vl">VALIDITY UNTIL</div>
            <div class="vv">31 JAN 2026</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>This certificate is valid for suburban travel between the stations mentioned above. Misuse is a punishable offense. Non-transferable.</p>
      <div class="signature">
        <div class="sig-name">Authorized Registrar</div>
        <div class="sig-title">PRINCIPAL / REGISTRAR SIGNATURE</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "Railway_Concession_Certificate_Namrata_Sharma.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Railway() {
  const navigate   = useNavigate();
  const fileRef    = useRef(null);
  const [from,     setFrom]     = useState("");
  const [to,       setTo]       = useState("");
  const [tClass,   setTClass]   = useState("second");
  const [duration, setDuration] = useState("monthly");
  const [file,     setFile]     = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("verified");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!file) {
      setError("⚠ Please upload your ID Proof before submitting.");
      return;
    }
    if (!from.trim() || !to.trim()) {
      setError("⚠ Please fill in both travel routes.");
      return;
    }
    setError("");
    setFile(null);
    setSubmitted(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const handleDownload = () => {
    if (!submitted) {
      setError("⚠ Please submit your ID Proof first to download the certificate.");
      return;
    }
    downloadCertificate(tClass);
  };

  const TABS = ["Verified by College", "Approved by Railway"];

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: P.bg, minHeight: "100vh", color: P.text }}>

      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", background: P.card, borderBottom: `1px solid ${P.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#1a3a2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={P.teal}><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-1 13L5 12.5v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3l-6 3.5z"/></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: P.text }}>EduBridge</span>
          </div>
          <span style={{ color: P.border }}>|</span>
          <span style={{ fontSize: 14, color: P.muted }}> </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/student")} style={{ padding: "7px 16px", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.muted, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Dashboard</button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: P.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>NS</div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "28px 36px 60px" }}>

        {/* Page Title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: P.text }}>Railway Concession</h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: P.muted }}>Apply for travel concessions and track your current application status.</p>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div style={{ background: "#1a3a2a", border: `1px solid ${P.teal}`, borderRadius: 10, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: P.teal }}>Application Submitted Successfully!</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: P.muted }}>Your ID proof has been uploaded. You can now download your certificate.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${P.border}`, marginBottom: 24 }}>
          {TABS.map(tab => {
            const key = tab === "Verified by College" ? "verified" : "approved";
            const active = activeTab === key;
            return (
              <button key={tab} onClick={() => setActiveTab(key)}
                style={{ padding: "10px 22px", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: active ? 700 : 400, color: active ? P.teal : P.muted, borderBottom: active ? `2px solid ${P.teal}` : "2px solid transparent", marginBottom: -1 }}>
                {tab}
              </button>
            );
          })}
        </div>

        {/* ── EXISTING APPLICATION CARD ── */}
        <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: "24px 28px", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, background: P.teal + "22", border: `1px solid ${P.teal}44`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🚌</div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: P.text }}>Quarterly Local Pass Concession</h3>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: P.muted }}>Application Reference: #RCA-2026-8942</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 11, fontWeight: 800, background: "#1a3a2a", color: P.teal, border: `1px solid ${P.teal}44`, padding: "4px 12px", borderRadius: 6, letterSpacing: 1 }}>APPROVED</span>
              <p style={{ margin: "6px 0 0", fontSize: 11, color: P.muted }}>Applied on: 24 Oct 2025</p>
            </div>
          </div>

          {/* Progress stepper */}
          <div style={{ position: "relative", margin: "20px 0 28px" }}>
            {/* Line */}
            <div style={{ position: "absolute", top: 18, left: "calc(12.5%)", right: "calc(12.5%)", height: 2, background: P.teal, zIndex: 0 }} />
            <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
              {["Submitted", "College Verified", "Railway Approved", "Ready"].map((step, i) => {
                const done = i < 3;
                const last = i === 3;
                return (
                  <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "25%" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? P.teal : P.card, border: `2px solid ${done ? P.teal : P.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff", marginBottom: 8 }}>
                      {done ? "✓" : <span style={{ width: 10, height: 10, border: "2px solid", borderColor: last ? P.border : P.teal, borderRadius: "50%", display: "block" }} />}
                    </div>
                    <span style={{ fontSize: 11, color: done ? P.text : P.muted, fontWeight: done ? 600 : 400, textAlign: "center" }}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: `1px solid ${P.border}` }}>
            <p style={{ margin: 0, fontSize: 13, color: P.muted }}>Valid until: <strong style={{ color: P.text }}>31 Jan 2026</strong></p>
            <button onClick={handleDownload}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: P.teal, border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 16px ${P.teal}44` }}>
              ⬇ Download Certificate
            </button>
          </div>
          {!submitted && (
            <p style={{ margin: "10px 0 0", fontSize: 12, color: P.rust }}>⚠ Submit your ID Proof in the form below to enable certificate download.</p>
          )}
        </div>

        {/* ── MAIN GRID: Form + Notes ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>

          {/* New Application Form */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: P.text, margin: "0 0 18px" }}>New Application</h2>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: "24px" }}>

              {/* Travel Routes */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: P.muted, display: "block", marginBottom: 6 }}>Travel Route (From)</label>
                  <input value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g. Bandra"
                    style={{ width: "100%", padding: "10px 14px", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: P.muted, display: "block", marginBottom: 6 }}>Travel Route (To)</label>
                  <input value={to} onChange={e => setTo(e.target.value)} placeholder="e.g. Churchgate"
                    style={{ width: "100%", padding: "10px 14px", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              {/* Class + Duration */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: P.muted, display: "block", marginBottom: 6 }}>Class of Travel</label>
                  <select value={tClass} onChange={e => setTClass(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.text, fontSize: 13, outline: "none", cursor: "pointer" }}>
                    <option value="second">Second Class</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: P.muted, display: "block", marginBottom: 6 }}>Duration</label>
                  <select value={duration} onChange={e => setDuration(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.text, fontSize: 13, outline: "none", cursor: "pointer" }}>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              {/* Upload */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: P.muted, display: "block", marginBottom: 8 }}>Supporting Document (ID Proof)</label>
                <div
                  onClick={() => fileRef.current.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  style={{ border: `2px dashed ${file ? P.teal : P.border}`, borderRadius: 10, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: file ? P.teal + "0a" : "transparent", transition: "all .2s" }}>
                  <input ref={fileRef} type="file" style={{ display: "none" }} accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                  {file ? (
                    <div>
                      <p style={{ fontSize: 28, margin: "0 0 8px" }}>✅</p>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: P.teal }}>{file.name}</p>
                      <p style={{ margin: "4px 0 0", fontSize: 11, color: P.muted }}>File selected — click Submit to upload</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: 32, margin: "0 0 8px" }}>📄</p>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: P.text }}>Click to upload or drag and drop</p>
                      <p style={{ margin: "6px 0 0", fontSize: 11, color: P.muted }}>PDF, JPG, PNG (Max 2MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ background: "#3a1a1a", border: `1px solid ${P.rust}44`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                  <p style={{ margin: 0, fontSize: 13, color: P.rust }}>{error}</p>
                </div>
              )}

              {/* Submit */}
              <button onClick={handleSubmit}
                style={{ width: "100%", padding: "13px", background: P.teal, border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 18px ${P.teal}44`, letterSpacing: .3 }}>
                Submit Application
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Important Notes */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: P.text, margin: "0 0 18px" }}>Important Notes</h2>
              <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { icon: "ℹ️", text: "Applications take 3-5 business days for college verification." },
                    { icon: "🕐", text: "Concessions are only valid for travel between your residence and the college." },
                    { icon: "⚠️", text: "Misuse of the concession form is a punishable offense under Railway Law." },
                  ].map((note, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{note.icon}</span>
                      <p style={{ margin: 0, fontSize: 13, color: P.muted, lineHeight: 1.6 }}>{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent History */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: P.text, margin: "0 0 18px" }}>Recent History</h2>
              <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { ref: "#RCA-2026-8942", date: "24 Oct 2025", status: "Approved" },
                  { ref: "#RCA-2025-4421", date: "10 Jul 2025", status: "Approved" },
                  { ref: "#RCA-2025-1103", date: "03 Jan 2025", status: "Expired" },
                ].map((h, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: i < 2 ? 14 : 0, borderBottom: i < 2 ? `1px solid ${P.border}` : "none" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: P.text }}>{h.ref}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 11, color: P.muted }}>{h.date}</p>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 6, letterSpacing: .5,
                      background: h.status === "Approved" ? "#1a3a2a" : "#2a2010",
                      color: h.status === "Approved" ? P.teal : "#f4a261",
                      border: `1px solid ${h.status === "Approved" ? P.teal + "44" : "#f4a26144"}`,
                    }}>{h.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}