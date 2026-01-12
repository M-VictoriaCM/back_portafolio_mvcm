import { Request, Response } from "express";
import { BaseService } from "../../services/base/BaseService";
import { handleServerError } from "../../utils/handleServerError";


/**
 * Configuración para mensajes personalizados del controller
 */
export interface ControllerConfig {
  resourceName: string;          // Nombre singular: 'category'
  resourceNamePlural: string;    // Nombre plural: 'categories'
  createMessage: string;         // 'Categoría creada'
  updateMessage: string;         // 'Categoría actualizada correctamente'
  deleteMessage: string;         // 'Categoría eliminada correctamente'
  notFoundMessage: string;       // 'Categoría no encontrada'
}

/**
 * Interface base para servicios CRUD
 */
export interface BaseServiceInterface {
  create(data: any, userId: string): Promise<any>;
  getAll(): Promise<any[]>;
  getAllByUserId(userId: string, options?: any): Promise<any[]>;
  getAllByUsername(username: string, options?: any): Promise<any[]>;
  getById(id: string): Promise<any | null>;
  update(id: string, data: any, userId: string): Promise<any | null>;
  delete(id: string, userId: string): Promise<boolean | null>;
}

/**
 * Clase base abstracta para controllers CRUD
 * Elimina la duplicación de código en operaciones comunes
 * 
 * @example
 * class CategoryController extends BaseController {
 *   service = categoryService;
 *   config = {
 *     resourceName: 'category',
 *     resourceNamePlural: 'categories',
 *     createMessage: 'Categoría creada',
 *     updateMessage: 'Categoría actualizada correctamente',
 *     deleteMessage: 'Categoría eliminada correctamente',
 *     notFoundMessage: 'Categoría no encontrada'
 *   };
 * }
 */
export abstract class BaseController {
  abstract service: BaseServiceInterface;
  abstract config: ControllerConfig;

  /**
   * Crear un nuevo recurso
   * Requiere autenticación (req.uid debe existir)
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.uid;
      if (!userId) {
        return res.status(401).json({ error: "No autorizado - ID de usuario no proporcionado" });
      }

      const newItem = await this.service.create(req.body, userId);
      
      return res.status(201).json({
        message: this.config.createMessage,
        [this.config.resourceName]: newItem
      });
    } catch (error) {
      return handleServerError(res, error);
    }
  };

  /**
   * Obtener todos los recursos
   * No requiere autenticación
   */
  getAll = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const items = await this.service.getAll();
      
      return res.status(200).json({
        [this.config.resourceNamePlural]: items
      });
    } catch (error) {
      return handleServerError(res, error);
    }
  };
  /**
   * Obtener recursos del usuario autenticado
   * Para dashboard/admin (requiere autenticación)
   */
  getAllByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.uid;
      if (!userId) {
        return res.status(401).json({ error: "No autorizado - ID de usuario no proporcionado" });
      }
      const items = await this.service.getAllByUserId(userId);
      return res.status(200).json({
        [this.config.resourceNamePlural]: items
      });
    } catch (error) {
      return handleServerError(res, error);
    }
  };
   /**
   * Obtener recursos públicos de un usuario por username
   * Para perfiles públicos (no requiere autenticación)
   */
  getPublicByUsername = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username } = req.params;
      if(!username){
        return res.status(400).json({ error: "Username es requerido" });
      }
      const items = await this.service.getAllByUsername(username);
      return res.status(200).json({
        [this.config.resourceNamePlural]: items
      });
    } catch (error) {
      return handleServerError(res, error);
    }
  }

  /**
   * Obtener un recurso por ID
   * No requiere autenticación
   */
  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      
      if (!item) {
        return res.status(404).json({ error: this.config.notFoundMessage });
      }
      
      return res.status(200).json(item);
    } catch (error) {
      return handleServerError(res, error);
    }
  };

  /**
   * Actualizar un recurso
   * Requiere autenticación (req.uid debe existir)
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.uid;
      if (!userId) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const { id } = req.params;
      const updatedItem = await this.service.update(id, req.body, userId);
      
      if (!updatedItem) {
        return res.status(404).json({ error: this.config.notFoundMessage });
      }
      
      return res.status(200).json({
        message: this.config.updateMessage,
        [this.config.resourceName]: updatedItem
      });
    } catch (error) {
      return handleServerError(res, error);
    }
  };

  /**
   * Eliminar un recurso
   * Requiere autenticación (req.uid debe existir)
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.uid;
      if (!userId) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const { id } = req.params;
      const deleted = await this.service.delete(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: this.config.notFoundMessage });
      }
      
      return res.status(200).json({ message: this.config.deleteMessage });
    } catch (error) {
      return handleServerError(res, error);
    }
  };
}
