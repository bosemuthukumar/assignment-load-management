const axios = require("axios");

const axiosInstance = axios.create({
  timeout: 15000, // Increased to 15 seconds for better reliability
  headers: {
    "Content-Type": "application/json",
  },
});

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100;
};

const calculateDistance = async (pickupLocation, dropLocation, apiKey) => {
  try {
    if (!pickupLocation || pickupLocation.trim() === "") {
      throw new Error("Pickup location cannot be empty");
    }

    if (!dropLocation || dropLocation.trim() === "") {
      throw new Error("Drop location cannot be empty");
    }

    if (!apiKey) {
      console.warn("OpenRouteService API Key not configured");
      return {
        distance: 0,
        duration: "0m",
        distanceText: "0 km",
        method: "no-api",
        message: "API key not configured",
      };
    }

    console.log(
      `Calculating distance from "${pickupLocation}" to "${dropLocation}"`,
    );

    console.log(`Geocoding pickup location: ${pickupLocation}`);
    const pickupCoords = await getCoordinates(pickupLocation, apiKey);
    console.log(
      `✓ Pickup coords: lat=${pickupCoords.lat}, lng=${pickupCoords.lng}`,
    );

    console.log(`Geocoding drop location: ${dropLocation}`);
    const dropCoords = await getCoordinates(dropLocation, apiKey);
    console.log(` Drop coords: lat=${dropCoords.lat}, lng=${dropCoords.lng}`);

    console.log("Requesting distance from OpenRouteService Matrix API...");
    const url = "https://api.openrouteservice.org/v2/matrix/driving-car";

    const requestPayload = {
      locations: [
        [pickupCoords.lng, pickupCoords.lat],
        [dropCoords.lng, dropCoords.lat],
      ],
    };

    console.log("Request payload:", JSON.stringify(requestPayload, null, 2));

    const response = await axiosInstance.post(url, requestPayload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response received successfully");

    if (!response.data || !response.data.distances) {
      console.warn(
        "Invalid response from OpenRouteService - using Haversine fallback",
      );
      console.warn("Response data:", JSON.stringify(response.data, null, 2));
      const fallbackDistance = haversineDistance(
        pickupCoords.lat,
        pickupCoords.lng,
        dropCoords.lat,
        dropCoords.lng,
      );

      const durationMinutes = Math.round((fallbackDistance / 60) * 60);
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      return {
        distance: fallbackDistance,
        duration: duration,
        distanceText: `${fallbackDistance} km`,
        method: "haversine-fallback",
        message: "Using fallback calculation",
      };
    }

    const distanceInMeters = response.data.distances[0][1];
    const distanceInKm = distanceInMeters / 1000;
    console.log(`✓ Distance: ${distanceInKm.toFixed(2)} km`);

    const durationInSeconds = response.data.durations[0][1];
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    console.log(`✓ Duration: ${duration}`);

    return {
      distance: Math.round(distanceInKm * 100) / 100,
      duration: duration,
      distanceText: `${Math.round(distanceInKm * 100) / 100} km`,
      method: "openrouteservice",
    };
  } catch (error) {
    console.error("❌ Distance calculation error:", error.message);

    if (error.response) {
      console.error("📍 HTTP Error Details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        errorMessage:
          error.response.data?.error?.message ||
          error.response.data?.error ||
          "Unknown error",
        apiKey: apiKey ? "***" + apiKey.slice(-4) : "Not provided",
        coordinates: {
          pickupLocation,
          dropLocation,
        },
      });

      console.error(
        "📋 Full API response:",
        JSON.stringify(error.response.data, null, 2),
      );

      if (error.response.status === 401 || error.response.status === 403) {
        console.error("🔑 Authentication error: Invalid or expired API key");
      } else if (error.response.status === 429) {
        console.error(
          "⚠️  Rate limit exceeded: Too many requests to OpenRouteService",
        );
      } else if (error.response.status === 400) {
        console.error(
          "❌ Bad request: Check coordinates format and API parameters",
        );
      }
    } else if (error.request) {
      console.error("⏱️  No response received from API (timeout):", {
        url: error.config?.url,
        timeout: error.config?.timeout,
        message: error.message,
      });
    } else {
      console.error("❌ Error setting up request:", {
        errorType: error.name,
        errorMessage: error.message,
      });
    }

    // Return default values instead of throwing error - let load creation continue
    console.log(
      "⚠️  Distance calculation disabled. Load will be created without distance/duration.",
    );
    return {
      distance: null,
      duration: null,
      distanceText: "N/A",
      method: "none",
      error: error.message,
      message:
        "Distance calculation unavailable. API timeout or misconfigured.",
    };
  }
};

const getCoordinates = async (address, apiKey) => {
  try {
    if (!address || address.trim() === "") {
      throw new Error("Address cannot be empty");
    }

    if (!apiKey) {
      throw new Error("API Key not configured for geocoding");
    }

    const url = "https://api.openrouteservice.org/geocode/search";

    console.log(` Geocoding API URL: ${url}`);
    console.log(` Address to geocode: "${address}"`);

    const response = await axiosInstance.get(url, {
      params: {
        text: address,
        size: 1,
      },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    console.log(` Geocoding response received for "${address}"`);

    if (!response.data) {
      throw new Error("Empty response from OpenRouteService");
    }

    if (!response.data.features || response.data.features.length === 0) {
      throw new Error(`No results found for address: "${address}"`);
    }

    const coords = response.data.features[0].geometry.coordinates;

    if (!coords || coords.length < 2) {
      throw new Error(`Invalid coordinates returned for: "${address}"`);
    }

    console.log(` Geocoded "${address}" to: [${coords[0]}, ${coords[1]}]`);

    return {
      lat: coords[1],
      lng: coords[0],
    };
  } catch (error) {
    console.log(` Geocoding error for "${address}":`, error.message);

    if (error.response) {
      console.error("📍 Geocoding HTTP Error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("⏱️  Geocoding timeout - no response from API:", {
        timeout: error.config?.timeout,
        message: error.message,
      });
    }

    throw error;
  }
};

module.exports = {
  calculateDistance,
  getCoordinates,
};
