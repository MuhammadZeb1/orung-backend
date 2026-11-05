import mongoose from "mongoose";
import AffiliateProduct from "../models/AffiliateProduct.js";

const normalizePrice = (price) => {
  if (!price) return null;

  if (typeof price === "object" && price.toString) {
    return Number(price.toString());
  }

  return Number(price);
};

const serializeAffiliateProduct = (product) => {
  const plain = product.toObject ? product.toObject() : product;
  if (plain.price) {
    plain.price = normalizePrice(plain.price);
  }
  return plain;
};

export const getAllAffiliateProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const search = (req.query.search || "").trim();
    const category = (req.query.category || "").trim();
    const sort = req.query.sort || "latest";

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price-low") {
      sortOption = { price: 1 };
    } else if (sort === "price-high") {
      sortOption = { price: -1 };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      AffiliateProduct.find(query).sort(sortOption).skip(skip).limit(limit),
      AffiliateProduct.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: "Affiliate products fetched successfully.",
      data: {
        products: products.map(serializeAffiliateProduct),
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAffiliateProductById = async (req, res) => {
  try {
    const product = await AffiliateProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({
      success: true,
      message: "Affiliate product fetched successfully.",
      data: serializeAffiliateProduct(product),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAffiliateProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, affiliateUrl } = req.body;

    if (!name || !description || price === undefined || !category || !imageUrl || !affiliateUrl) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price, category, imageUrl, and affiliateUrl are required.",
      });
    }

    const parsedPrice = Number(price);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ success: false, message: "Price must be a valid positive number." });
    }

    const product = await AffiliateProduct.create({
      name: name.trim(),
      description: description.trim(),
      price: mongoose.Types.Decimal128.fromString(parsedPrice.toFixed(2).toString()),
      category: category.trim(),
      imageUrl: imageUrl.trim(),
      affiliateUrl: affiliateUrl.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Affiliate product created successfully.",
      data: serializeAffiliateProduct(product),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAffiliateProduct = async (req, res) => {
  try {
    const product = await AffiliateProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const { name, description, price, category, imageUrl, affiliateUrl } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (category !== undefined) product.category = category.trim();
    if (imageUrl !== undefined) product.imageUrl = imageUrl.trim();
    if (affiliateUrl !== undefined) product.affiliateUrl = affiliateUrl.trim();

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ success: false, message: "Price must be a valid positive number." });
      }
      product.price = mongoose.Types.Decimal128.fromString(parsedPrice.toFixed(2).toString());
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Affiliate product updated successfully.",
      data: serializeAffiliateProduct(product),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAffiliateProduct = async (req, res) => {
  try {
    const product = await AffiliateProduct.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({
      success: true,
      message: "Affiliate product deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const buyAffiliateProduct = async (req, res) => {
  try {
    const product = await AffiliateProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({
      success: true,
      message: "Redirecting to affiliate website.",
      affiliateUrl: product.affiliateUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
