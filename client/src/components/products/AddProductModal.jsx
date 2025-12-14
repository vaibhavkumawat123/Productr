import React, { useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../../redux/slices/productSlice";

const AddProductModal = ({ onClose, editProduct = null }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(editProduct);

  const [form, setForm] = useState(
    isEdit
      ? {
          name: editProduct.name,
          productType: editProduct.productType,
          quantity: editProduct.quantity,
          mrp: editProduct.mrp,
          price: editProduct.price,
          brand: editProduct.brand,
          exchange: editProduct.exchange ? "yes" : "no",

          existingImages: editProduct.images || [], 
          images: [], // new images
        }
      : {
          name: "",
          productType: "",
          quantity: "",
          mrp: "",
          price: "",
          brand: "",
          exchange: "yes",
          existingImages: [],
          images: [],
        }
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeExistingImage = (index) => {
    setForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await dispatch(
          updateProduct({ id: editProduct._id, data: form })
        ).unwrap();
      } else {
        await dispatch(addProduct(form)).unwrap();
      }

      onClose(); 
    } catch (err) {
      console.error("Product save failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-[420px] max-h-[90vh] rounded-xl shadow-lg flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-sm font-semibold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 space-y-4 overflow-y-auto"
        >
          <Input
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label="Product Type"
            name="productType"
            value={form.productType}
            onChange={handleChange}
            select
          />
          <Input
            label="Quantity Stock"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
          />
          <Input
            label="MRP"
            name="mrp"
            type="number"
            value={form.mrp}
            onChange={handleChange}
          />
          <Input
            label="Selling Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
          <Input
            label="Brand Name"
            name="brand"
            value={form.brand}
            onChange={handleChange}
          />

          {/* EXISTING IMAGES */}
          {form.existingImages.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1">Existing Images</p>
              <div className="flex gap-2 flex-wrap">
                {form.existingImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img.url}
                      className="w-16 h-16 rounded-md border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute -top-2 -right-2 bg-white border rounded-full w-5 h-5 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEW IMAGES */}
          <div>
            <p className="text-xs font-medium mb-1">Add New Images</p>
            <div className="flex gap-2 flex-wrap">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-16 h-16 rounded-md border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute -top-2 -right-2 bg-white border rounded-full w-5 h-5 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <label className="text-xs text-blue-600 cursor-pointer mt-2 inline-block">
              Add images
              <input
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm"
            >
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, select, ...props }) => (
  <div>
    <label className="text-xs font-medium block mb-1">{label}</label>
    {select ? (
      <select {...props} className="input">
        <option value="">Select</option>
        <option>Foods</option>
        <option>Electronics</option>
        <option>Clothes</option>
        <option>Beauty Products</option>
        <option>Others</option>
      </select>
    ) : (
      <input {...props} className="input" required />
    )}
  </div>
);

export default AddProductModal;
