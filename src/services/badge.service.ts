import { Badge } from "../models/Badge";

/**
 * Service para crear una nueva insignia
 * @param data 
 * @param userId 
 * @returns Nueva insignia creada
 */
export const createBadge = async (data: any, userId: string) => {
    return await Badge.create({
        ...data, 
        userId
    });
};

/**
 * Service para obtener todas las insignias
 * @returns Todas las insignias
 */
export const getAllBadges = async () => {
    return await Badge.findAll();
}

/**
 * Service para obtener una insignia por ID
 * @param id 
 * @returns Insignia por ID
 */
export const getBadgeById = async (id: string) => {
    return await Badge.findByPk(id);
};

/**
 * Service para actualizar una insignia
 * @param id 
 * @param creadly 
 * @param userId 
 * @returns Insignia actualizada
 */
export const updateBadge = async (
    id: string,
    creadly: string,
    userId: string
) => {
    const badge = await Badge.findOne({where:{id,userId}});
    if (!badge) {
        return null;
    }
    await badge.update({ creadly });
    return badge;
};

/**
 * Service para eliminar una insignia
 * @param id 
 * @param userId 
 * @returns Insignia eliminada 
 */
export const deleteBadge = async (id: string, userId: string) => {
    const badge = await Badge.findOne({where:{id,userId}});
    if (!badge) {
        return null;
    }
    await badge.destroy();
    return true;
};