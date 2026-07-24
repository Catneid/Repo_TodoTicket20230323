import express from "express";
import purchaseController from "../controller/purchasesController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(validateAuthCookie(["customer"]), purchaseController.insertPurchase)
  .get(validateAuthCookie(["admin"]), purchaseController.getPurchases);

router
  .route("/:id")
  .put(validateAuthCookie(["customer", "admin"]), purchaseController.updatePurchase)
  .delete(validateAuthCookie(["admin"]), purchaseController.deletePurchase);

export default router;