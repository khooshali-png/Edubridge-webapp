import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Imports
import Login from "./login";
import StudentSignup from "./student_signup";
import TeacherSignup from "./teacher_signup";
import StudentDashboard from "./student_dashboard";
import TeacherDashboard from "./teacher_dashboard";
import Attendance from "./attendance";
import Attendance1 from "./attendance1"; 
import Heatmap from "./heatmap";
import Homework from "./homework";
import Exam1 from "./exam1";
import Railway from "./railway";
import BurnoutPredictor from "./burnout";
import Schedule from "./schedule";
import Fees from "./fees";
import Syllabus from "./syllabus"; // NEW IMPORT

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup-student" element={<StudentSignup />} />
        <Route path="/signup-teacher" element={<TeacherSignup />} />

        {/* Dashboards */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />

        {/* Features */}
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/student-attendance" element={<Attendance1 />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/homework" element={<Homework />} />
        <Route path="/exams" element={<Exam1 />} />
        <Route path="/railway" element={<Railway />} />
        <Route path="/burnout" element={<BurnoutPredictor />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/syllabus" element={<Syllabus />} /> {/* NEW ROUTE */}
        
        {/* Fallback */}
        <Route path="*" element={<div style={{color: 'white', padding: '20px'}}>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}