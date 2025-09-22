import React, { useContext, useState, useMemo } from "react";
import { AuthContext } from "../../context/Authcontext";
import { formatINR } from "../../util/Priceformatter"; 
import Searchbar from "../../component/searchbar/Searchbar"; 

const Products = () => {
  const { products } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  const parseField = (field) => {
    try {
      if (!field) return [];
      if (typeof field === "string") {
        if (field.startsWith("[") && field.endsWith("]")) {
          return JSON.parse(field).map((item) => item.replace(/"/g, "").trim());
        }
        return field.split(",").map((item) => item.trim());
      }
      if (Array.isArray(field)) return field;
      return [];
    } catch {
      return [];
    }
  };

  const tagColors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-pink-100 text-pink-700",
    "bg-yellow-100 text-yellow-700",
  ];

  const colorBadges = [
    "bg-red-100 text-red-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-pink-100 text-pink-700",
    "bg-purple-100 text-purple-700",
    "bg-indigo-100 text-indigo-700",
    "bg-gray-100 text-gray-700",
  ];

  // 🔎 Filtering logic
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;

    return products.filter((product) => {
      const name = product.products_name?.toLowerCase() || "";
      const category = product.categoryModel?.categories_name?.toLowerCase() || "";
      const price = product.price?.toString() || "";
      const tags = parseField(product.tags).join(" ").toLowerCase();

      const term = searchTerm.toLowerCase();

      return (
        name.includes(term) ||
        category.includes(term) ||
        price.includes(term) ||
        tags.includes(term)
      );
    });
  }, [products, searchTerm]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <p className="text-center my-4 text-2xl font-bold">All Products</p>

      {/* 🔎 Search bar */}
      <div className="flex justify-center mb-6">
        <Searchbar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by category, name, price, or tags..."
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const colors = parseField(product.colors);
            const tags = parseField(product.tags);

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {product.products_image && (
                  <div className="relative">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${product.products_image}`}
                      alt={product.products_name}
                      className="w-full h-52 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/70 rounded-full px-2 py-1 text-xs font-semibold text-gray-800">
                      {product.categoryModel?.categories_name || "N/A"}
                    </div>
                  </div>
                )}

                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-bold text-gray-800">
                    Name :- {product.products_name}
                  </h2>
                  <p className="text-indigo-600 font-semibold text-lg">
                    Price :- {formatINR(product.price)}
                  </p>

                  {colors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <p className="text-lg">Color :- </p>
                      {colors.map((color, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            colorBadges[index % colorBadges.length]
                          }`}
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <p className="text-lg">Tags</p>
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            tagColors[index % tagColors.length]
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
