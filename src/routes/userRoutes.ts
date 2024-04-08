import { Router } from "express";
import UserController from "../controllers/userController";
import passport from "passport";
import { authenticate } from "../middleware/authenticate";
import userController from "../controllers/userController";

const router = Router();

router.post("/register", UserController.createUser);
router.post("/login", UserController.createSession);
router.get("/logout", UserController.logout);
router.get("/profile/:id", authenticate, UserController.getProfile);
router.patch("/update/:id", authenticate, userController.updateProfile);
router.get("/all-profiles", authenticate, userController.getAllProfiles);
export default router;
