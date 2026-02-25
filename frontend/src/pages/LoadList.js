import React, { useState, useEffect } from "react";
import { loadService } from "../services";
import LoadCard from "../components/LoadCard";
import "../styles/LoadList.css";

const LoadList = () => {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    pickupLocation: "",
    dropLocation: "",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
  });

  useEffect(() => {
    fetchLoads();
  }, [filters]);

  const fetchLoads = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await loadService.getLoads(filters);
      setLoads(response.loads);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch loads");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this load?")) {
      try {
        await loadService.deleteLoad(id);
        setLoads(loads.filter((load) => load.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete load");
      }
    }
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div className="load-list-container">
      <div className="filter-section">
        <input
          type="text"
          name="search"
          placeholder="Search loads..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Booked">Booked</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading loads...</div>
      ) : (
        <>
          {loads.length === 0 ? (
            <div className="no-loads">No loads found</div>
          ) : (
            <div className="loads-grid">
              {loads.map((load) => (
                <LoadCard key={load.id} load={load} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoadList;
