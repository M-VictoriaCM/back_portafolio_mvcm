import { Router } from "express";
import { studyTypeController } from "../controllers/study_type.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: StudyTypes
 *   description: Tipos de estudios académicos
 */

/**
 * @swagger
 * /api/study-types:
 *   get:
 *     summary: Obtener todos los tipos de estudio
 *     tags: [StudyTypes]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de tipos de estudio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 types:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/", studyTypeController.getAll);

export default router;
