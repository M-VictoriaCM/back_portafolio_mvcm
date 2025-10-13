import { Router } from "express";
import { RequestHandler } from "express";
import { 
    login, 
    logout, 
    refreshToken, 
    register, 
    resetPassword, 
    updateProfile, 
    updateAvatar, 
    getProfile,
    getPublicProfile
} 
from "../controllers/user.controller";
import { bodyLoginValidator, bodyRegisterValidator } from "../middleware/validatorManager";
import { requireRefreshToken } from "../middleware/requiereRefreshToken";
import { requireToken } from "../middleware/requireToken";
import { paramlinkValidator } from "../middleware/validatorManager";


const router = Router();

router.post("/register", bodyRegisterValidator, register as RequestHandler);
router.post("/login", bodyLoginValidator, login as RequestHandler);
router.get("/profile", requireToken, getProfile as RequestHandler);
router.get("/refresh", requireRefreshToken as RequestHandler, refreshToken as RequestHandler);
router.get("/logout", logout as RequestHandler);
router.post("/reset", resetPassword as RequestHandler);
router.put("/profile", requireToken,  updateProfile as RequestHandler);
router.put("/avatar", requireToken, updateAvatar as RequestHandler);
router.get("/public/profile",getPublicProfile as RequestHandler);

export default router;