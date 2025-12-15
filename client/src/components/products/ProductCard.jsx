import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  togglePublishProduct,
  deleteProduct,
} from "../../redux/slices/productSlice";
import AddProductModal from "./AddProductModal";
import { Trash2, Loader2 } from "lucide-react";

/* 🔥 NORMALIZER */
const getIsPublished = (value) => {
  return value === true || value === "true" || value === 1;
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const isPublished = getIsPublished(product.isPublished);
  const images = product.images || [];

  const handleTogglePublish = async () => {
    await dispatch(togglePublishProduct(product._id));
  };

  const handleDelete = async () => {
    setDeleting(true);
    await dispatch(deleteProduct(product._id));
    setDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <>
      {/* CARD */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition p-4">
        {/* IMAGE SLIDER */}
        <div className="relative bg-gray-50 rounded-lg p-4 flex justify-center items-center h-44 overflow-hidden">
          <img
            src={images[activeImage]?.url}
            alt={product.name}
            className="h-full object-contain"
          />

          {/* LEFT */}
          {images.length > 1 && (
            <button
              onClick={() =>
                setActiveImage((p) => (p === 0 ? images.length - 1 : p - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 w-6 h-6 rounded-full shadow text-sm"
            >
              ‹
            </button>
          )}

          {/* RIGHT */}
          {images.length > 1 && (
            <button
              onClick={() =>
                setActiveImage((p) => (p === images.length - 1 ? 0 : p + 1))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 w-6 h-6 rounded-full shadow text-sm"
            >
              ›
            </button>
          )}
        </div>

        {/* DOTS */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === activeImage ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* TITLE */}
        <h3 className="font-semibold text-sm mt-4 mb-2">{product.name}</h3>

        {/* DETAILS */}
        <div className="text-xs text-gray-500 space-y-1">
          <Row label="Product type" value={product.productType} />
          <Row label="Quantity Stock" value={product.quantity} />
          <Row label="MRP" value={`₹ ${product.mrp}`} />
          <Row label="Selling Price" value={`₹ ${product.price}`} />
          <Row label="Brand Name" value={product.brand} />
          <Row
            label="Exchange Eligibility"
            value={product.exchange ? "YES" : "NO"}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleTogglePublish}
            className={`flex-1 py-2 text-xs font-medium rounded-md text-white ${
              isPublished
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>

          <button
            onClick={() => setEditOpen(true)}
            className="flex-1 py-2 text-xs rounded-md border hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            onClick={() => setConfirmDelete(true)}
            className="w-10 flex items-center justify-center border rounded-md text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <AddProductModal
          editProduct={product}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-[340px] rounded-xl p-6">
            <h3 className="text-sm font-semibold">Delete Product</h3>

            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to delete this product?
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-sm border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md text-white
    ${deleting ? "bg-red-400 cursor-not-allowed" : "bg-red-600"}
  `}
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ROW */
const Row = ({ label, value }) => (
  <div className="flex justify-between">
    <span>{label} -</span>
    <span>{value}</span>
  </div>
);

export default ProductCard;
