
import { Navigate } from 'react-router-dom'
// import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../common/Spinner'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;