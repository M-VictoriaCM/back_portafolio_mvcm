import { BaseController, ControllerConfig } from "./base/BaseController";
import { technologyService } from "../services/technology.service";
import { Request, Response } from "express";
import { handleServerError } from "../utils/handleServerError";

/**
 * Controller para gestión de tecnologías
 * Hereda de BaseController para operaciones CRUD estándar
 * Incluye método personalizado para obtener tecnologías por categoría
 */
class TechnologyController extends BaseController {
  service = technologyService;

  config: ControllerConfig = {
    resourceName: 'technology',
    resourceNamePlural: 'technologies',
    createMessage: 'Tecnología creada correctamente',
    updateMessage: 'Tecnología actualizada correctamente',
    deleteMessage: 'Tecnología eliminada correctamente',
    notFoundMessage: 'Tecnología no encontrada'
  };

  /**
   * Obtener todas las tecnologías agrupadas por categoría
   * @param _req Request
   * @param res Response
   */
  getAllByCategory = async (_req: Request, res: Response) => {
    try {
      const technologies = await technologyService.getAllByCategory();
      res.status(200).json({ technologies });
    } catch (error) {
      handleServerError(res, error);
    }
  };


}

// Exportar instancia única del controller
export const technologyController = new TechnologyController();