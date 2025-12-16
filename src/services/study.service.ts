import { Study } from "../models/Study";
import { BaseService } from "./base/BaseService";

/**
 * Service para gestión de estudios
 * Extiende BaseService para operaciones CRUD estándar
 * Incluye métodos personalizados para búsquedas específicas
 */
class StudyService extends BaseService<Study> {
  constructor() {
    super(Study);
  }

  /**
   * Buscar estudios por institución
   * @param institution Nombre de la institución
   * @returns Array de estudios encontrados
   */
  async getByInstitution(institution: string): Promise<Study[]> {
    return await this.model.findAll({ 
      where: { institution } as any 
    });
  }

  async getByType(type: string): Promise<Study[]> {
    return await this.model.findAll({
      where: {type} as any
    });
  }
  async getByState(state: string): Promise<Study[]> {
    return await this.model.findAll({
      where: {state} as any
    });
  }
}

// Exportar instancia única del servicio
export const studyService = new StudyService();