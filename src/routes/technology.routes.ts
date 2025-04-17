import { Router, RequestHandler } from "express";
import { createTechnology, getAllTechnology, getTechnologyById, updateTechnology } from "../controllers/technology.controller";

const router = Router();

router.get('/', getAllTechnology as RequestHandler);
router.post('/', createTechnology as RequestHandler);
router.get('/:id',getTechnologyById as RequestHandler);
router.put('/:id', updateTechnology as RequestHandler);

export default router;