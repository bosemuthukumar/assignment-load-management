import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";

const Dashboard = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/user/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return null;
};

export default Dashboard;
