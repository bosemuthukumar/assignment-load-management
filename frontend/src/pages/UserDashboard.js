import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService, loadService } from "../services";
import Sidebar from "../components/Sidebar";
import { getUserMenuItems } from "../config/menuConfig";
import { FiBox, FiMail, FiUser } from "react-icons/fi";
import "../styles/Dashboard.css";

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="stat-panel">
    <div className="stat-icon" style={{ backgroundColor: `${color}20` }}>
      <Icon size={28} style={{ color }} />
    </div>
    <div className="stat-info">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
  </div>
);

const UserDashboard = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loads, setLoads] = useState([]);
  const [loadingLoads, setLoadingLoads] = useState(true);

  const fetchUserLoads = async () => {
    try {
      setLoadingLoads(true);
      const response = await loadService.getLoads();

      const userLoads = (response.loads || []).filter(
        (load) => load.createdBy === user?.id,
      );
      setLoads(userLoads);
    } catch (error) {
      console.error("Error fetching loads:", error);
    } finally {
      setLoadingLoads(false);
    }
  };

  useEffect(() => {
    fetchUserLoads();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/user/login");
  };

  const menuItems = getUserMenuItems(navigate);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        isActive={isActive}
        handleLogout={handleLogout}
        sidebarTitle={{ icon: FiUser, text: "User" }}
      />

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="stats-grid">
            <StatCard
              icon={FiBox}
              title="My Loads"
              value={loads.length}
              color="#3b82f6"
            />
            <StatCard
              icon={FiUser}
              title="Name"
              value={user?.name || "User"}
              color="#10b981"
            />
            <StatCard
              icon={FiMail}
              title="Email"
              value={user?.email?.split("@")[0] || "N/A"}
              color="#f59e0b"
            />
            <StatCard
              icon={FiBox}
              title="Role"
              value={user?.role?.toUpperCase() || "USER"}
              color="#8b5cf6"
            />
          </div>

          <div className="chart-table-container">
            <div className="table-panel">
              <div className="table-header">
                <h3>My Recent Loads</h3>
                <button
                  onClick={() => navigate("/create-load")}
                  className="btn-view-all"
                >
                  + Create Load
                </button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Load ID</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Status</th>
                      <th>Weight</th>
                      <th>Price</th>
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
                          Loading your loads...
                        </td>
                      </tr>
                    ) : loads.length > 0 ? (
                      loads.map((load) => (
                        <tr key={load.id}>
                          <td className="load-id">#{load.id}</td>
                          <td>{load.pickupLocation}</td>
                          <td>{load.dropLocation}</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                backgroundColor:
                                  load.status === "Completed"
                                    ? "#10b981"
                                    : load.status === "In Progress"
                                      ? "#3b82f6"
                                      : "#f59e0b",
                              }}
                            >
                              {load.status}
                            </span>
                          </td>
                          <td>{load.weight} kg</td>
                          <td>${load.price}</td>
                          <td>
                            <button
                              className="btn-edit"
                              onClick={() => navigate(`/load/${load.id}`)}
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
                          No loads created yet.{" "}
                          <button
                            onClick={() => navigate("/create-load")}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#3b82f6",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Create one now
                          </button>
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

export default UserDashboard;
