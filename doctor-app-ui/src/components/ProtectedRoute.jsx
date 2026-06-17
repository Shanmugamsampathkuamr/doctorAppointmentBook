import { Navigate } from 'react-router-dom';

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

export default ProtectedRoute;