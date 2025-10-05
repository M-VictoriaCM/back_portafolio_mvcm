import { Category } from "../models/Category";


//Crear categoría
export const createCategory = async (data: any, userId: string)=> {
    return await Category.create({
        ...data,
        userId
    });
}
//Obtener todas
export const getAllCategory = async () => {
    return await Category.findAll();
}
//Obtener por ID
export const getCategoryById = async (id: string) => {
    return await Category.findByPk(id);
}
//Actualizar
export const updateCategory = async (id: string, title: string, icon: string) => {
    const category = await Category.findByPk(id);
    if (!category) {
        return null;
    }
    await category.update({ title, icon });
    return category;
}

//Eliminar
export const deleteCategory = async (id: string) => {
    const category = await Category.findByPk(id);
    if (!category) {
        return null;
    }
    await category.destroy();
    return true;
}
