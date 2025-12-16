import { Router, RequestHandler } from "express";
import { technologyController } from "../controllers/technology.controller";
import { requireToken } from "../middleware/requireToken";
import { validateRequest } from "../middleware/validateRequest";
import { createTechnologySchema, updateTechnologySchema, technologyIdSchema } from "../schemas/technology.schema";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Technologies
 *   description: Gestión de tecnologías
 */

/**
 * @swagger
 * /api/technologies:
 *   get:
 *     summary: Obtener tecnologías agrupadas por categoría
 *     tags: [Technologies]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de tecnologías agrupadas por categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryWithTechnologies'
 */
router.get('/', technologyController.getAllByCategory as unknown as RequestHandler);

/**
 * @swagger
 * /api/technologies/all:
 *   get:
 *     summary: Obtener todas las tecnologías sin agrupar
 *     tags: [Technologies]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de todas las tecnologías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 technologies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Technology'
 */
router.get('/all', technologyController.getAll as unknown as RequestHandler);

/**
 * @swagger
 * /api/technologies:
 *   post:
 *     summary: Crear una nueva tecnología
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTechnologyInput'
 *     responses:
 *       201:
 *         description: Tecnología creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Technology'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', 
  requireToken, 
  validateRequest(createTechnologySchema), 
  technologyController.create as unknown as RequestHandler
);

/**
 * @swagger
 * /api/technologies/{id}:
 *   get:
 *     summary: Obtener una tecnología por ID
 *     tags: [Technologies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la tecnología a buscar
 *     responses:
 *       200:
 *         description: Tecnología encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Technology'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Tecnología no encontrada
 */
router.get('/:id', 
  validateRequest(technologyIdSchema), 
  technologyController.getById as RequestHandler
);

/**
 * @swagger
 * /api/technologies/{id}:
 *   put:
 *     summary: Actualizar una tecnología existente
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la tecnología a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTechnologyInput'
 *     responses:
 *       200:
 *         description: Tecnología actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Technology'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Tecnología no encontrada
 */
router.put('/:id', 
  requireToken, 
  validateRequest(updateTechnologySchema), 
  technologyController.update as RequestHandler
);
/**
 * @swagger
 * /api/technologies/{id}:
 *   delete:
 *     summary: Eliminar una tecnología
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la tecnología a eliminar
 *     responses:
 *       204:
 *         description: Tecnología eliminada exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Tecnología no encontrada
 */
router.delete('/:id', 
  requireToken, 
  validateRequest(technologyIdSchema), 
  technologyController.delete as RequestHandler
);

export default router;