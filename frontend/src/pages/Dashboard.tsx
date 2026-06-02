import { useAppSelector } from "../store/hooks";
import AdminHomeDashboard from "./AdminHomeDashboard";
import UserDashboard from "./UserDashboard";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin =
    user?.role === "Admin";

  return isAdmin ? <AdminHomeDashboard /> : <UserDashboard />;
}
