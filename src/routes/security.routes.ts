import { Router } from "express";
import { RequestHandler } from "express";
import { requireFirebaseAuth } from "../middleware/requireFibaseAuth";
import { setup2FA, confirm2FA} from "../controllers/security.controller";

const router = Router();

router.post("/2fa/setup", setup2FA as RequestHandler);
router.post("/2fa/confirm", requireFirebaseAuth, confirm2FA as RequestHandler);

export default router;