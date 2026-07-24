import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import customerModel from "../models/customer.js";

import { config } from "../../config.js";

const registerCustomerController = {};

registerCustomerController.register = async (req, res) => {
    const { name, email, password, isVerified, loginAttempts, timeOut} =
    req.body;

    try{
        const existCustomer = await customerModel.findOne({ email });
        if (existCustomer) {
            return res.status(400).json({ message: "Customer ya existente"})
        }

        const passwordHash = await bcryptjs.hash(password, 10);

        const verificationCode = crypto.randomBytes(3).toString("hex");

        const tokenCode = jsonwebtoken.sign(

            {
                email,
                verificationCode,
                name,
                passwordHash,
                isVerified,
                loginAttempts,
                timeOut,
            },

            config.JWT.secret,

            { expiresIn: "15m" },
        );

        res.cookie("verificatinToken", tokenCode, { maxAge: 15 * 60 * 1000});

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password,
            },
        });
        
        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Verificación de cuenta",
            text:
            "Para verificar tu cuenta, utiliza este código " +
            verificationCode +
            " expira en 15 minutos",
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error " + error);
                return res.status(500).json({ message: "error" });
            }
            
            res.status(200).json({ message: "Customer registered, verify your email" });
        });
    
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "internal server error" });
    }
};

registerCustomerController.verifyCode = async (req, res) => {
  try {
    
    const { verificationCodeRequest } = req.body;

    const token = req.cookies.verificationToken;

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const {
      email,
      verificationCode: storedCode,
      name,
      passwordHash,
      loginAttempts,
      timeOut,
    } = decoded;

    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const newCustomer = new customerModel({
      name,
      email,
      password: passwordHash,
      isVerified: true,
      loginAttempts,
      timeOut,
    });

    await newCustomer.save();

    res.clearCookie("verificationToken");

    res.json({ message: "Email verified successfully" });
    
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default registerCustomerController;