// services/studyState.service.ts
import { StudyState } from "../models/StudyState";

class StudyStateService {
  async getAll() {
    return await StudyState.findAll({
      order: [['state', 'ASC']]
    });
  }

  async getById(id: string) {
    return await StudyState.findByPk(id);
  }
}

export const studyStateService = new StudyStateService();
