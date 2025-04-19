import { Project } from "../models/Project";

export const createProject = async (title: string, description: string, image: string, repository: string, userId: string) => {
    return await Project.create({ title, description, image, repository, userId });
}

export const getAllProject = async () => {
    return await Project.findAll({ attributes: { exclude: ['id'] } });
}

export const getProjectById = async (id: string) => {
    return await Project.findByPk(id, { attributes: { exclude: ['id'] } });
}

export const updateProject = async (id: string, title: string, description: string, image: string, repository: string, userId: string) => {
    const project = await Project.findByPk(id);
    if (!project) {
        return null;
    }
    await project.update({ title, description, image, repository, userId });
    return await Project.findByPk(id, { attributes: { exclude: ['id'] } });
}

