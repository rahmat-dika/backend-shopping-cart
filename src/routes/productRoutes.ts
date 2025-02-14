import { Router } from "express";
import { getAllProduct, getAllProduct2, createProduct, getProductByID, updateProduct,deleteProduct } from "../controllers/productControlller";
import { uploadMiddleware } from "../middleware/uploadMiddleware";

const router = Router();

router.get('/', getAllProduct);
router.get('/', getAllProduct2);
router.post('/', uploadMiddleware, createProduct);
router.get('/:id', getProductByID);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;