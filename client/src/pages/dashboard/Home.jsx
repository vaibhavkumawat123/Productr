import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import EmptyState from "../../components/common/EmptyState";
import ProductCard from "../../components/products/ProductCard";

const Home = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("published");

  const { items: products = [], loading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const isPublished = product.isPublished === true;

      return activeTab === "published" ? isPublished : !isPublished;
    });
  }, [products, activeTab]);

  return (
    <div className="px-10 py-6">
      {/* TABS */}
      <div className="border-b mb-8 flex gap-8">
        <button
          onClick={() => setActiveTab("published")}
          className={`pb-3 text-sm font-medium ${
            activeTab === "published"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Unpublished
        </button>

        <button
          onClick={() => setActiveTab("unpublished")}
          className={`pb-3 text-sm font-medium ${
            activeTab === "unpublished"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Published
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-center text-sm text-gray-400">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={`No ${
            activeTab === "published" ? "Published" : "Unpublished"
          } Products`}
          subtitle="Create your first product to see it here."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
