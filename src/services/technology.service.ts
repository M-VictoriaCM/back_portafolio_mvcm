import { Category } from "../models/Category";
import { Technology } from "../models/Technology";
import { BaseService } from "./base/BaseService";

/**
 * Service para gestión de tecnologías
 * Extiende BaseService para operaciones CRUD estándar
 * Incluye métodos personalizados para búsquedas específicas
 */
class TechnologyService extends BaseService<Technology> {
  constructor() {
    super(Technology);
  }

  /**
   * Obtener tecnologías agrupadas por categoría
   * @returns Categorías con sus tecnologías asociadas
   */
  async getAllByCategory() {
    const categories = await Category.findAll({
      include: [{ model: Technology, as: "skills" }],
      order: [["title", "ASC"], [{ model: Technology, as: "skills" }, "nombre", "ASC"]],
    });
    return categories.filter(cat => cat.skills && cat.skills.length > 0);
  }

  /**
   * Obtener tecnologías por IDs
   * @param ids Array de IDs de tecnologías
   * @returns Array de tecnologías encontradas
   */
  async getByIds(ids: string[]): Promise<Technology[]> {
    return await Technology.findAll({ where: { id: ids as any } });
  }

  async getAll() {
    return await this.model.findAll({
      order: [['nombre', 'ASC']]
    });
  }
}

// Exportar instancia única del servicio
export const technologyService = new TechnologyService();
