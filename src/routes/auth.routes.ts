import { Router } from "express";
import { RequestHandler } from "express";
import { requireRefreshToken } from "../middleware/requiereRefreshToken";
import {firebaseAuth, refreshToken, logout, registerWithFirebase} from "../controllers/auth.controller";
import { requireFirebaseAuth } from "../middleware/requireFibaseAuth";

const router = Router();

router.post("/register-firebase", requireFirebaseAuth, registerWithFirebase as RequestHandler);
router.post("/firebase-auth", requireFirebaseAuth, firebaseAuth as RequestHandler);
router.get("/refresh", requireRefreshToken as RequestHandler, refreshToken as RequestHandler);
router.get("/logout", logout as RequestHandler);


export default router;
