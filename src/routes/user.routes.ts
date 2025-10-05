
import { Router } from "express";
import { RequestHandler } from "express";
import { login, logout, refreshToken, register, resetPassword, updateProfile } from "../controllers/user.controller";
import { bodyLoginValidator, bodyRegisterValidator } from "../middleware/validatorManager";
import { requireRefreshToken } from "../middleware/requiereRefreshToken";
import { requireToken } from "../middleware/requireToken";

const router = Router();

router.post("/register", bodyRegisterValidator, register as RequestHandler);
router.post("/login", bodyLoginValidator, login as RequestHandler);
router.put("/profile", requireToken, updateProfile as RequestHandler);
router.get("/refresh", requireRefreshToken as RequestHandler, refreshToken as RequestHandler);
router.get("/logout", logout as RequestHandler);
router.post("/reset", resetPassword as RequestHandler);

export default router;