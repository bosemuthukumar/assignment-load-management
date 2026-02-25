import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService, loadService } from "../services";
import Sidebar from "../components/Sidebar";
import { getAdminMenuItems } from "../config/menuConfig";

import { FiBox, FiUsers, FiCheck, FiClock, FiShield } from "react-icons/fi";
import "../styles/Dashboard.css";

const getStatusColor = (status) => {
  const colors = {
    Completed: "#10b981",
    "In Progress": "#3b82f6",
    Pending: "#f59e0b",
    Cancelled: "#ef4444",
  };
  return colors[status] || "#6b7280";
};

const StatPanel = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className="stat-panel">
    <div className="stat-icon" style={{ backgroundColor: `${color}20` }}>
      <Icon size={28} style={{ color }} />
    </div>
    <div className="stat-info">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
      <p className="stat-subtitle">{subtitle}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loads, setLoads] = useState([]);
  const [stats, setStats] = useState({
    totalLoads: 0,
    completedLoads: 0,
    inProgressLoads: 0,
    activeUsers: 0,
  });
  const [loadingLoads, setLoadingLoads] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoads = async () => {
    try {
      setLoadingLoads(true);
      const response = await loadService.getLoads();
      setLoads(response.loads || []);

      const allLoads = response.loads || [];
      const completed = allLoads.filter(
        (load) => load.status === "Completed",
      ).length;
      const inProgress = allLoads.filter(
        (load) => load.status === "In Progress",
      ).length;
      const uniqueUsers = new Set(allLoads.map((load) => load.createdBy)).size;

      setStats({
        totalLoads: allLoads.length,
        completedLoads: completed,
        inProgressLoads: inProgress,
        activeUsers: uniqueUsers,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching loads:", err);
      setError("Failed to load data");
    } finally {
      setLoadingLoads(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/admin/login");
  };

  const menuItems = getAdminMenuItems(navigate);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        isActive={isActive}
        handleLogout={handleLogout}
        sidebarTitle={{ icon: FiShield, text: "Admin" }}
      />

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="stats-grid">
            <StatPanel
              icon={FiBox}
              title="Total Loads"
              value={stats.totalLoads}
              subtitle={`+${Math.max(0, stats.totalLoads - 256)} this week`}
              color="#3b82f6"
            />
            <StatPanel
              icon={FiCheck}
              title="Completed"
              value={stats.completedLoads}
              subtitle={`${stats.totalLoads > 0 ? Math.round((stats.completedLoads / stats.totalLoads) * 100) : 0}% completion rate`}
              color="#10b981"
            />
            <StatPanel
              icon={FiClock}
              title="In Progress"
              value={stats.inProgressLoads}
              subtitle={`${stats.totalLoads > 0 ? Math.round((stats.inProgressLoads / stats.totalLoads) * 100) : 0}% of active loads`}
              color="#f59e0b"
            />
            <StatPanel
              icon={FiUsers}
              title="Active Users"
              value={stats.activeUsers}
              subtitle={`+${Math.max(0, stats.activeUsers - 42)} new users`}
              color="#8b5cf6"
            />
          </div>

          <div className="chart-table-container">
            <div className="table-panel">
              <div className="table-header">
                <h3>Recent Loads</h3>
                <button
                  onClick={() => navigate("/loads")}
                  className="btn-view-all"
                >
                  View All →
                </button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Load ID</th>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Distance</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingLoads ? (
                      <tr>
                        <td
                          colSpan="7"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          Loading loads...
                        </td>
                      </tr>
                    ) : loads.length > 0 ? (
                      loads.slice(0, 5).map((load) => (
                        <tr key={load.id}>
                          <td className="load-id">#{load.id}</td>
                          <td>{load.pickupLocation}</td>
                          <td>{load.dropLocation}</td>
                          <td>{load.distance ? `${load.distance} km` : "-"}</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                backgroundColor: getStatusColor(load.status),
                              }}
                            >
                              {load.status}
                            </span>
                          </td>
                          <td>
                            {load.createdAt
                              ? new Date(load.createdAt).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>
                            <button
                              className="btn-edit"
                              onClick={() => navigate(`/loads`)}
                              // onClick={() => navigate(`/load/${load.id}`)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          No loads available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
