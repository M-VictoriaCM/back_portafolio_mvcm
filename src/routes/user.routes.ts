import { Router } from "express";
import { RequestHandler } from "express";
import { requireToken } from "../middleware/requireToken";

import { 
    updateProfile, 
    updateAvatar, 
    getProfile,
    getPublicProfile
} 
from "../controllers/user.controller";


const router = Router();

router.get("/profile", requireToken, getProfile as RequestHandler);
router.put("/profile", requireToken,  updateProfile as RequestHandler);
router.put("/avatar", requireToken, updateAvatar as RequestHandler);
router.get("/public/:username",getPublicProfile as RequestHandler);


export default router;