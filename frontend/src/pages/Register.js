import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services";
import "../styles/Auth.css";

const Register = ({ type = "user" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await authService.register(formData, isAdmin ? "admin" : "user");

      navigate(isAdmin ? "/admin/dashboard" : "/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getOtherRegisterUrl = () => {
    return isAdmin ? "/user/register" : "/admin/register";
  };

  const getOtherRegisterText = () => {
    return isAdmin ? "User Registration" : "Admin Registration";
  };

  return (
    <div className="auth-container">
      <div
        className={`auth-box ${isAdmin ? "admin-login-box" : "user-login-box"}`}
      >
        <h2>{isAdmin ? "Admin Registration" : "User Registration"}</h2>

        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
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
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary ${isAdmin ? "btn-admin" : "btn-user"}`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {/* <p className="auth-link">
          <Link to={getOtherRegisterUrl()}>
            ← Switch to {getOtherRegisterText()}
          </Link>
        </p> */}
        <p className="auth-link">
          Already have an account?{" "}
          <Link to={isAdmin ? "/admin/login" : "/user/login"}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
