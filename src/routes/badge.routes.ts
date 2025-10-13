import { Router, RequestHandler } from "express";
import { requireToken } from "../middleware/requireToken";
import { paramlinkValidator } from "../middleware/validatorManager";
import { getAllBadges, createBadge, getBadgeById, updateBadge, deleteBadge } from "../controllers/badge.controller";

const router = Router();

router.get("/", getAllBadges as RequestHandler);
router.post("/", requireToken, paramlinkValidator, createBadge as RequestHandler);
router.get("/:id", requireToken, getBadgeById as RequestHandler);
router.put("/:id", requireToken, paramlinkValidator, updateBadge as RequestHandler);
router.delete("/:id", requireToken, deleteBadge as RequestHandler);

export default router;