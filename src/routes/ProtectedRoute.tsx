import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export default function ProtectedRoute() {
  const { accessToken } = useAppSelector((state) => state.auth);
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}
