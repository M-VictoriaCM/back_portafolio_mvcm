import { Study } from "../models/Study";

/**
 * Service para crear un nuevo estudio
 * @param data 
 * @param userId 
 * @returns Nuevo estudio creado
 */
export const createStudy = async (data: any, userId: string) => {
    return await Study.create({
        ...data,
        userId
    });
}

/**
 * Service para obtener todos los estudios
 * @returns Todos los estudios
 */
export const getAllStudies = async () => {
    return await Study.findAll();
};

/**
 * Service para obtener un estudio por ID
 * @param id 
 * @returns Estudio por ID
 */
export const getStudyById = async (id: string) => {
    return await Study.findByPk(id);
};

/**
 * Service para actualizar un estudio
 * @param id 
 * @param title 
 * @param institution 
 * @param startYear 
 * @param endYear 
 * @param userId 
 * @returns Estudio actualizado
 */
export const updateStudy = async (
    id: string, 
    title: string, 
    institution: string, 
    startYear:number | null, 
    endYear:number | null,
    userId: string
) => {
    const study = await Study.findOne({where:{id,userId}});
    if (!study) {
        return null;
    }
    await study.update({ title, institution, startYear, endYear });
    return study;
};

/**
 * Service para eliminar un estudio
 * @param id 
 * @param userId 
 * @returns Estudio eliminado
 */
export const deleteStudy = async (id: string, userId: string) => {
    const study = await Study.findOne({ where: { id, userId } });
    if (!study) {
        return null;
    }
    await study.destroy();
    return true;
}