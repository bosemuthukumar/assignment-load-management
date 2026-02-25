const { Load, User } = require("../models");
const { calculateDistance } = require("../services/mapsService");

exports.createLoad = async (req, res) => {
  try {
    const { title, description, pickupLocation, dropLocation, weight, price } =
      req.body;
    const userId = req.user.id;

    if (!title || !pickupLocation || !dropLocation || !weight || !price) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (weight <= 0 || price <= 0) {
      return res
        .status(400)
        .json({ message: "Weight and price must be greater than 0" });
    }

    if (
      pickupLocation.toLowerCase().trim() === dropLocation.toLowerCase().trim()
    ) {
      return res
        .status(400)
        .json({ message: "Pickup and drop locations must be different" });
    }

    let distanceData = null;
    let calculatedPrice = price;

    if (process.env.ORS_API_KEY) {
      try {
        distanceData = await calculateDistance(
          pickupLocation,
          dropLocation,
          process.env.ORS_API_KEY,
        );
      } catch (error) {
        console.error("Distance calculation failed:", error.message);
      }
    }

    const load = await Load.create({
      title,
      description,
      pickupLocation,
      dropLocation,
      weight,
      price: calculatedPrice,
      distance: distanceData?.distance || null,
      duration: distanceData?.duration || null,
      createdBy: userId,
    });

    res.status(201).json({
      message: "Load created successfully",
      load,
      distanceInfo: distanceData || {
        message: "Google Maps API not configured",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllLoads = async (req, res) => {
  try {
    const {
      status,
      search,
      pickupLocation,
      dropLocation,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (pickupLocation && pickupLocation.trim() !== "") {
      const { Op } = require("sequelize");
      where.pickupLocation = { [Op.like]: `%${pickupLocation}%` };
    }

    if (dropLocation && dropLocation.trim() !== "") {
      const { Op } = require("sequelize");
      where.dropLocation = { [Op.like]: `%${dropLocation}%` };
    }

    if (search && search.trim() !== "") {
      const { Op } = require("sequelize");
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { pickupLocation: { [Op.like]: `%${search}%` } },
        { dropLocation: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Load.findAndCountAll({
      where,
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Loads retrieved successfully",
      loads: rows,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getLoadById = async (req, res) => {
  try {
    const { id } = req.params;

    const load = await Load.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
    });

    if (!load) {
      return res.status(404).json({ message: "Load not found" });
    }

    res.status(200).json({
      message: "Load retrieved successfully",
      load,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateLoad = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      pickupLocation,
      dropLocation,
      weight,
      price,
      status,
    } = req.body;
    const userId = req.user.id;

    const load = await Load.findByPk(id);
    if (!load) {
      return res.status(404).json({ message: "Load not found" });
    }

    if (load.createdBy !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only creator or admin can update this load" });
    }

    const newPickup = pickupLocation || load.pickupLocation;
    const newDrop = dropLocation || load.dropLocation;

    if (newPickup.toLowerCase().trim() === newDrop.toLowerCase().trim()) {
      return res
        .status(400)
        .json({ message: "Pickup and drop locations must be different" });
    }

    if (title) load.title = title;
    if (description) load.description = description;
    if (weight) load.weight = weight;
    if (price) load.price = price;
    if (status) load.status = status;

    let distanceData = null;
    if (pickupLocation || dropLocation) {
      load.pickupLocation = newPickup;
      load.dropLocation = newDrop;

      if (process.env.ORS_API_KEY) {
        try {
          distanceData = await calculateDistance(
            newPickup,
            newDrop,
            process.env.ORS_API_KEY,
          );

          load.distance = distanceData.distance;
          load.duration = distanceData.duration;
        } catch (error) {
          console.error("Distance recalculation failed:", error.message);
        }
      }
    }

    await load.save();

    res.status(200).json({
      message: "Load updated successfully",
      load,
      distanceInfo: distanceData || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteLoad = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const load = await Load.findByPk(id);
    if (!load) {
      return res.status(404).json({ message: "Load not found" });
    }

    if (load.createdBy !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You can only delete your own loads" });
    }

    await load.destroy();

    res.status(200).json({
      message: "Load deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
