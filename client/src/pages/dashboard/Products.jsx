import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import EmptyState from "../../components/common/EmptyState";
import AddProductModal from "../../components/products/AddProductModal";
import ProductCard from "../../components/products/ProductCard";

const Products = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (!loading && products.length === 0) {
    return (
      <div className="px-10 py-6 flex justify-center items-center min-h-[60vh]">
        <EmptyState
          title="Feels a little empty over here..."
          subtitle="You can create products without connecting store — you can add products anytime."
          buttonText="Add your Products"
          onClick={() => setOpen(true)}
        />

        {open && <AddProductModal onClose={() => setOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="px-10 py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Your Products</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          + Add Product
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-sm text-gray-400">Loading products...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {open && <AddProductModal onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Products;
