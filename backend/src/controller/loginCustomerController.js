import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import customerModel from "../models/customers.js";
import { config } from "../../config.js";

const loginCustomerController = {};

loginCustomerController.login = async (req, res) => {
  try {

    const { email, password } = req.body;
    const userFound = await customerModel.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    if (userFound.timeOut && userFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

      if (userFound.loginAttempts >= 5) {
        userFound.timeOut = Date.now() + 15 * 60 * 1000;
        userFound.loginAttempts = 0;

        await userFound.save();

        return res.status(403).json({ message: "Cuenta bloqueada" });
      }

      await userFound.save();
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    userFound.loginAttempts = 0;
    userFound.timeOut = null;
    await userFound.save();

    const token = jsonwebtoken.sign(
      { id: userFound._id, userType: "customer" },
      config.JWT.secret,
      { expiresIn: "30d" },
    );

    res.cookie("authCookie", token);

    return res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ mesage: "Internal server error" });
  }
};

export default loginCustomerController;