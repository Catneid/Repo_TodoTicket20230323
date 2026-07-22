import mongoose from "mongoose";
import {config} from "./config.js";

mongoose.connect(config.db.URI);

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("DB conectada exitosamente")
})

connection.on("disconnected", () => {
    console.log("DB desconectada exitosamente")
})

connection.on("error", (error) => {
    console.log("error found" + error)
})

