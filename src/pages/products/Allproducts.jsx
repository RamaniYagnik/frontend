import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/Authcontext";
import { toast } from "react-toastify";
import api from "../../api/Api";
import ProductModal from "../products/Productmodal";
import { formatINR } from "../../util/Priceformatter";

const AllProducts = ({ selectedCategory }) => {
  const { auth, categories, products: contextProducts, fetchProducts } =
    useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const role = auth?.userInfo?.role;
  const userId = auth?.userInfo?.id;

  // Update products whenever context or selectedCategory changes
  useEffect(() => {
    if (!contextProducts) return;

    let filtered = contextProducts.filter((p) => !p.is_deleted);

    if (role === "sub-admin") {
      filtered = filtered.filter((p) => p.created_by === userId);
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.categoryModel?.categories_name === selectedCategory
      );
    }

    setProducts(filtered);
  }, [contextProducts, role, userId, selectedCategory]);

  const handleEdit = (product) => {
    if (role === "sub-admin" && product.created_by !== userId) {
      toast.error("You can only edit your own products");
      return;
    }
    setEditProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    if (role === "sub-admin" && product.created_by !== userId) {
      toast.error("You can only delete your own products");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/products/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex bg-gray-200 p-4 rounded-lg justify-between items-center mb-6">
        <p className="font-semibold text-lg">
          {role === "admin" ? "All Products" : "My Products"}
        </p>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditProduct(null);
            setShowModal(true);
          }}
        >
          Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 && (
          <p className="text-gray-500 col-span-full">No products found.</p>
        )}

        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded shadow hover:shadow-lg flex flex-col"
          >
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${p.products_image}`}
              alt={p.products_name}
              className="w-full h-32 object-cover rounded-t"
            />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold mb-1">{p.products_name}</h3>
              <p className="text-gray-500 mb-1">
                Category: {p.categoryModel?.categories_name}
              </p>
              <p className="text-gray-500 mb-1">
                Price: {formatINR ? formatINR(p.price) : `₹${p.price}`}
              </p>
              <p className="text-gray-500 mb-1">Color: {p.colors}</p>
              <div className="text-gray-500 mb-2 flex flex-wrap gap-2">
                {p.tags &&
                  p.tags.split(",").map((tag, i) => (
                    <span key={i} className="bg-gray-200 px-2 py-1 rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
              </div>

              <div className="mt-auto flex gap-2">
                <button
                  className="px-3 py-1 rounded text-sm flex-1 bg-blue-500 text-white"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 rounded text-sm flex-1 bg-red-500 text-white"
                  onClick={() => handleDelete(p)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <ProductModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          allCategories={categories}
          editProduct={editProduct}
          editId={editProduct?.id}
          fetchProducts={fetchProducts}
        />
      )}
    </div>
  );
};

export default AllProducts;
