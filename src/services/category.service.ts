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

  /**
   * Obtener categorías del usuario autenticado
   * @param userId ID del usuario
   * @returns Array de categorías del usuario
   */
  async getCagoriesByUserId(userId:string) : Promise<Category[]>{
    return await this.getAllByUserId(userId, {
      order: [['title','ASC']]
    });
  }

  /**
   * Obtener categorías públicas de un usuario por username
   * @param username Username del usuario
   * @returns Array de categorías del usuario
   */
  async getPublicCategoriesByUsername(username: string): Promise<Category[]> {
    return await this.getAllByUsername(username, {
      order: [['title', 'ASC']]
    });
  }

}

// Exportar instancia única del servicio
export const categoryService = new CategoryService();
