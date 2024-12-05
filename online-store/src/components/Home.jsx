import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // For navigation
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import axios from "axios";
const HomePage = () => {
  // Add state to manage the visibility of the date range dropdown
  const [showDateRange, setShowDateRange] = useState(false);
  const [count,setCount]=useState({})
  
  // State to store product data
  const [products, setProducts] = useState([]);

  // Fetch product data from the API (You can replace this URL with your actual API endpoint)
  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage

    axios
      .get("http://localhost:8000/api/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      })
      .then((response) => {
        setProducts(response.data.low_stock_subvariants); 
        setCount(response.data)
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        // Handle the error as needed
      });
  }, []);
  
  // Function to toggle the dropdown visibility
  const toggleDateRange = () => {
    setShowDateRange(!showDateRange);
  };

  return (
    <div className="flex flex-1 bg-gray-100 pt-16"> {/* pt-16 to provide space under the navbar */}
      {/* Main Content Area */}
      <main className="flex-1 p-8 ml-20 md:ml-72 overflow-y-auto"> {/* ml-20 for a small gap between sidebar */}
        
        {/* Product Table Section */}
        <section className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Products with Low Stock</h3>
          
          {/* Table displaying product data */}
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Option</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.ProductID}>
                  <td className="px-4 py-2">{product.ProductName}</td>
                  <td className="px-4 py-2">{product.Option}</td>
                  <td className="px-4 py-2">{product.Stock}</td>
                  <td className="px-4 py-2">
                    {/* Link to product details page */}
                    <Link
                      to={`/product/${product.ProductID}`}
                      className="text-blue-500 hover:underline"
                    >
                      More
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Sales Overview Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Total Products Count</h3>
              <p className="text-lg text-gray-600">{count.total_products_count}</p>
            </div>
            
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">New Products Count </h3>
              <p className="text-lg text-gray-600">{count.new_products_count}</p>
            </div>
            
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Total Stock Count</h3>
              <p className="text-lg text-gray-600">{count.total_stock_count}</p>
            </div>
            
          </div>
        </section>

        {/* Footer Section */}
        <footer className="text-center mt-8">
          <p className="text-gray-600">© 2024 Sales Dashboard. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;
