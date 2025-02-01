import { Router } from "express";
import { getAllOrder, createOrder, getOrderByID, updateOrder,deleteOrder } from "../controllers/orderControlller";

const router = Router();

router.get('/', getAllOrder);
router.post('/', createOrder);
router.get('/:id', getOrderByID);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;