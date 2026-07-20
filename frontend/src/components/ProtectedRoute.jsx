import { Navigate } from 'react-router-dom';

import { isLoggedIn, getRole } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const hasToken = isLoggedIn();
  const role = getRole();

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
