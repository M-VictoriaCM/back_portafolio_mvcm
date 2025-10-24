import { Project } from "../models/Project";

/**
 * Crea un nuevo proyecto
 * @param data, información del proyecto
 * @param userId, id del usuario que crea el proyecto
 * @returns nuevo proyecto creado
 */
export const createProject = async (data: any, userId: string) => {
    return await Project.create({ ...data, userId });
}
/**
 * Muestra todos los proyectos
 * @returns todos los proyectos
 */
export const getAllProject = async () => {
    return await Project.findAll();
}
/**
 * Muestra un proyecto por su ID
 * @param id, id del proyecto
 * @returns proyecto encontrado o null
 */
export const getProjectById = async (id: string) => {
    return await Project.findByPk(id);
}
/**
 * Actualiza un proyecto
 * @param id, id del proyecto
 * @param title, título del proyecto
 * @param description, descripción del proyecto
 * @param image, imagen del proyecto
 * @param repository, repositorio del proyecto
 * @param urlDemo, URL de demostración del proyecto
 * @param userId, id del usuario que actualiza el proyecto
 * @returns proyecto actualizado o null
 */
export const updateProject = async (id: string, title: string, description: string, image: string, repository: string,urlDemo: string, userId: string) => {
    const project = await Project.findByPk(id);
    if (!project) {
        return null;
    }
    await project.update({ title, description, image, repository, urlDemo, userId });
    return project;
}

/**
 * Elimina un proyecto
 * @param id, id del proyecto
 * @param userId, id del usuario que elimina el proyecto
 * @returns true si se eliminó el proyecto, false si no se encontró
 */
export const deleteProject = async (id: string, userId: string) => {
    const project = await Project.findOne({ where: { id, userId } });
    if (!project) {
        return null;
    }
    await project.destroy();
    return true;
}

