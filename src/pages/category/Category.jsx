import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/Authcontext";
import { toast } from "react-toastify";
import CategoryModal from "../category/Categorymodal";
import { FcPrevious, FcNext } from "react-icons/fc";
import api from "../../api/Api";
import Searchbar from "../../component/searchbar/Searchbar"; // adjust path
import AllProducts from "../products/Allproducts";

const Category = () => {
  const { categories, fetchCategories } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  // Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.categories_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update visible count based on screen width
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) setVisibleCount(4); // lg and above
      else if (width >= 768) setVisibleCount(3); // md
      else setVisibleCount(1); // sm and below
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // CRUD functions
  const handleSubmitCategory = async () => {
    const { name, image } = formData;
    if (!name || !image) return toast.error("All fields are required");

    const token = localStorage.getItem("accessToken");
    const fd = new FormData();
    fd.append("categories_name", name);
    fd.append("categories_image", image);

    try {
      if (isEditing) {
        await api.put(`/categories/${editId}`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/categories", fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      toast.success(`Category ${isEditing ? "updated" : "added"} successfully`);
      setShowModal(false);
      setFormData({ name: "", image: "" });
      setIsEditing(false);
      setEditId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit category");
    }
  };

  const handleEdit = (cat) => {
    let imageName = cat.categories_image?.replace("/uploads/", "") || "";
    setFormData({ name: cat.categories_name, image: imageName });
    setEditId(cat.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  // Slider logic
  const visibleCategories = filteredCategories.slice(
    currentIndex,
    currentIndex + visibleCount
  );

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentIndex((prev) =>
      Math.min(prev + 1, filteredCategories.length - visibleCount)
    );

  return (
    <div className="lg:p-4">
      {/* Header with search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Categories</h1>
        <div className="w-full sm:w-1/3">
          <Searchbar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search categories..."
          />
        </div>
      </div>

      {/* Add Category */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 bg-gray-200 p-4 rounded-lg">
        <p className="font-medium">Add Categories</p>
        <button
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-full"
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            setFormData({ name: "", image: "" });
          }}
        >
          Add Category
        </button>
      </div>

      {/* Category Slider */}
      <div className="flex items-center gap-2 sm:gap-4 mb-6">
        <button onClick={handlePrev} disabled={currentIndex === 0}>
          <FcPrevious size={24} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
          {visibleCategories.map((cat) => (
            <div
              key={cat.id}
              className="border p-4 rounded shadow hover:shadow-md transition w-full"
            >
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${cat.categories_image}`}
                alt={cat.categories_name}
                className="w-full h-32 object-contain mb-2 rounded transform transition-transform duration-300 hover:scale-105"
              />
              <p className="font-medium text-center mb-1">
                {cat.categories_name}
              </p>
              <p className="text-sm text-gray-600 text-center mb-2">
                Products: {cat.productsCount}
              </p>
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex + visibleCount >= filteredCategories.length}
        >
          <FcNext size={24} />
        </button>
      </div>

      {/* Admin Products */}
      <div>
        <AllProducts />
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setFormData({ name: "", image: "" });
          setIsEditing(false);
          setEditId(null);
        }}
        onSubmit={handleSubmitCategory}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Category;
