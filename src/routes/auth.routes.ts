import { register} from "../controllers/auth.controller";
import { Router } from "express";
import authcontroller from "../controllers/auth.controller";
const router = Router();
const ctrl= authcontroller

router.post("/register", ctrl.register);
// router.post("/login", authController.login);

export default router; 