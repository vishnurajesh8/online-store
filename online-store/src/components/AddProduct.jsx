import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AddProduct = () => {
  // State for managing input values
  const [productData, setProductData] = useState({
    ProductID: "",
    ProductCode: "",
    ProductName: "",
    ProductImage: null,  // Updated to accept file
    CreatedUser: "", // Assume user is logged in, and you have the user ID available
    IsFavourite: false,
    Active: true,
    HSNCode: "",
    TotalStock: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const redirect = useNavigate()

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setProductData({
      ...productData,
      ProductImage: e.target.files[0],  // Store the file
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    // Append product data to FormData
    for (let key in productData) {
      formData.append(key, productData[key]);
    }
    const token = localStorage.getItem('token');
    

    try {
      const response = await axios.post("http://localhost:8000/api/products/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Important for file uploads
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("Product added:", response.data);
      alert("Product added successfully!");
      setIsLoading(false);

      redirect('/table')

    } catch (err) {
      console.error("Error adding product:", err);
      setError("There was an error adding the product.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-40">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Product ID */}
          <div>
            <label htmlFor="ProductID" className="block text-sm font-medium text-gray-700">
              Product ID
            </label>
            <input
              type="text"
              name="ProductID"
              id="ProductID"
              value={productData.ProductID}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Product Code */}
          <div>
            <label htmlFor="ProductCode" className="block text-sm font-medium text-gray-700">
              Product Code
            </label>
            <input
              type="text"
              name="ProductCode"
              id="ProductCode"
              value={productData.ProductCode}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="ProductName" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="ProductName"
              id="ProductName"
              value={productData.ProductName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Product Image */}
          <div>
            <label htmlFor="ProductImage" className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <input
              type="file"
              name="ProductImage"
              id="ProductImage"
              onChange={handleImageChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* HSN Code */}
          <div>
            <label htmlFor="HSNCode" className="block text-sm font-medium text-gray-700">
              HSN Code
            </label>
            <input
              type="text"
              name="HSNCode"
              id="HSNCode"
              value={productData.HSNCode}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Total Stock */}
          <div>
            <label htmlFor="TotalStock" className="block text-sm font-medium text-gray-700">
              Total Stock
            </label>
            <input
              type="number"
              name="TotalStock"
              id="TotalStock"
              value={productData.TotalStock}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Active Checkbox */}
          <div>
            <label htmlFor="Active" className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="Active"
                id="Active"
                checked={productData.Active}
                onChange={() => setProductData({ ...productData, Active: !productData.Active })}
                className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              Active
            </label>
          </div>

          {/* Is Favourite Checkbox */}
          <div>
            <label htmlFor="IsFavourite" className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="IsFavourite"
                id="IsFavourite"
                checked={productData.IsFavourite}
                onChange={() => setProductData({ ...productData, IsFavourite: !productData.IsFavourite })}
                className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              Is Favourite
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Product"}
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
