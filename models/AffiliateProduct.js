import mongoose from "mongoose";

const affiliateProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    affiliateUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const AffiliateProduct =
  mongoose.models.AffiliateProduct ||
  mongoose.model("AffiliateProduct", affiliateProductSchema);

export default AffiliateProduct;
