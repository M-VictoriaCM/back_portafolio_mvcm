import { BaseController, ControllerConfig } from './base/BaseController';
import { categoryService } from '../services/category.service';

/**
 * Controller para gestión de categorías
 * Hereda de BaseController para operaciones CRUD estándar
 */
class CategoryController extends BaseController {
  service = categoryService;
  
  config: ControllerConfig = {
    resourceName: 'category',
    resourceNamePlural: 'categories',
    createMessage: 'Categoría creada correctamente',
    updateMessage: 'Categoría actualizada correctamente',
    deleteMessage: 'Categoría eliminada correctamente',
    notFoundMessage: 'Categoría no encontrada'
  };
}

// Exportar instancia única del controller
export const categoryController = new CategoryController();