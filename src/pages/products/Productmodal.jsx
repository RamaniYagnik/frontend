import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import api from "../../api/Api";
import { AuthContext } from "../../context/Authcontext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { productValidationSchema } from "../../component/formikvalidation/Validationschema";

const colorsList = ["Black", "White", "Yellow", "Green", "Blue", "Red"];

const ProductModal = ({ isOpen, onClose, category, allCategories, editId, editProduct }) => {
  const { fetchProducts } = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (editProduct?.products_image) {
      setPreview(`${import.meta.env.VITE_BACKEND_URL}/uploads/${editProduct.products_image}`);
    }
  }, [editProduct]);

  if (!isOpen) return null;

  const handleFileChange = (e, setFieldValue) => {
    const selected = e.target.files[0];
    setFile(selected);
    setFieldValue("products_image", selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("accessToken");
      const formDataToSend = new FormData();

      formDataToSend.append("products_name", values.products_name);
      formDataToSend.append("price", parseFloat(values.price));
      formDataToSend.append("category_id", values.selectedCategoryId);
      formDataToSend.append("colors", values.color);
      formDataToSend.append("tags", values.tags.join(","));

      if (file) formDataToSend.append("products_image", file);

      if (editId) {
        await api.put(`/products/${editId}`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully");
      }

      fetchProducts();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save product");
    }
  };

  const initialValues = {
    products_name: editProduct?.products_name || "",
    price: editProduct?.price || "",
    color: editProduct?.colors
      ? Array.isArray(editProduct.colors)
        ? editProduct.colors[0]
        : editProduct.colors
      : "",
    tags: editProduct?.tags
      ? Array.isArray(editProduct.tags)
        ? editProduct.tags
        : editProduct.tags.split(",").map((t) => t.trim())
      : [],
    newTag: "",
    selectedCategoryId: editProduct?.category_id || category?.id || "",
    products_image: editProduct?.products_image || null,
    isEdit: !!editId,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg md:max-w-xl max-h-[90vh] overflow-auto p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={productValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <>
              {/* Dynamic Category Title */}
              <h2 className="text-xl font-bold mb-4">
                {editId ? "Edit Product" : "Add Product"} in{" "}
                <span className="text-blue-600">
                  {allCategories.find((cat) => cat.id === values.selectedCategoryId)?.categories_name}
                </span>
              </h2>

              <Form>
                {/* Category */}
                <label className="block mb-2">Select Category</label>
                <Field
                  as="select"
                  name="selectedCategoryId"
                  className="w-full border px-3 py-2 rounded mb-4"
                >
                  {allCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categories_name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="selectedCategoryId" component="div" className="text-red-500 mb-2" />

                {/* Product Name */}
                <label className="block mb-2">Product Name</label>
                <Field
                  type="text"
                  name="products_name"
                  className="w-full border px-3 py-2 rounded mb-2"
                  placeholder="Enter name"
                />
                <ErrorMessage name="products_name" component="div" className="text-red-500 mb-2" />

                {/* Product Image */}
                <label className="block mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border px-3 py-2 rounded mb-2"
                  onChange={(e) => handleFileChange(e, setFieldValue)}
                />
                <ErrorMessage name="products_image" component="div" className="text-red-500 mb-2" />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded mb-4"
                  />
                )}

                {/* Price */}
                <label className="block mb-2">Price</label>
                <Field
                  type="number"
                  name="price"
                  className="w-full border px-3 py-2 rounded mb-2"
                  placeholder="Enter price"
                  min={0}
                />
                <ErrorMessage name="price" component="div" className="text-red-500 mb-2" />

                {/* Colors */}
                <label className="block mb-2">Color</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {colorsList.map((color) => (
                    <label key={color} className="flex items-center gap-2">
                      <Field
                        type="radio"
                        name="color"
                        value={color}
                        checked={values.color === color}
                        onChange={() => setFieldValue("color", color)}
                      />
                      {color}
                    </label>
                  ))}
                </div>
                <ErrorMessage name="color" component="div" className="text-red-500 mb-2" />

                {/* Tags */}
                <label className="block mb-2">Tags</label>
                <div className="flex gap-2 mb-2 flex-col sm:flex-row">
                  <input
                    type="text"
                    placeholder="Enter tag"
                    value={values.newTag}
                    onChange={(e) => setFieldValue("newTag", e.target.value)}
                    className="border px-3 py-2 rounded w-full sm:flex-1"
                  />
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-3 py-2 rounded mt-2 sm:mt-0"
                    onClick={() => {
                      const trimmed = values.newTag.trim();
                      if (trimmed && !values.tags.includes(trimmed)) {
                        setFieldValue("tags", [...values.tags, trimmed]);
                        setFieldValue("newTag", "");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {values.tags.map((tag) => (
                    <span key={tag} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() =>
                          setFieldValue(
                            "tags",
                            values.tags.filter((t) => t !== tag)
                          )
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 flex-wrap">
                  <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    {editId ? "Update" : "Submit"}
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProductModal;
