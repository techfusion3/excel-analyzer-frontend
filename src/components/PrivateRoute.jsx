import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const token = useSelector(state => state.user.token);
  
  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the child routes
  return <Outlet />;
}
