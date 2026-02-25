const axios = require("axios");

const ORS_API_KEY = process.env.ORS_API_KEY;

// Fallback list of cities for development
const FALLBACK_CITIES = [
  {
    name: "New York",
    city: "New York",
    country: "United States",
    label: "New York, United States",
  },
  {
    name: "Los Angeles",
    city: "Los Angeles",
    country: "United States",
    label: "Los Angeles, United States",
  },
  {
    name: "Chicago",
    city: "Chicago",
    country: "United States",
    label: "Chicago, United States",
  },
  {
    name: "Houston",
    city: "Houston",
    country: "United States",
    label: "Houston, United States",
  },
  {
    name: "Phoenix",
    city: "Phoenix",
    country: "United States",
    label: "Phoenix, United States",
  },
  {
    name: "Philadelphia",
    city: "Philadelphia",
    country: "United States",
    label: "Philadelphia, United States",
  },
  {
    name: "San Antonio",
    city: "San Antonio",
    country: "United States",
    label: "San Antonio, United States",
  },
  {
    name: "San Diego",
    city: "San Diego",
    country: "United States",
    label: "San Diego, United States",
  },
  {
    name: "Dallas",
    city: "Dallas",
    country: "United States",
    label: "Dallas, United States",
  },
  {
    name: "San Jose",
    city: "San Jose",
    country: "United States",
    label: "San Jose, United States",
  },
  {
    name: "Austin",
    city: "Austin",
    country: "United States",
    label: "Austin, United States",
  },
  {
    name: "Jacksonville",
    city: "Jacksonville",
    country: "United States",
    label: "Jacksonville, United States",
  },
  {
    name: "Boston",
    city: "Boston",
    country: "United States",
    label: "Boston, United States",
  },
  {
    name: "Miami",
    city: "Miami",
    country: "United States",
    label: "Miami, United States",
  },
  {
    name: "Atlanta",
    city: "Atlanta",
    country: "United States",
    label: "Atlanta, United States",
  },
  {
    name: "Washington DC",
    city: "Washington",
    country: "United States",
    label: "Washington DC, United States",
  },
  {
    name: "Denver",
    city: "Denver",
    country: "United States",
    label: "Denver, United States",
  },
  {
    name: "Seattle",
    city: "Seattle",
    country: "United States",
    label: "Seattle, United States",
  },
  {
    name: "Minneapolis",
    city: "Minneapolis",
    country: "United States",
    label: "Minneapolis, United States",
  },
  {
    name: "Portland",
    city: "Portland",
    country: "United States",
    label: "Portland, United States",
  },
];

// Get location suggestions from OpenRouteService or fallback
const getLocationSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    console.log("📍 Location Suggestion Request:");
    console.log("  Query:", query);
    console.log("  API Key configured:", !!ORS_API_KEY);

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Query parameter is required",
        received: { query },
      });
    }

    // If ORS API key is not configured, use fallback
    if (!ORS_API_KEY) {
      console.log("  ⚠️  Using fallback cities (ORS API key not configured)");
      const searchQuery = query.toLowerCase().trim();
      const filtered = FALLBACK_CITIES.filter(
        (city) =>
          city.name.toLowerCase().includes(searchQuery) ||
          city.city.toLowerCase().includes(searchQuery),
      ).slice(0, 10);

      return res.json({
        success: true,
        suggestions: filtered,
      });
    }

    // Use OpenRouteService Geocoding API
    const url = "https://api.openrouteservice.org/geocode/search";

    console.log("  Calling ORS at:", url);
    console.log("  With query:", query);

    const response = await axios.get(url, {
      params: {
        api_key: ORS_API_KEY,
        text: query,
        size: 10,
      },
      timeout: 5000, // 5 second timeout
    });

    if (response.data && response.data.features) {
      console.log(
        "  ✓ Success! Found",
        response.data.features.length,
        "results",
      );
      const suggestions = response.data.features.map((feature) => ({
        name: feature.properties.name || "",
        city: feature.properties.city || feature.properties.name || "",
        country: feature.properties.country || "",
        label: feature.properties.label || "",
        lon: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      }));

      return res.json({
        success: true,
        suggestions: suggestions,
      });
    }

    console.log("  ✓ No results found from ORS");
    res.json({
      success: true,
      suggestions: [],
    });
  } catch (error) {
    console.error("❌ Location suggestion error:", error.message);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    });

    // On API error, try fallback
    try {
      const { query } = req.query;
      if (query && query.trim() !== "") {
        console.log("  Falling back to local cities list");
        const searchQuery = query.toLowerCase().trim();
        const filtered = FALLBACK_CITIES.filter(
          (city) =>
            city.name.toLowerCase().includes(searchQuery) ||
            city.city.toLowerCase().includes(searchQuery),
        ).slice(0, 10);

        return res.json({
          success: true,
          suggestions: filtered,
          note: "Using fallback cities (ORS API unavailable)",
        });
      }
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError.message);
    }

    // Return specific error message
    let errorMessage = "Failed to fetch location suggestions";
    if (error.response?.status === 429) {
      errorMessage = "API rate limit exceeded. Please try again later.";
    } else if (error.code === "ECONNABORTED") {
      errorMessage = "Request timeout. Please try again.";
    } else if (!ORS_API_KEY) {
      errorMessage = "Location API not configured. Using fallback cities.";
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
      suggestions: [], // Return empty suggestions with error
    });
  }
};

module.exports = {
  getLocationSuggestions,
};
