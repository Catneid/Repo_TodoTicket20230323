import purchaseModel from "../models/purchases.js";

const purchaseController = {};

purchaseController.getPurchases = async (req, res) => {
  try {
    const purchases = await purchaseModel.find().populate("customerId");
    return res.status(200).json(purchases);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

purchaseController.insertPurchase = async (req, res) => {
  try {
    const {
      customerId,
      quantity,
      purchaseDate,
      total,
      paymentStatus,
      transactionId,
    } = req.body;

    const newPurchase = new purchaseModel({
      customerId,
      quantity,
      purchaseDate,
      total,
      paymentStatus,
      transactionId,
    });

    await newPurchase.save();

    return res.status(200).json({ message: "Compra guardada" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

purchaseController.updatePurchase = async (req, res) => {
  try {
    const {
      customerId,
      quantity,
      purchaseDate,
      total,
      paymentStatus,
      transactionId,
    } = req.body;

    const updatedPurchase = await purchaseModel.findByIdAndUpdate(
      req.params.id,
      {
        customerId,
        quantity,
        purchaseDate,
        total,
        paymentStatus,
        transactionId,
      },
      { new: true },
    );

    if (!updatedPurchase) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    return res.status(200).json({ message: "Compra actualizada" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

purchaseController.deletePurchase = async (req, res) => {
  try {
    const deletedPurchase = await purchaseModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedPurchase) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    return res.status(200).json({ message: "Compra eliminada" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default purchaseController;