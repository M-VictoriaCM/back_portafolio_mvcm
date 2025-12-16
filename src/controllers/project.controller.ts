import { BaseController, ControllerConfig } from './base/BaseController';
import { projectService } from '../services/project.service';

/**
 * Controller para gestión de proyectos
 * Hereda de BaseController para operaciones CRUD estándar
 */
class ProjectController extends BaseController {
  service = projectService;

  config: ControllerConfig = {
    resourceName: 'project',
    resourceNamePlural: 'projects',
    createMessage: 'Proyecto creado correctamente',
    updateMessage: 'Proyecto actualizado correctamente',
    deleteMessage: 'Proyecto eliminado correctamente',
    notFoundMessage: 'Proyecto no encontrado'
  };
}

// Exportar instancia única del controller
export const projectController = new ProjectController();