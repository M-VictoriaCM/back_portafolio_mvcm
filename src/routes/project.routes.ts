import { Router, RequestHandler } from "express";
import { createProject, getAllProyects, getProjectById, updateProject } from "../controllers/project.controller";
import { requireToken } from "../middleware/requireToken";
import { bodyLinkValidator, paramlinkValidator } from "../middleware/validatorManager";

const router = Router();

router.get('/', getAllProyects as RequestHandler);
router.post('/', requireToken, bodyLinkValidator, createProject as RequestHandler);
router.get('/:id', paramlinkValidator, getProjectById as RequestHandler);
router.put('/:id', requireToken, bodyLinkValidator, paramlinkValidator, updateProject as RequestHandler);

export default router;