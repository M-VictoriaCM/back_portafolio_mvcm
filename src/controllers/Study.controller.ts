import { BaseController, ControllerConfig } from "./base/BaseController";
import { studyService } from "../services/study.service";
import { Request, Response } from "express";
import { handleServerError } from "../utils/handleServerError";
import { StudyType } from "../models/StudyType";
import { StudyState } from "../models/StudyState";

class StudyController extends BaseController {
  service = studyService;

  config: ControllerConfig = {
    resourceName: 'study',
    resourceNamePlural: 'studies',
    createMessage: 'Estudio creado correctamente',
    updateMessage: 'Estudio actualizado correctamente',
    deleteMessage: 'Estudio eliminado correctamente',
    notFoundMessage: 'Estudio no encontrado'
  };

  /** 
   * Obtener lista de tipos de estudio desde la tabla fija StudyTypes
   */
  getStudyTypes = async (_req: Request, res: Response) => {
    try {
      const types = await StudyType.findAll({
        attributes: ["id", "type"]
      });

      res.json({
        count: types.length,
        types
      });

    } catch (error) {
      handleServerError(res, error);
    }
  };

  /** 
   * Obtener lista de estados de estudio desde la tabla fija StudyState
   */
  getStudyStates = async (_req: Request, res: Response) => {
    try {
      const states = await StudyState.findAll({
        attributes: ["id", "state"]
      });

      res.json({
        count: states.length,
        states
      });

    } catch (error) {
      handleServerError(res, error);
    }
  };
}

export const studyController = new StudyController();
