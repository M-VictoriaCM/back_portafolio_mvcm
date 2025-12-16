import { BaseController, ControllerConfig } from "./base/BaseController";
import { badgeService } from "../services/badge.service";

/**
 * Controller para gestión de insignias
 * Hereda de BaseController para operaciones CRUD estándar
 */
class BadgeController extends BaseController {
  service = badgeService;

  config: ControllerConfig = {
    resourceName: 'badge',
    resourceNamePlural: 'badges',
    createMessage: 'Insignia creada correctamente',
    updateMessage: 'Insignia actualizada correctamente',
    deleteMessage: 'Insignia eliminada correctamente',
    notFoundMessage: 'Insignia no encontrada'
  };
}

// Exportar instancia única del controller
export const badgeController = new BadgeController();