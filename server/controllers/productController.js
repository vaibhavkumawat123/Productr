import cloudinary from "../config/cloudinary.js";
import Product from "../models/productModel.js";

/* 
   CREATE PRODUCT
 */
export const createProduct = async (req, res) => {
  try {
    const uploadedImages = [];

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

    const product = await Product.create({
      user: req.user.id,
      name: req.body.name,
      productType: req.body.productType,
      quantity: req.body.quantity,
      mrp: req.body.mrp,
      price: req.body.price,
      brand: req.body.brand,
      exchange: req.body.exchange === "yes",
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

    /* EXISTING IMAGES */
    let images = product.images;

    if (req.body.existingImages) {
      try {
        images = JSON.parse(req.body.existingImages);
      } catch {
        images = product.images;
      }
    }

    /* NEW IMAGES */
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

    /* UPDATE FIELDS */
    product.name = req.body.name ?? product.name;
    product.productType = req.body.productType ?? product.productType;
    product.quantity = req.body.quantity ?? product.quantity;
    product.mrp = req.body.mrp ?? product.mrp;
    product.price = req.body.price ?? product.price;
    product.brand = req.body.brand ?? product.brand;
    product.exchange =
      req.body.exchange === "yes" || req.body.exchange === true;

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

    /* DELETE CLOUDINARY IMAGES */
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
