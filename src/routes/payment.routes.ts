const router = require("express").Router();
const paymentController = require("../controllers/payment.controller");
const { Protect, AdminOnly } = require("../middleware/auth");
const { verify } = require("../middleware/verifyPayment");

router.post("/initiate-payment", Protect, AdminOnly, paymentController.initiatePayment);
router.post("/verify/:reference", Protect, verify, paymentController.createTransaction);

module.exports = router;