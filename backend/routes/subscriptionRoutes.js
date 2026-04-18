const express = require("express");
const subscriptionController = require("../controllers/subscriptionController");
const validateRequest = require("../middleware/validateRequest");
const {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  idParamSchema,
} = require("../validators/subscriptionValidators");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/", validateRequest(createSubscriptionSchema), subscriptionController.create);
router.get("/", subscriptionController.list);
router.get("/:id", validateRequest(idParamSchema), subscriptionController.getById);
router.put("/:id", validateRequest(updateSubscriptionSchema), subscriptionController.update);
router.delete("/:id", validateRequest(idParamSchema), subscriptionController.remove);

module.exports = router;

