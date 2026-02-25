import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services";
import "../styles/Auth.css";

const Login = ({ type = "user" }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isAdmin = type === "admin";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      await authService.login(formData, isAdmin ? "admin" : "user");

      navigate(isAdmin ? "/admin/dashboard" : "/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const getOtherLoginUrl = () => {
    return isAdmin ? "/user/login" : "/admin/login";
  };

  const getOtherLoginText = () => {
    return isAdmin ? "User Login" : "Admin Login";
  };

  return (
    <div className="auth-container">
      <div
        className={`auth-box ${isAdmin ? "admin-login-box" : "user-login-box"}`}
      >
        <h2>{isAdmin ? "Admin Login" : "User Login"}</h2>
        <p className="login-subtitle">
          {isAdmin ? "Administrator Access" : "User Access"}
        </p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary ${isAdmin ? "btn-admin" : "btn-user"}`}
          >
            {loading
              ? "Logging in..."
              : `Login as ${isAdmin ? "Admin" : "User"}`}
          </button>
        </form>
        <p className="auth-link">
          <Link to={getOtherLoginUrl()}>← Switch to {getOtherLoginText()}</Link>
        </p>
        <p className="auth-link">
          Don't have an account?{" "}
          <Link to={isAdmin ? "/admin/register" : "/user/register"}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
