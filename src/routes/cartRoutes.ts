import { Router } from "express";
import { getAllCarts, createCart , getCartsById, updateCart, deleteCart, valDeleteCart} from "../controllers/cartController";

const router = Router();

router.get('/', getAllCarts);
router.post('/', createCart);
router.get('/:id', getCartsById);
router.put('/', updateCart);
router.delete('/:id', deleteCart);
router.get('/val-delete/:id', valDeleteCart);

export default router;