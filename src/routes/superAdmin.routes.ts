const router = require("express").Router();
const superAdminController = require("../controllers/superAdmin.controller");
const { Protect, AdminOnly, SuperAdminOnly } = require("../middleware/auth");

router.get("/", Protect, SuperAdminOnly, superAdminController.retriveAllUsers);
// router.get("/:id", Protect, AdminOnly, superAdminController.viewUserProfile);
router.patch("/:id/edit", Protect, AdminOnly, superAdminController.editTeam);
router.post('/:id/suspend', Protect, AdminOnly, superAdminController.suspendAccount);
router.post('/add-user', Protect, AdminOnly, superAdminController.addUser);
router.get('/staff', Protect, AdminOnly, superAdminController.showBusinessStaff);

module.exports = router;