import { Technology } from "../models/Technology";

export const createTechnology= async(nombre: string, image: string, categoryId: string) => {
    return await Technology.create({ nombre, image, categoryId });
}
export const getAllTechnology= async()=>{
    return await Technology.findAll({ attributes: { exclude: ['id'] } });
}
export const getTechnologyById= async(id: string)=>{
    return await Technology.findByPk(id, { attributes: { exclude: ['id'] } });
}
export const updateTechnology= async(id: string, nombre: string, image: string, categoryId: string)=>{
    const technology = await Technology.findByPk(id);
    if (!technology) {
        return null;
    }
    await technology.update({ nombre, image, categoryId });
    return await Technology.findByPk(id, { attributes: { exclude: ['id'] } });
}