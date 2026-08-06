const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const {Protect} = require("../middleware/auth");
const {loginRate, refreshRate} = require("../middleware/rateLimit");

router.post("/register", loginRate, authController.register);
router.post("/login", loginRate, authController.login);
router.get('/profile', Protect, authController.getProfile);
router.post("/change-password", Protect, authController.changePassword);
router.post("/refresh-token", refreshRate, authController.refreshToken);
router.post('/logout',Protect, authController.logout)

module.exports = router;