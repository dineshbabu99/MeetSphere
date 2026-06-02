import {
  Routes,
  Route,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import Schedule from "./pages/Schedules";
import UserSchedule from "./pages/UserSchedule";
import BuyTickets from "./pages/BuyTickets";
import MyTickets from "./pages/MyTickets";
import AttendeeManagement from "./pages/Attendees";
import AdminDashboard from "./pages/Admin";
import Analytics from "./pages/Analytics";
import EditEvent from "./pages/EditEvent";
import UserDetails from "./pages/UserDetails";
import { Layout }
from "./layouts/Layout";
import ProtectedRoute
from "./components/ProtectedData";
import RoleProtectedRoute from "./components/RoleProtectedRoute";


function App() {

  return (
    <div className="min-h-screen bg-[#070714]">

      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/register"element={<Register />}/>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/"element={<Dashboard />}/>
            <Route path="/events" element={<Events />}/>
            <Route path="/buyTickets" element={<BuyTickets />}/>
            <Route path="/myTickets" element={<MyTickets />} />
            <Route path="/my-schedule" element={<UserSchedule />} />
            <Route path="/user-details" element={<UserDetails />} />

            <Route element={ <RoleProtectedRoute allowedRoles={["Admin", "Event Organizer"]}/>}>
              <Route path="/create" element={ <CreateEvent /> } />
              <Route path="/schedule" element={<Schedule /> }/>
              <Route path="/attendees" element={ <AttendeeManagement /> } />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/events/:id/edit" element={<EditEvent />} />
            </Route>

            <Route element={ <RoleProtectedRoute allowedRoles={["Admin"]}/>}>
              <Route path="/admin" element={ <AdminDashboard />}/>
            </Route>
          </Route>
        </Route>



        <Route path="*" element={<h1> 404 Not Found </h1> } />
      </Routes>
    </div>
  );
}

export default App;
