import { Router } from "express";
import { studyStateController } from "../controllers/study_state.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: StudyStates
 *   description: Estados posibles de un estudio académico
 */

/**
 * @swagger
 * /api/study-states:
 *   get:
 *     summary: Obtener todos los estados de estudio
 *     tags: [StudyStates]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de estados
 */
router.get("/", studyStateController.getAll);

export default router;
