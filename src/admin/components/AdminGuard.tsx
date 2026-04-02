import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

export default function AdminGuard() {
  const user = useAppSelector((state) => state.auth.user);

  if (!user?.role || user.role.roleName !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
