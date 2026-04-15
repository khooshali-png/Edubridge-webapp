import React from "react";
import { useNavigate } from "react-router-dom";

const S = {
  page: { 
    background: "#14171a", 
    minHeight: "100vh", 
    fontFamily: "'Segoe UI', sans-serif", 
    color: "#d1d8e0",
    paddingBottom: "40px"
  },
  header: { 
    display: "flex", 
    alignItems: "center", 
    padding: "14px 28px", 
    background: "#1e242a", 
    borderBottom: "1px solid #2a3340",
    position: "sticky",
    top: 0,
    zIndex: 50
  },
  backBtn: { 
    background: "none", 
    border: "none", 
    cursor: "pointer", 
    color: "#2a9d8f", 
    fontSize: "20px",
    marginRight: "16px",
    display: "flex",
    alignItems: "center"
  },
  headerTitle: { fontSize: 18, fontWeight: 800, color: "#d1d8e0", margin: 0 },
  body: { padding: "24px 28px" },
  
  // Stats Section
  sectionLabel: { fontSize: 10, color: "#6b7f90", letterSpacing: 2, margin: "0 0 8px", fontWeight: 700 },
  totalAmount: { fontSize: 48, fontWeight: 900, color: "#d1d8e0", margin: 0 },
  subNote: { fontSize: 13, color: "#6b7f90", marginTop: 8, maxWidth: "600px" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 },
  miniCard: { 
    background: "#1e242a", 
    padding: "20px", 
    borderRadius: 16, 
    boxShadow: "0 4px 24px rgba(0,0,0,.3)",
    border: "1px solid #2a3340"
  },
  
  // Pending Card
  pendingCard: {
    background: "#1e242a",
    borderRadius: 16,
    padding: "24px",
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeft: "4px solid #e67e22",
    boxShadow: "0 4px 24px rgba(0,0,0,.3)"
  },
  payBtn: {
    background: "#2a9d8f",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.2s"
  },
  
  // History
  historyCard: {
    background: "#1e242a",
    borderRadius: 12,
    padding: "16px",
    marginBottom: 12,
    border: "1px solid #2a3340",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: 800,
    padding: "4px 10px",
    borderRadius: 6,
    background: "#1a2e2c",
    color: "#2a9d6e",
    border: "1px solid #2a9d6e"
  }
};

export default function Fees() {
  const navigate = useNavigate();

  const history = [
    { date: "Sept 12, 2024", label: "Library Access Fee", amount: "₹5,000", status: "PAID" },
    { date: "Aug 30, 2024", label: "Enrollment Deposit", amount: "₹5,000", status: "PAID" },
  ];

  return (
    <div style={S.page}>
      <div style={S.header}>
        <button onClick={() => navigate("/student")} style={S.backBtn}>←</button>
        <h2 style={S.headerTitle}>Student Ledger</h2>
      </div>

      <div style={S.body}>
        <p style={S.sectionLabel}>CURRENT OUTSTANDING</p>
        <h1 style={S.totalAmount}>₹25,000<span style={{color: "#2a9d8f"}}>.00</span></h1>
        <p style={S.subNote}>Total billed amount for the academic year 2024-25. Please ensure timely payments to avoid late registration charges.</p>

        <div style={S.grid}>
          <div style={S.miniCard}>
            <p style={{...S.sectionLabel, color: "#e67e22"}}>PENDING</p>
            <p style={{fontSize: 22, fontWeight: 800, margin: 0}}>₹15,000.00</p>
          </div>
          <div style={S.miniCard}>
            <p style={{...S.sectionLabel, color: "#2a9d8f"}}>TOTAL PAID</p>
            <p style={{fontSize: 22, fontWeight: 800, margin: 0}}>₹10,000.00</p>
          </div>
        </div>

        <h3 style={{marginTop: 40, fontSize: 18, fontWeight: 800}}>🔔 Action Required</h3>
        <div style={S.pendingCard}>
          <div>
            <p style={{color: "#e67e22", fontSize: 11, fontWeight: 800, margin: "0 0 4px"}}>DUE BY OCT 15, 2024</p>
            <h4 style={{margin: 0, fontSize: 18}}>Semester 2 Tuition Fee</h4>
            <p style={{color: "#6b7f90", fontSize: 13, marginTop: 4}}>Installment 1 of 2</p>
          </div>
          <div style={{textAlign: "right"}}>
            <p style={{fontSize: 24, fontWeight: 900, marginBottom: 12}}>₹10,000</p>
            <button style={S.payBtn} onClick={() => alert("Redirecting to gateway...")}>Pay Securely</button>
          </div>
        </div>

        <h3 style={{marginTop: 40, fontSize: 18, fontWeight: 800, marginBottom: 20}}>📜 Payment History</h3>
        {history.map((item, index) => (
          <div key={index} style={S.historyCard}>
            <div>
              <p style={{margin: 0, fontWeight: 700}}>{item.label}</p>
              <p style={{margin: 0, fontSize: 12, color: "#6b7f90"}}>{item.date}</p>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: 16}}>
              <span style={{fontWeight: 800}}>{item.amount}</span>
              <span style={S.statusBadge}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}