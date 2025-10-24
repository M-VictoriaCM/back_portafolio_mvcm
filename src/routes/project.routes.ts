import { Router, RequestHandler } from "express";
import { createProject, deleteProject, getAllProject, getProjectById, updateProject } from "../controllers/project.controller";
import { requireToken } from "../middleware/requireToken";
import { bodyLinkValidator, paramlinkValidator } from "../middleware/validatorManager";

const router = Router();

router.get('/', getAllProject as RequestHandler);
router.post('/', requireToken, createProject as RequestHandler);
router.get('/:id', paramlinkValidator, getProjectById as RequestHandler);
router.put('/:id', requireToken,  paramlinkValidator, updateProject as RequestHandler);
router.delete('/:id', requireToken, deleteProject as RequestHandler);
export default router;