import cloudinary from "../config/cloudinary.js";
import Product from "../models/productModel.js";

/* 
   HELPER
 */
const toBoolean = (val) => val === true || val === "true";

/* 
   CREATE PRODUCT
 */
export const createProduct = async (req, res) => {
  try {
    const uploadedImages = [];

    // 🔹 Upload images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // 🔹 Create product
    const product = await Product.create({
      user: req.user.id,
      name: req.body.name,
      productType: req.body.productType,
      quantity: Number(req.body.quantity),
      mrp: Number(req.body.mrp),
      price: Number(req.body.price),
      brand: req.body.brand,

      // ✅ FIXED BOOLEAN
      exchange: toBoolean(req.body.exchange),
      isPublished: toBoolean(req.body.isPublished),

      images: uploadedImages,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Create product error:", err.message);
    res.status(500).json({ message: "Product creation failed" });
  }
};

/* 
   GET PRODUCTS (USER WISE)
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* 
   UPDATE PRODUCT
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    /* ---------- EXISTING IMAGES ---------- */
    let images = product.images;

    if (req.body.existingImages) {
      try {
        images = JSON.parse(req.body.existingImages);
      } catch {
        images = product.images;
      }
    }

    /* ---------- NEW IMAGES ---------- */
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );

        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    /* ---------- UPDATE FIELDS ---------- */
    product.name = req.body.name ?? product.name;
    product.productType = req.body.productType ?? product.productType;
    product.quantity =
      req.body.quantity !== undefined
        ? Number(req.body.quantity)
        : product.quantity;
    product.mrp =
      req.body.mrp !== undefined ? Number(req.body.mrp) : product.mrp;
    product.price =
      req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.brand = req.body.brand ?? product.brand;

    if (req.body.exchange !== undefined) {
      product.exchange = toBoolean(req.body.exchange);
    }

    if (req.body.isPublished !== undefined) {
      product.isPublished = toBoolean(req.body.isPublished);
    }

    product.images = images;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("❌ Update product error:", err.message);
    res.status(500).json({ message: "Product update failed" });
  }
};

/* 
   DELETE PRODUCT
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔹 Delete Cloudinary images
    for (const img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await product.deleteOne();

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("❌ Delete product error:", err.message);
    res.status(500).json({ message: "Product delete failed" });
  }
};

/* 
   TOGGLE PUBLISH
 */
export const togglePublishProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isPublished = !product.isPublished;
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Publish toggle failed" });
  }
};
