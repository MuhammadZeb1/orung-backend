// models/CustomerPurchase.js
import mongoose from "mongoose";

const customerPurchaseSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  userInfo: {
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    postalCode: { type: String, trim: true },
  },
  purchasedAt: { type: Date, default: Date.now },
});

export default mongoose.model("CustomerPurchase", customerPurchaseSchema);
