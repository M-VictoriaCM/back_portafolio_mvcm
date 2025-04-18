import { Router, RequestHandler } from "express";
import { createTechnology, getAllTechnology, getTechnologyById, updateTechnology } from "../controllers/technology.controller";
import { requireToken } from "../middleware/requireToken";
import { paramlinkValidator } from "../middleware/validatorManager";

const router = Router();

router.get('/', getAllTechnology as RequestHandler);
router.post('/', requireToken, createTechnology as RequestHandler);
router.get('/:id', paramlinkValidator, getTechnologyById as RequestHandler);
router.put('/:id', requireToken, paramlinkValidator, updateTechnology as RequestHandler);

export default router;