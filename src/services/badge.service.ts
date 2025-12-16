import { Badge } from "../models/Badge";
import { BaseService } from "./base/BaseService";

/**
 * Service para gestión de insignias
 * Extiende BaseService para operaciones CRUD estándar
 * Incluye métodos personalizados para búsquedas específicas
 */
class BadgeService extends BaseService<Badge> {
  constructor() {
    super(Badge);
  }

  /**
   * Buscar insignia por credencial
   * @param creadly Credencial de la insignia
   * @returns Insignia encontrada o null
   */
  async getByCreadly(creadly: string): Promise<Badge | null> {
    return await this.findOne({ creadly } as any);
  }
}

// Exportar instancia única del servicio
export const badgeService = new BadgeService();