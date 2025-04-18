import { Router, RequestHandler } from "express";
import { createCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/category.controller";
import { requireToken } from "../middleware/requireToken";
import { paramlinkValidator } from "../middleware/validatorManager";

const router = Router();

router.get('/', getAllCategory as RequestHandler);
router.post('/', requireToken, createCategory as RequestHandler);
router.get('/:id',paramlinkValidator, getCategoryById as RequestHandler);
router.put('/:id', paramlinkValidator, requireToken, updateCategory as RequestHandler);
export default router;