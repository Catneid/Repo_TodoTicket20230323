import express from "express";
import wompiController from "../controller/wompiController";

const router = express.Router();

router.route("/token").post(wompiController.generarToken);
router.route("/paymentTest").post(wompiController.paymentTest);
router.route("/payment3Ds").post(wompiController.payment3Ds);

export default router;