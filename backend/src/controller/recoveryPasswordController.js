import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import HTMLRecoveryEmail from "../utils/sendMailRecovery.js";

import { config } from "../../config.js";

import customerModel from "../models/customer.js"

const recoveryPassswordController = {}

recoveryPassswordController.requestCode = async (req, res) => {
    try{
        const { email } = req.body;
        const userFound = await customerModel.finOne({email});

        if(! userFound){
            return res.json({ message: "Usuario no encontrado"});
        }

        const code = crypto.randomBytes(3).toString("hex");

        const token = jsonwebtoken.sign(
            { email, code, userType: "customer", verified: false},
            config.JWT.secret,
            { expiresIn: "15"},
        );

        res.cookie("recoveryCookie", token, {
            maxAge: 15 * 60 * 1000
        });

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
            subject: "Correo de recuperacion",
            html: HTMLRecoveryEmail(code),
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log("error" + error);
                return res.status(500).json({ message: "Error al mandar el email"});
            }

            return res.status(200).json({ message: "email enviado"});
        });

    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({message: "Internal server error"});
    }
};

recoveryPassswordController.verifyCode = async (req, res) => {
    try{
        const { codeRequest } = req.body;
        const token = req.cookies.recoveryCookie;
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        if(codeRequest !== decoded.code) {
            return res.status(400).json({ message: "Invalid code"});
        }

        const newToken = jsonwebtoken.sign(
            { email: decoded.email, userType: "customer", verified: true},
            config.JWT.secret,
            {expiresIn: "15m"},
        );

        res.cookie("recoveryCookie", newToken, {
           maxAge: 15 * 60 * 1000 
        });

        return res.status(200).json({ message: "Codigo verificado exitosamente"});
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({message: "Internal server error"});
    }
};

recoveryPassswordController.newPassword = async (req, res) => {
    try{
        const { newPassword, confirmNewPassword } = req.body

        if (newPassword !== confirmNewPassword){
            return res.status(400).json({message: "Las contraseñas no coinciden"});
        }

        const token = req.cookies.recoveryCookie;
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        if(!decoded.verified){
            return res.status(400).json({message: "Codigo no verificado"});
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        await customerModel.findOneAndUpdate(
            { email:decoded.email },
            { password: passwordHash},
            { new: true},
        );

        res.clearCookie("recoveryCookie");
        return res.status(200).json({message: "Internal server error"});

    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export default recoveryPassswordController;

