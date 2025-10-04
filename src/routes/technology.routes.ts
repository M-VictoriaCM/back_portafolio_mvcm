import { Router, RequestHandler } from "express";
import { createTechnology, getAllTechnologyByCategory, getTechnologyById, updateTechnology, deleteTechnology, getAllTechnology } from "../controllers/technology.controller";
import { requireToken } from "../middleware/requireToken";
import { paramlinkValidator } from "../middleware/validatorManager";

const router = Router();

router.get('/', getAllTechnologyByCategory as RequestHandler);
router.get('/all', getAllTechnology as RequestHandler);
router.post('/', requireToken, createTechnology as RequestHandler);
router.get('/:id', paramlinkValidator, getTechnologyById as RequestHandler);
router.put('/:id', requireToken, paramlinkValidator, updateTechnology as RequestHandler);
router.delete('/:id', requireToken, deleteTechnology as RequestHandler);

export default router;