const express = require("express");
const loadController = require("../controllers/loadController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

router.post("/", loadController.createLoad);
router.get("/", loadController.getAllLoads);
router.get("/:id", loadController.getLoadById);
router.put("/:id", loadController.updateLoad);
router.delete("/:id", loadController.deleteLoad);

module.exports = router;
