import { Router } from "express";
import {
    getAllOrders,
    getOrderById,
    addOrder,
    updateOrder,
    deleteOrder
} from "../conrollers/orders.js";
import { validateBody } from "../middlewares/validatejoi.js";
import { orderSchema } from "../validations/orders.js";

const router = Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", validateBody(orderSchema), addOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;