import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientHome from './pages/PatientHome';
import DoctorHome from './pages/DoctorHome';
import AdminHome from './pages/AdminHome';
import MyAppointments from './pages/MyAppointments';
import ForgotPassword from './pages/ForgotPassword';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) return <Navigate to="/login" />;

  if (allowedRole && userRole !== allowedRole) {
    if (userRole === 'ADMIN') return <Navigate to="/admin-home" />;
    if (userRole === 'DOCTOR') return <Navigate to="/doctor-home" />;
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '1rem',
            background: '#0f172a',
            color: '#fff',
          },
        }}
      />

      <Routes>
        {/* --- 1. PUBLIC ACCESS --- */}
        <Route path="/" element={<PatientHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* --- 2. PROTECTED ACCESS --- */}
        <Route path="/my-appointments" element={
          <ProtectedRoute allowedRole="PATIENT">
            <MyAppointments />
          </ProtectedRoute>
        } />

        <Route path="/doctor-home" element={
          <ProtectedRoute allowedRole="DOCTOR">
            <DoctorHome />
          </ProtectedRoute>
        } />

        <Route path="/admin-home" element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminHome />
          </ProtectedRoute>
        } />

        {/* --- 3. CLEANUP & CATCH-ALL (Must be at the very bottom) --- */}
        <Route path="/patient-home" element={<Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;