import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import { Layout } from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedData";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import Schedule from "./pages/Schedules";
import BuyTickets from "./pages/BuyTickets";
import MyTickets from "./pages/MyTickets";
import AttendeeManagement from "./pages/Attendees";
import AdminDashboard from "./pages/Admin";

function App() {
  return (
    <div className="min-h-screen bg-[#070714]">
<Routes>

  {/* Public */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected */}
  <Route element={<ProtectedRoute />}>
    
    <Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/events" element={<Events />} />
      <Route path="/create" element={<CreateEvent />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/buyTickets" element={<BuyTickets />} />
      <Route path="/myTickets" element={<MyTickets />} />
      <Route path="/attendees" element={<AttendeeManagement />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Route>

  </Route>

</Routes>
    </div>
  );
}

export default App;