import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadService, locationService } from "../services";
import "../styles/CreateLoad.css";

const CreateLoad = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pickupLocation: "",
    dropLocation: "",
    weight: "",
    price: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropDropdown, setShowDropDropdown] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePickupInputChange = async (value) => {
    setFormData((prev) => ({
      ...prev,
      pickupLocation: value,
    }));

    if (value.trim() === "") {
      setPickupSuggestions([]);
      setShowPickupDropdown(false);
    } else if (value.trim().length >= 2) {
      // Only search if at least 2 characters
      try {
        const result = await locationService.getLocationSuggestions(value);
        if (result.success && result.suggestions) {
          // Extract city names from suggestions
          const cities = result.suggestions.map((s) => s.city || s.label);
          // Remove duplicates
          const uniqueCities = [...new Set(cities)];
          setPickupSuggestions(uniqueCities);
          setShowPickupDropdown(true);
        } else {
          setPickupSuggestions([]);
          setShowPickupDropdown(true);
        }
      } catch (err) {
        console.error("Error fetching pickup location suggestions:", err);
        setError("Failed to fetch location suggestions. Please try again.");
        setPickupSuggestions([]);
      }
    }
  };

  const handleDropInputChange = async (value) => {
    setFormData((prev) => ({
      ...prev,
      dropLocation: value,
    }));

    if (value.trim() === "") {
      setDropSuggestions([]);
      setShowDropDropdown(false);
    } else if (value.trim().length >= 2) {
      try {
        const result = await locationService.getLocationSuggestions(value);
        if (result.success && result.suggestions) {
          const cities = result.suggestions.map((s) => s.city || s.label);

          const uniqueCities = [...new Set(cities)];
          setDropSuggestions(uniqueCities);
          setShowDropDropdown(true);
        } else {
          setDropSuggestions([]);
          setShowDropDropdown(true);
        }
      } catch (err) {
        console.error("Error fetching drop location suggestions:", err);
        setError("Failed to fetch location suggestions. Please try again.");
        setDropSuggestions([]);
      }
    }
  };

  const selectPickupCity = (city) => {
    setFormData((prev) => ({
      ...prev,
      pickupLocation: city,
    }));
    setShowPickupDropdown(false);
    setPickupSuggestions([]);
  };

  const selectDropCity = (city) => {
    setFormData((prev) => ({
      ...prev,
      dropLocation: city,
    }));
    setShowDropDropdown(false);
    setDropSuggestions([]);
  };

  const validateForm = () => {
    if (
      !formData.title ||
      !formData.pickupLocation ||
      !formData.dropLocation ||
      !formData.weight ||
      !formData.price
    ) {
      setError("All required fields must be filled");
      return false;
    }
    if (formData.weight <= 0 || formData.price <= 0) {
      setError("Weight and price must be greater than 0");
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
      await loadService.createLoad(formData);
      navigate("/loads");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create load");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-load-container">
      <div className="create-load-box">
        <h2>Create New Load</h2>
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
              <div className="searchable-dropdown">
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={(e) => handlePickupInputChange(e.target.value)}
                  onFocus={() =>
                    formData.pickupLocation.trim() !== "" &&
                    setShowPickupDropdown(true)
                  }
                  placeholder="Search cities..."
                  className="dropdown-input"
                />
                {showPickupDropdown && pickupSuggestions.length > 0 && (
                  <div className="dropdown-list">
                    {pickupSuggestions.map((city) => (
                      <div
                        key={city}
                        className="dropdown-item"
                        onClick={() => selectPickupCity(city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
                {showPickupDropdown &&
                  formData.pickupLocation.trim() !== "" &&
                  pickupSuggestions.length === 0 && (
                    <div className="dropdown-list">
                      <div className="dropdown-no-results">No cities found</div>
                    </div>
                  )}
              </div>
            </div>
            <div className="form-group">
              <label>Drop Location *</label>
              <div className="searchable-dropdown">
                <input
                  type="text"
                  name="dropLocation"
                  value={formData.dropLocation}
                  onChange={(e) => handleDropInputChange(e.target.value)}
                  onFocus={() =>
                    formData.dropLocation.trim() !== "" &&
                    setShowDropDropdown(true)
                  }
                  placeholder="Search cities..."
                  className="dropdown-input"
                />
                {showDropDropdown && dropSuggestions.length > 0 && (
                  <div className="dropdown-list">
                    {dropSuggestions.map((city) => (
                      <div
                        key={city}
                        className="dropdown-item"
                        onClick={() => selectDropCity(city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
                {showDropDropdown &&
                  formData.dropLocation.trim() !== "" &&
                  dropSuggestions.length === 0 && (
                    <div className="dropdown-list">
                      <div className="dropdown-no-results">No cities found</div>
                    </div>
                  )}
              </div>
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
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating..." : "Create Load"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoad;
