
import { Router } from "express";
import { RequestHandler } from "express";
import { login, logout, refreshToken, register, resetPassword } from "../controllers/user.controller";
import { bodyLoginValidator, bodyRegisterValidator } from "../middleware/validatorManager";
import { requireRefreshToken } from "../middleware/requiereRefreshToken";

const router = Router();

router.post("/register",bodyRegisterValidator, register as RequestHandler);
router.post("/login", bodyLoginValidator, login as RequestHandler);
router.get("/refresh", requireRefreshToken, refreshToken as RequestHandler);
router.get("/logout", logout as RequestHandler);
router.post("/reset", resetPassword as RequestHandler);
router.get('refresh', requireRefreshToken, refreshToken as RequestHandler);

export default router;