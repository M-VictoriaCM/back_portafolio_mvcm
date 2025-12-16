import { Model, ModelStatic, FindOptions, WhereOptions } from 'sequelize';

/**
 * Clase base genérica para servicios CRUD
 * Elimina la duplicación de código en operaciones comunes
 * 
 * @template T - Tipo del modelo Sequelize
 * 
 * @example
 * export class CategoryService extends BaseService<Category> {
 *   constructor() {
 *     super(Category);
 *   }
 * 
 *   // Métodos personalizados adicionales si son necesarios
 *   async getByTitle(title: string) {
 *     return await this.model.findOne({ where: { title } });
 *   }
 * }
 */
export abstract class BaseService<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  /**
   * Crear un nuevo registro
   * @param data Datos del registro
   * @param userId ID del usuario que crea el registro
   * @returns Registro creado
   */
  async create(data: any, userId: string): Promise<T> {
    return await this.model.create({
      ...data,
      userId
    } as any);
  }

  /**
   * Obtener todos los registros
   * @param options Opciones de búsqueda de Sequelize (include, order, etc.)
   * @returns Array de registros
   */
  async getAll(options?: FindOptions<T>): Promise<T[]> {
    return await this.model.findAll(options);
  }

  /**
   * Obtener un registro por ID
   * @param id ID del registro
   * @param options Opciones de búsqueda de Sequelize (include, etc.)
   * @returns Registro encontrado o null
   */
  async getById(id: string, options?: FindOptions<T>): Promise<T | null> {
    return await this.model.findByPk(id, options);
  }

  /**
   * Buscar un registro con condiciones personalizadas
   * @param where Condiciones de búsqueda
   * @param options Opciones adicionales de Sequelize
   * @returns Registro encontrado o null
   */
  async findOne(where: WhereOptions<T>, options?: FindOptions<T>): Promise<T | null> {
    return await this.model.findOne({
      where,
      ...options
    } as FindOptions<T>);
  }

  /**
   * Actualizar un registro
   * @param id ID del registro
   * @param data Datos a actualizar
   * @param userId ID del usuario que actualiza (para verificación de propiedad)
   * @returns Registro actualizado o null si no se encuentra
   */
  async update(id: string, data: Partial<T>, userId: string): Promise<T | null> {
    const record = await this.model.findOne({
      where: { id, userId } as any
    });
    
    if (!record) {
      return null;
    }

    await record.update(data as any);
    return record;
  }

  /**
   * Eliminar un registro
   * @param id ID del registro
   * @param userId ID del usuario que elimina (para verificación de propiedad)
   * @returns true si se eliminó, null si no se encontró
   */
  async delete(id: string, userId: string): Promise<boolean | null> {
    const record = await this.model.findOne({
      where: { id, userId } as any
    });
    
    if (!record) {
      return null;
    }

    await record.destroy();
    return true;
  }

  /**
   * Contar registros con condiciones opcionales
   * @param where Condiciones de búsqueda
   * @returns Número de registros
   */
  async count(where?: WhereOptions<T>): Promise<number> {
    const result = await this.model.count({ where } as any);
    return typeof result === 'number' ? result : 0;
  }

  /**
   * Verificar si existe un registro
   * @param where Condiciones de búsqueda
   * @returns true si existe, false si no
   */
  async exists(where: WhereOptions<T>): Promise<boolean> {
    const result = await this.model.count({ where } as any);
    const count = typeof result === 'number' ? result : 0;
    return count > 0;
  }
}
