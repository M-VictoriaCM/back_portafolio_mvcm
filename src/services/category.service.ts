import { Category } from "../models/Category";
import { BaseService } from "./base/BaseService";

/**
 * Service para gestión de categorías
 * Extiende BaseService para operaciones CRUD estándar
 * Incluye métodos personalizados para búsquedas específicas
 */
class CategoryService extends BaseService<Category> {
  constructor() {
    super(Category);
  }

  /**
   * Buscar categoría por título
   * @param title Título de la categoría
   * @returns Categoría encontrada o null
   */
  async getByTitle(title: string): Promise<Category | null> {
    return await this.findOne({ title } as any);
  }
}

// Exportar instancia única del servicio
export const categoryService = new CategoryService();
