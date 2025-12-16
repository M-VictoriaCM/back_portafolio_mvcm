// controllers/studyType.controller.ts
import { studyTypeService } from "../services/study_type.service";
import { Request, Response } from "express";
import { handleServerError } from "../utils/handleServerError";

class StudyTypeController {
  getAll = async (_req: Request, res: Response) => {
    try {
      const types = await studyTypeService.getAll();
      res.json(types);
    } catch (error) {
      handleServerError(res, error);
    }
  };
}

export const studyTypeController = new StudyTypeController();
