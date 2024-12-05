import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSubVariant, setEditingSubVariant] = useState(null); // To manage which sub-variant is being edited
  const [updatedOption, setUpdatedOption] = useState("");
  const [updatedStock, setUpdatedStock] = useState("");
  const [newSubVariant, setNewSubVariant] = useState({ variantId: "", option: "", stock: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingVariant, setIsAddingVariant] = useState(false); // To manage adding a new variant

  const [newVariant, setNewVariant] = useState({ name: "", options: [{ option: "", stock: 0 }] });

  const { id } = useParams();

  // Fetch product details from the Django API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`);
        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleEditSubVariant = (subVariant) => {
    setEditingSubVariant(subVariant);
    setUpdatedOption(subVariant.option);
    setUpdatedStock(subVariant.stock);
  };
  const handleAddVariant = async (e) => {
    e.preventDefault();

    if (!newVariant.name || newVariant.options.some(option => !option.option || option.stock <= 0)) {
      setError("Please fill all fields correctly.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/products/${id}/add_variant/`,
        newVariant
      );
      setProduct((prevProduct) => ({
        ...prevProduct,
        variants: [...prevProduct.variants, response.data],
      }));
      setNewVariant({ name: "", options: [{ option: "", stock: 0 }] });
      setIsAddingVariant(false);
    } catch (err) {
      setError("Failed to add variant. Please try again.");
    }
  };

  const handleSaveSubVariant = async (subVariantId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/sub-variants/${subVariantId}/`, {
        option: updatedOption,
        stock: updatedStock,
      });

      // Update the product state with the new sub-variant data
      const updatedProduct = { ...product };
      updatedProduct.variants = updatedProduct.variants.map((variant) => {
        variant.sub_variants = variant.sub_variants.map((subVariant) =>
          subVariant.id === subVariantId
            ? { ...subVariant, option: updatedOption, stock: updatedStock }
            : subVariant
        );
        return variant;
      });

      setProduct(updatedProduct);
      setEditingSubVariant(null);
    } catch (err) {
      setError("Failed to update sub-variant. Please try again.");
    }
  };
  const handleDeleteSubVariant = async (subVariantId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/sub-variants/${subVariantId}/delete/`);
      
      // Update the product state by removing the deleted sub-variant
      const updatedProduct = { ...product };
      updatedProduct.variants = updatedProduct.variants.map((variant) => {
        variant.sub_variants = variant.sub_variants.filter((subVariant) => subVariant.id !== subVariantId);
        return variant;
      });

      setProduct(updatedProduct);
    } catch (err) {
      setError("Failed to delete sub-variant. Please try again.");
    }
  };

  const handleAddSubVariant = async (e) => {
    e.preventDefault();

    if (!newSubVariant.variantId || !newSubVariant.option || newSubVariant.stock <= 0) {
      setError("Please fill all fields correctly.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/products/${id}/add_subvariant/`, 
        newSubVariant
      );
      setProduct((prevProduct) => {
        // Add the new subvariant to the relevant variant
        const updatedVariants = prevProduct.variants.map(variant => {
          if (variant.id === newSubVariant.variantId) {
            return {
              ...variant,
              sub_variants: [...variant.sub_variants, response.data]
            };
          }
          return variant;
        });
        return { ...prevProduct, variants: updatedVariants };
      });
      setNewSubVariant({ variantId: "", option: "", stock: 0 });
      setIsAdding(false);
    } catch (err) {
      setError("Failed to add subvariant. Please try again.");
    }
  };


  if (loading) {
    return <div className="text-center text-gray-500">Loading product...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-40">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">{product.ProductName}</h1>
      <p className="text-gray-600 mb-4">HSN Code: {product.HSNCode}</p>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="w-full md:w-1/3">
          {product.ProductImage ? (
            <img
              src={`http://127.0.0.1:8000/${product.ProductImage}`}
              alt={product.ProductName}
              className="w-full h-auto object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
              <span className="text-gray-500 text-xl">No Image Available</span>
            </div>
          )}
        </div>

        {/* Product Details and Variants */}
        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Variants</h2>
          {product.variants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border-collapse border border-gray-200">
                <thead className="bg-gray-300 text-gray-800">
                  <tr>
                    <th className="px-4 py-2 border border-gray-200">Variant</th>
                    <th className="px-4 py-2 border border-gray-200">Option</th>
                    <th className="px-4 py-2 border border-gray-200">Stock</th>
                    <th className="px-4 py-2 border border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) =>
                    variant.sub_variants.map((subVariant, index) => (
                      <tr
                        key={subVariant.id}
                        className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                      >
                        <td className="px-4 py-2 border border-gray-200">
                          {variant.name}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {editingSubVariant?.id === subVariant.id ? (
                            <input
                              type="text"
                              value={updatedOption}
                              onChange={(e) => setUpdatedOption(e.target.value)}
                              className="border border-gray-300 p-2 rounded-md w-full"
                            />
                          ) : (
                            subVariant.option
                          )}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {editingSubVariant?.id === subVariant.id ? (
                            <input
                              type="number"
                              value={updatedStock}
                              onChange={(e) => setUpdatedStock(e.target.value)}
                              className="border border-gray-300 p-2 rounded-md w-full"
                            />
                          ) : (
                            subVariant.stock
                          )}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {editingSubVariant?.id === subVariant.id ? (
                            <button
                              onClick={() => handleSaveSubVariant(subVariant.id)}
                              className="text-white bg-blue-500 px-4 py-2 rounded-lg"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditSubVariant(subVariant)}
                              className="text-white bg-green-500 px-4 py-2 rounded-lg"
                            >
                              Edit
                            </button>
                          )}
                           <button
                            onClick={() => handleDeleteSubVariant(subVariant.id)}
                            className="text-white bg-red-500 px-4 py-2 rounded-lg ml-2"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No variants available.</p>
          )}

          {/* Additional Information */}
          <div className="mt-6">
            <p className="text-gray-600">Total Stock: {product.TotalStock}</p>
            <p className="text-gray-600">
              Is Favourite: {product.IsFavourite ? "Yes" : "No"}
            </p>
            <p className="text-gray-600">Active: {product.Active ? "Yes" : "No"}</p>
          </div>
          {isAddingVariant ? (
            <form onSubmit={handleAddVariant} className="mt-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Variant Name</label>
                <input
                  type="text"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Options</label>
                {newVariant.options.map((option, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={option.option}
                      onChange={(e) => {
                        const updatedOptions = [...newVariant.options];
                        updatedOptions[index].option = e.target.value;
                        setNewVariant({ ...newVariant, options: updatedOptions });
                      }}
                      className="border border-gray-300 p-2 rounded-md w-full mb-2"
                    />
                    <input
                      type="number"
                      value={option.stock}
                      onChange={(e) => {
                        const updatedOptions = [...newVariant.options];
                        updatedOptions[index].stock = parseInt(e.target.value, 10);
                        setNewVariant({ ...newVariant, options: updatedOptions });
                      }}
                      className="border border-gray-300 p-2 rounded-md w-full"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setNewVariant({ ...newVariant, options: [...newVariant.options, { option: "", stock: 0 }] })
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Add Option
                </button>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save Variant
              </button>
              <button
                type="button"
                onClick={() => setIsAddingVariant(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingVariant(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-6"
            >
              Add New Variant
            </button>
          )}
           {/* Add New Subvariant Form */}
           {isAdding && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-lg font-semibold mb-4">Add New Subvariant</h3>
              <form onSubmit={handleAddSubVariant}>
                <div className="mb-4">
                  <label htmlFor="variantId" className="block text-gray-700">
                    Variant
                  </label>
                  <select
                    id="variantId"
                    value={newSubVariant.variantId}
                    onChange={(e) =>
                      setNewSubVariant({ ...newSubVariant, variantId: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Variant</option>
                    {product.variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="option" className="block text-gray-700">
                    Option
                  </label>
                  <input
                    type="text"
                    id="option"
                    value={newSubVariant.option}
                    onChange={(e) =>
                      setNewSubVariant({ ...newSubVariant, option: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="stock" className="block text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    value={newSubVariant.stock}
                    onChange={(e) =>
                      setNewSubVariant({ ...newSubVariant, stock: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Save Subvariant
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Add New Subvariant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
