import mongoose, { Schema, model } from "mongoose";

const purchaseSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    },
    quantity: { type: Number },
    purchaseDate: { type: Date },
    total: { type: Number },
    paymentStatus: { type: String },
    transactionId: { type: String },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("Purchases", purchaseSchema)