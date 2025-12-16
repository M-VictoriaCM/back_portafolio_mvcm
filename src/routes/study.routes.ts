import { Router, RequestHandler } from "express";
import { requireToken } from "../middleware/requireToken";
import { validateRequest } from "../middleware/validateRequest";
import { createStudySchema, studyIdSchema, updateStudySchema } from "../schemas/study.schema";
import { studyController } from '../controllers/study.controller';

const router = Router();

/**
 * @swagger
 * /api/studies:
 *   get:
 *     summary: Obtener todos los estudios
 *     tags: [Studies]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de estudios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Study'
 */
router.get('/', studyController.getAll as unknown as RequestHandler);

/**
 * @swagger
 * /api/studies:
 *   post:
 *     summary: Crear un nuevo estudio
 *     tags: [Studies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudyInput'
 *     responses:
 *       201:
 *         description: Estudio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Study'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', 
  requireToken, 
  validateRequest(createStudySchema), 
  studyController.create as unknown as RequestHandler
);

/**
 * @swagger
 * /api/studies/{id}:
 *   get:
 *     summary: Obtener un estudio por ID
 *     tags: [Studies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del estudio a buscar
 *     responses:
 *       200:
 *         description: Estudio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Study'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Estudio no encontrado
 */
router.get('/:id', 
  validateRequest(studyIdSchema), 
  studyController.getById as unknown as RequestHandler
);

/**
 * @swagger
 * /api/studies/{id}:
 *   put:
 *     summary: Actualizar un estudio existente
 *     tags: [Studies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del estudio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStudyInput'
 *     responses:
 *       200:
 *         description: Estudio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Study'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Estudio no encontrado
 */
router.put('/:id', 
  requireToken, 
  validateRequest(updateStudySchema), 
  studyController.update as unknown as RequestHandler
);

/**
 * @swagger
 * /api/studies/{id}:
 *   delete:
 *     summary: Eliminar un estudio
 *     tags: [Studies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del estudio a eliminar
 *     responses:
 *       204:
 *         description: Estudio eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Estudio no encontrado
 */
router.delete('/:id', 
  requireToken, 
  validateRequest(studyIdSchema), 
  studyController.delete as unknown as RequestHandler
);

export default router;