import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Layout } from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedData";
import Events from "./pages/Events";

function App() {
  return (
    <div className="min-h-screen bg-[#070714]">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
  <Route path="/" element={<Dashboard />} />
  <Route path="/events" element={<Events />}/>
  <Route path="*" element={<h1>404 Not Found</h1>} />
</Route>
      </Routes>
    </div>
  );
}

export default App;