import {Schema, model} from "mongoose";

const adminSchema = new Schema(
    {
        name: { type: String},
        email: { type: String},
        password: { type: String},
        isVerfied: { type: Boolean},
        loginAttempts: { type: Number},
        timeOut: { type: Date},
    },
    {
        timestamps: true,
        strict: false,
    },
);

export default model ("Admins", adminSchema)