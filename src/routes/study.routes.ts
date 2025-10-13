import { Router, RequestHandler} from "express";
import { requireToken } from "../middleware/requireToken";
import { studyValidatorBody } from "../middleware/studyValidatorBody";
import { paramlinkValidator } from "../middleware/validatorManager";
import {getAllStudies, createStudy,getStudyById, updateStudy, deleteStudy} from "../controllers/Study.controller"


const router = Router();

router.get('/', getAllStudies as RequestHandler);
router.post('/', requireToken, studyValidatorBody as any, createStudy as RequestHandler);
router.get('/:id', paramlinkValidator, getStudyById as RequestHandler);
router. put('/:id', paramlinkValidator, requireToken, studyValidatorBody as any, updateStudy as RequestHandler);
router.delete('/:id', requireToken, deleteStudy as RequestHandler);

export default router;