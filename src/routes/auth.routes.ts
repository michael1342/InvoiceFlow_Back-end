const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const {Protect} = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get('/profile', Protect, authController.getProfile);
router.post("/change-password", Protect, authController.changePassword);

module.exports = router;