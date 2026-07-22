import express from "express";
import registerAdminController from "../controller/registeAdminController.js";

const router = express.Router();

router.route("/").post(registerAdminController.register);
router.route("/verifycodeEmail").post(registerAdminController.verifyCode);

export default router;