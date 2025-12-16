import { StudyType } from "../models/StudyType";

class StudyTypeService {
  async getAll() {
    return await StudyType.findAll({
      order: [['type', 'ASC']]
    });
  }

  async getById(id: string) {
    return await StudyType.findByPk(id);
  }
}

export const studyTypeService = new StudyTypeService();
