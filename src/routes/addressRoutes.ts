import { Router } from "express";
import { getAllAddress, createAddress, getAddressByID, updateAddress, deleteAddress } from "../controllers/addressControlller";

const router = Router();

router.get('/', getAllAddress);
router.post('/', createAddress);
router.get('/:id', getAddressByID);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;