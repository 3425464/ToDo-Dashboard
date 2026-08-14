import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Todo";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;