// controllers/studyState.controller.ts
import { studyStateService } from "../services/study_state.service";
import { Request, Response } from "express";
import { handleServerError } from "../utils/handleServerError";

class StudyStateController {
  getAll = async (_req: Request, res: Response) => {
    try {
      const states = await studyStateService.getAll();
      res.json(states);
    } catch (error) {
      handleServerError(res, error);
    }
  };
}

export const studyStateController = new StudyStateController();
