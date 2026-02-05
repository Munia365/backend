import { Router } from "express";
import { cartItemController } from "./cartItem.controller";
import authGuard from "../../guard/auth.guard";
import { ROLE } from "../../generated/prisma/enums";
const router = Router();
router.post("/", authGuard(ROLE.CUSTOMER), cartItemController.createCartItem);
router.get("/", authGuard(ROLE.CUSTOMER), cartItemController.getMyCart);
router.put(
  "/:cartItemId",
  authGuard(ROLE.CUSTOMER),
  cartItemController.updateCartItemQuantity,
);
router.delete(
  "/:cartItemId",
  authGuard(ROLE.CUSTOMER),
  cartItemController.deleteCartItem,
);
export const cartItemRouter = router;