import { Project } from "../models/Project";
import { BaseService } from "./base/BaseService";
import { technologyService } from "./technology.service";

/**
 * Service para gestión de proyectos
 * Extiende BaseService para operaciones CRUD estándar
 * Incluye métodos personalizados para relaciones con tecnologías
 */
class ProjectService extends BaseService<Project> {
  constructor() {
    super(Project);
  }

  /**
   * Obtener todos los proyectos con sus tecnologías
   * Sobrescribe el método base para incluir relaciones
   */
  async getAll(): Promise<Project[]> {
    return await this.model.findAll({ include: ['technologies'] });
  }

  /**
   * Obtener un proyecto por ID con sus tecnologías
   * Sobrescribe el método base para incluir relaciones
   */
  async getById(id: string): Promise<Project | null> {
    return await this.model.findByPk(id, { include: ['technologies'] });
  }

  /**
   * Actualizar proyecto con manejo de tecnologías
   * Incluye actualización de tecnologías si se proporcionan technologyIds
   */
  async updateWithTechnologies(
    id: string,
    data: any,
    userId: string
  ): Promise<Project | null> {
    const project = await this.model.findOne({ where: { id, userId } as any });

    if (!project) {
      return null;
    }

    // Extraer technologyIds del data
    const { technologyIds, ...projectData } = data;

    // Actualizar campos del proyecto
    await project.update(projectData as any);

    // Si se proporcionan technologyIds, actualizar las relaciones
    if (technologyIds !== undefined) {
      if (technologyIds.length === 0) {
        // Si el array está vacío, eliminar todas las tecnologías
        await project.$set('technologies', []);
      } else {
        // Verificar que las tecnologías existen
        const technologies = await technologyService.getByIds(technologyIds);

        // Actualizar las relaciones con las tecnologías encontradas
        await project.$set('technologies', technologies);
      }
    }

    // Recargar el proyecto con las tecnologías actualizadas
    await project.reload({ include: ['technologies'] });

    return project;
  }

  /**
   * Eliminar proyecto y sus relaciones con tecnologías
   * Sobrescribe el método base para manejar relaciones
   */
  async delete(id: string, userId: string): Promise<boolean | null> {
    const project = await this.model.findOne({ where: { id, userId } as any });

    if (!project) {
      return null;
    }

    // Eliminar relaciones con tecnologías antes de eliminar el proyecto
    await project.$set('technologies', []);

    // Eliminar el proyecto
    await project.destroy();
    return true;
  }
}

// Exportar instancia única del servicio
export const projectService = new ProjectService();

