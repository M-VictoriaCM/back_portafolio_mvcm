import { Router, RequestHandler } from "express";
import { createCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/category.controller";

const router = Router();

router.get('/', getAllCategory as RequestHandler);
router.post('/', createCategory as RequestHandler);
router.get('/:id',getCategoryById as RequestHandler);
router.put('/:id', updateCategory as RequestHandler);
export default router;