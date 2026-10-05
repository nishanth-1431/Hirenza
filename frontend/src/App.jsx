import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Landing from './pages/Landing';
import StudentDashboard from './pages/student/StudentDashboard';
import TpoDashboard from './pages/tpo/TpoDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRole="TPO" />}>
            <Route path="/tpo/dashboard" element={<TpoDashboard />} />
          </Route>
          
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
