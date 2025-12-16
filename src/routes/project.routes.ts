import { Router, RequestHandler } from "express";
import { requireToken } from "../middleware/requireToken";
import { validateRequest } from "../middleware/validateRequest";
import { createProjectSchema, updateProjectSchema, projectIdSchema } from "../schemas/project.schema";
import { projectController } from "../controllers/project.controller";

const router = Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtener todos los proyectos
 *     tags: [Projects]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 */
router.get('/', projectController.getAll as unknown as RequestHandler);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectInput'
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', 
  requireToken, 
  validateRequest(createProjectSchema), 
  projectController.create as unknown as RequestHandler
);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtener un proyecto por su ID
 *     tags: [Projects]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proyecto a buscar
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', 
  validateRequest(projectIdSchema), 
  projectController.getById as unknown as RequestHandler
);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Actualizar un proyecto existente
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proyecto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectInput'
 *     responses:
 *       200:
 *         description: Proyecto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.put('/:id', 
  requireToken, 
  validateRequest(updateProjectSchema), 
  projectController.update as unknown as RequestHandler
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proyecto a eliminar
 *     responses:
 *       204:
 *         description: Proyecto eliminado exitosamente
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/:id', 
  requireToken, 
  validateRequest(projectIdSchema, 'params'), 
  projectController.delete as unknown as RequestHandler
);

export default router;