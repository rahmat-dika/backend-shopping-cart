import { Router } from "express";
import { getAllProduct, createProduct, getProductByID, updateProduct,deleteProduct } from "../controllers/productControlller";

const router = Router();

router.get('/', getAllProduct);
router.post('/', createProduct);
router.get('/:id', getProductByID);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;