import React from "react";
import { Link } from "react-router-dom";
import "../styles/LoadCard.css";

const LoadCard = ({ load, onDelete }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "badge-pending";
      case "Booked":
        return "badge-booked";
      case "Completed":
        return "badge-completed";
      default:
        return "";
    }
  };

  return (
    <div className="load-card">
      <div className="card-header">
        <h3>{load.title}</h3>
        <span className={`badge ${getStatusBadgeClass(load.status)}`}>
          {load.status}
        </span>
      </div>
      <div className="card-body">
        <p className="description">{load.description}</p>
        <div className="location-info">
          <div className="location">
            <strong>Pickup:</strong> {load.pickupLocation}
          </div>
          <div className="location">
            <strong>Drop:</strong> {load.dropLocation}
          </div>
        </div>
        <div className="route-info">
          {load.distance && (
            <div className="route-item">
              <strong>Distance:</strong> {load.distance} km
            </div>
          )}
          {load.duration && (
            <div className="route-item">
              <strong>Duration:</strong> {load.duration}
            </div>
          )}
        </div>
        <div className="details">
          <div className="detail-item">
            <strong>Weight:</strong> {load.weight} kg
          </div>
          <div className="detail-item">
            <strong>Price:</strong> ${load.price}
          </div>
          <div className="detail-item">
            <strong>Posted by:</strong> {load.creator?.name}
          </div>
        </div>
      </div>
      <div className="card-footer">
        <Link to={`/edit-load/${load.id}`} className="btn-edit">
          Edit
        </Link>
        <button onClick={() => onDelete(load.id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
};

export default LoadCard;
