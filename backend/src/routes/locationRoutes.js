const express = require("express");
const locationController = require("../controllers/locationController");

const router = express.Router();

router.get("/suggestions", locationController.getLocationSuggestions);

module.exports = router;
