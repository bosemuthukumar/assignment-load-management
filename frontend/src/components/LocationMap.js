import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import "../styles/LocationMap.css";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const libraries = ["places"];

const LocationMap = ({ onLocationSelect, initialLocation = "" }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [searchBoxes, setSearchBoxes] = useState({
    input: "",
    places: [],
  });

  const [markerPosition, setMarkerPosition] = useState({
    lat: 10.8505,
    lng: 76.2711,
  });

  const [selectedAddress, setSelectedAddress] = useState(initialLocation);
  const mapRef = useRef();
  const searchBoxRef = useRef();

  useEffect(() => {
    setSelectedAddress(initialLocation);
  }, [initialLocation]);

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarkerPosition({ lat, lng });

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng },
      });

      if (response.results[0]) {
        const address = response.results[0].formatted_address;
        setSelectedAddress(address);
        onLocationSelect({
          address: address,
          lat: lat,
          lng: lng,
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const onSearchBoxLoad = (ref) => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();

      if (places.length > 0) {
        const place = places[0];

        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          setMarkerPosition({ lat, lng });
          setSelectedAddress(place.formatted_address);

          const searchTerm =
            place.formatted_address ||
            place.name ||
            place.address_components[0]?.long_name ||
            "";

          onLocationSelect({
            address: searchTerm,
            lat: lat,
            lng: lng,
          });

          setSearchBoxes({
            input: searchTerm,
            places: places,
          });

          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(15);
          }
        }
      }
    }
  };

  if (loadError) {
    return (
      <div className="location-map-error">
        <p>❌ Error: Failed to load Google Maps</p>
        <small>
          Check: 1) API Key in .env, 2) API is enabled in Google Cloud
        </small>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="location-map-loading">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="location-map-container">
      <div className="location-search-box">
        <StandaloneSearchBox
          onLoad={onSearchBoxLoad}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search location..."
            className="location-search-input"
            value={searchBoxes.input}
            onChange={(e) =>
              setSearchBoxes({ ...searchBoxes, input: e.target.value })
            }
          />
        </StandaloneSearchBox>
      </div>

      <GoogleMap
        mapContainerClassName="location-google-map"
        center={markerPosition}
        zoom={13}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
        }}
      >
        <Marker position={markerPosition} title="Selected Location" />
      </GoogleMap>

      <div className="location-display">
        <label>Selected Location:</label>
        <input
          type="text"
          value={selectedAddress}
          readOnly
          className="location-display-input"
          placeholder="Click on map or search to select location"
        />
        <small>
          📍 Lat: {markerPosition.lat.toFixed(4)}, Lng:{" "}
          {markerPosition.lng.toFixed(4)}
        </small>
      </div>
    </div>
  );
};

export default LocationMap;
