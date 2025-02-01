import { Router } from "express";
import { createCartItems, deleteCartItem, getAllCartItems, getCartItemsById, updateCartItems } from "../controllers/cartItemController";

const router = Router();

router.get('/', getAllCartItems);
router.post('/', createCartItems);
router.get('/:id', getCartItemsById);
router.delete('/:id', deleteCartItem);
router.put('/:id', updateCartItems);

export default router;