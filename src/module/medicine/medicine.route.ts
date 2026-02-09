import { Router } from "express";
import { medicineController } from "./medicine.controller";
import authGuard from "../../guard/auth.guard";
import { ROLE } from "../../generated/prisma/enums";
const router = Router();
router.get("/", medicineController.getAllMedicine);
router.get("/:medicineId", medicineController.getMedicineDetails);
router.post("/", authGuard(ROLE.SELLER), medicineController.createMedicine);
router.put(
  "/:medicineId",
  authGuard(ROLE.SELLER),
  medicineController.updateMedicine,
);
router.delete(
  "/:medicineId",
  authGuard(ROLE.SELLER),
  medicineController.deleteMedicine,
);
export const medicineRouter = router;