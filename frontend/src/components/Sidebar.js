import React from "react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  menuItems,
  isActive,
  handleLogout,
  sidebarTitle,
}) => {
  return (
    <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {sidebarOpen && (
          <h2 className="sidebar-title">
            {typeof sidebarTitle === "object" ? (
              <>
                {sidebarTitle.icon && (
                  <span
                    style={{
                      marginRight: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <sidebarTitle.icon size={20} />
                  </span>
                )}
                {sidebarTitle.text}
              </>
            ) : (
              sidebarTitle
            )}
          </h2>
        )}

        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const IconComponent = item.iconComponent;
          return (
            <button
              key={item.path}
              className={`menu-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => {
                item.onClick();
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
            >
              {IconComponent && (
                <span className="menu-icon">
                  <IconComponent size={18} />
                </span>
              )}
              {sidebarOpen && <span className="menu-label">{item.name}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-logout">
          {sidebarOpen && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
