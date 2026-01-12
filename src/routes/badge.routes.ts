import { Router, RequestHandler } from "express";
import { requireToken } from "../middleware/requireToken";
import { validateRequest } from "../middleware/validateRequest";
import { createBadgeSchema, updateBadgeSchema, badgeIdSchema } from "../schemas/badge.schema";
import { badgeController } from "../controllers/badge.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Badges
 *   description: Gestión de insignias
 */

/**
 * @swagger
 * /api/badges:
 *   get:
 *     summary: Obtener todas las insignias
 *     tags: [Badges]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de insignias obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 badges:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Badge'
 */
router.get("/", requireToken, badgeController.getAllByUser as unknown as RequestHandler);

/**
 * @swagger
 * /api/badges:
 *   post:
 *     summary: Crear una nueva insignia
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBadgeInput'
 *     responses:
 *       201:
 *         description: Insignia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", 
  requireToken, 
  validateRequest(createBadgeSchema), 
  badgeController.create as unknown as RequestHandler
);

/**
 * @swagger
 * /api/badges/{id}:
 *   get:
 *     summary: Obtener una insignia por ID
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la insignia a buscar
 *     responses:
 *       200:
 *         description: Insignia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Insignia no encontrada
 */
router.get("/:id", 
  requireToken, 
  validateRequest(badgeIdSchema), 
  badgeController.getById as unknown as RequestHandler
);

/**
 * @swagger
 * /api/badges/{id}:
 *   put:
 *     summary: Actualizar una insignia existente
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la insignia a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBadgeInput'
 *     responses:
 *       200:
 *         description: Insignia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Insignia no encontrada
 */
router.put("/:id", 
  requireToken, 
  validateRequest(updateBadgeSchema), 
  badgeController.update as unknown as RequestHandler
);


/**
 * @swagger
 * /api/badges/{id}:
 *   delete:
 *     summary: Eliminar una insignia
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la insignia a eliminar
 *     responses:
 *       204:
 *         description: Insignia eliminada exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Insignia no encontrada
 */
router.delete("/:id", 
  requireToken, 
  validateRequest(badgeIdSchema), 
  badgeController.delete as unknown as RequestHandler
);

export default router;