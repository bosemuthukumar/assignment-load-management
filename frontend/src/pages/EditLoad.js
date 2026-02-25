import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadService } from "../services";
import "../styles/EditLoad.css";

const EditLoad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pickupLocation: "",
    dropLocation: "",
    weight: "",
    price: "",
    status: "Pending",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchLoad();
  }, [id]);

  const fetchLoad = async () => {
    try {
      const response = await loadService.getLoadById(id);
      setFormData(response.load);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch load");
    } finally {
      setFetching(false);
    }
  };

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

    if (
      !formData.title ||
      !formData.pickupLocation ||
      !formData.dropLocation ||
      !formData.weight ||
      !formData.price
    ) {
      setError("All required fields must be filled");
      return;
    }

    setLoading(true);
    try {
      await loadService.updateLoad(id, formData);
      navigate("/loads");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update load");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading">Loading load...</div>;
  }

  return (
    <div className="edit-load-container">
      <div className="edit-load-box">
        <h2>Edit Load</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Load title"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Load description"
              rows="4"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Pickup Location *</label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Pickup location"
              />
            </div>
            <div className="form-group">
              <label>Drop Location *</label>
              <input
                type="text"
                name="dropLocation"
                value={formData.dropLocation}
                onChange={handleChange}
                placeholder="Drop location"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Weight (kg) *</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                step="0.01"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Updating..." : "Update Load"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLoad;
