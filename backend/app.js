import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import limiter from "./src/middlewares/limiter.js"

import registerCustomer from "./src/routes/registerCustomer.js";
import loginCustomerRoutes from "./src/routes/loginCustomer.js";
import registerAdmin from "./src/routes/registerAdmin.js";
import loginAdminRoutes from "./src/routes/loginAdmin.js"
import logoutRoutes from "./src/routes/logout.js";
import wompiRoutes from "./src/routes/wompi.js";
import purchasesRoutes from "./src/routes/purchases.js";
import recoveryPassswordRoutes from "./src/controller/recoveryPasswordController.js";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    }),    
);

app.use(limiter);

app.use(cookieParser());

app.use(express.json());

app.use("/api/registerCustomers", registerCustomer);
app.use("/api/loginCustomers", loginCustomerRoutes);
app.use("/api/registerAdmins", registerAdmin);
app.use("/api/loginAdmins", loginAdminRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/wompi", wompiRoutes);
app.use("/api/purchases", purchasesRoutes);
app.use("/api/recoveryPsasword", recoveryPassswordRoutes);

export default app;