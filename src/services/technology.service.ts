
import { Category } from "../models/Category";
import { Technology } from "../models/Technology";

export const createTechnology= async(data:any, userId: string) => {
    return await Technology.create({
        ...data,
        userId
     });
}
export const getAllTechnologyByCategory = async () => {
  const categories = await Category.findAll({
    include: [{ model: Technology, as: "skills" }],
    order: [["title", "ASC"], [{ model: Technology, as: "skills" }, "nombre", "ASC"]],
  });

  return categories.filter(cat => cat.skills && cat.skills.length > 0);
}


export const getTechnologyById= async(id: string)=>{
    return await Technology.findByPk(id);
}
export const updateTechnology= async(id: string, nombre: string, image: string, categoryId: string)=>{
    const technology = await Technology.findByPk(id);
    if (!technology) {
        return null;
    }
    await technology.update({ nombre, image, categoryId });
    return technology;
}

export const deleteTechnology= async(id: string)=>{
  const technology = await Technology.findByPk(id);
  if(!technology){
    return null;
  }
  await technology.destroy();
  return true;
};

export const getAllTechnology = async () =>{
  return await Technology.findAll();}