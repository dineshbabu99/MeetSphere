import { useAppSelector } from "../store/hooks";
// import AdminHomeDashboard from "./AdminHomeDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import AdminDashboard from "./Admin";
import UserDashboard from "./UserDashboard";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin =
    user?.role === "Admin";
  const isOrganizer =
    user?.role === "Event Organizer";

  if (isAdmin) return <AdminDashboard />;
  if (isOrganizer) return <OrganizerDashboard />;

  return <UserDashboard />;
}
