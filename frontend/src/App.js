import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import LoadList from "./pages/LoadList";
import CreateLoad from "./pages/CreateLoad";
import EditLoad from "./pages/EditLoad";

import "./styles/App.css";

const DashboardLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={<Navigate to="/user/register" replace />}
        />
        <Route path="/admin/register" element={<Register type="admin" />} />
        <Route path="/user/register" element={<Register type="user" />} />
        <Route path="/login" element={<Navigate to="/user/login" replace />} />
        <Route path="/admin/login" element={<Login type="admin" />} />
        <Route path="/user/login" element={<Login type="user" />} />
        <Route
          path="/admin/dashboard"
          element={
            <DashboardLayout>
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            </DashboardLayout>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <DashboardLayout>
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </DashboardLayout>
          }
        />
        <Route
          path="/loads"
          element={
            <DashboardLayout>
              <ProtectedRoute>
                <LoadList />
              </ProtectedRoute>
            </DashboardLayout>
          }
        />
        <Route
          path="/create-load"
          element={
            <DashboardLayout>
              <ProtectedRoute>
                <CreateLoad />
              </ProtectedRoute>
            </DashboardLayout>
          }
        />
        <Route
          path="/edit-load/:id"
          element={
            <DashboardLayout>
              <ProtectedRoute>
                <EditLoad />
              </ProtectedRoute>
            </DashboardLayout>
          }
        />
        <Route path="/" element={<Navigate to="/user/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
