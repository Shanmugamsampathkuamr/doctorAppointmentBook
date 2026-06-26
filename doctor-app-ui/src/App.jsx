import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Layout from './components/Layout';
import PatientHome from './pages/PatientHome';
import MyAppointments from './pages/MyAppointments';
import DoctorHome from './pages/DoctorHome';
import AdminHome from './pages/AdminHome';

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  const getDefaultRoute = () => {
    if (!token) return '/';
    if (role === 'PATIENT') return '/patient-home';
    if (role === 'DOCTOR') return '/doctor-home';
    if (role === 'ADMIN') return '/admin-home';
    return '/';
  };

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={token ? <Navigate to={getDefaultRoute()} /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to={getDefaultRoute()} /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/patient-home" element={<ProtectedRoute roles={['PATIENT']}><Layout role="PATIENT"><PatientHome /></Layout></ProtectedRoute>} />
      <Route path="/my-appointments" element={<ProtectedRoute roles={['PATIENT']}><Layout role="PATIENT"><MyAppointments /></Layout></ProtectedRoute>} />
      <Route path="/doctor-home" element={<ProtectedRoute roles={['DOCTOR']}><Layout role="DOCTOR"><DoctorHome /></Layout></ProtectedRoute>} />
      <Route path="/admin-home" element={<ProtectedRoute roles={['ADMIN']}><Layout role="ADMIN"><AdminHome /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
    </Routes>
  );
}
