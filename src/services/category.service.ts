import { Category } from "../models/Category";

export const createCategory = async (title: string, icon: string) => {
    return await Category.create({ title, icon });
}

export const getAllCategory = async () => {
    return await Category.findAll({ attributes: { exclude: ['id'] } });
}
export const getCategoryById = async (id: string) => {
    return await Category.findByPk(id, { attributes: { exclude: ['id'] } });
}

export const updateCategory = async (id: string, title: string, icon: string) => {
    const category = await Category.findByPk(id);
    if (!category) {
        return null;
    }
    await category.update({ title, icon });
    return await Category.findByPk(id, { attributes: { exclude: ['id'] } });
}

