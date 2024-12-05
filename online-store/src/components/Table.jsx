import React, { useState ,useEffect} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const ProductPage = () => {
  const [products, setProducts] = useState([]);

  const handleUpdate = (id) => {
    alert(`Update product with ID: ${id}`);
    // Implement your update logic here
  };
  const token = localStorage.getItem('token');
  

  const fetchProduct = async ()=>{
    try{
      const response = await axios.get('http://127.0.0.1:8000/products/',{
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = response.data
      setProducts(data)
      console.log(data);
      
    }catch(err){
      console.log(err.message)
    }

  }

  useEffect(()=>{
    fetchProduct()
  },[])

  const handleDelete = (id) => {
    const newProducts = products.filter((product) => product.ProductID !== id);
    setProducts(newProducts);
  };

  return (
    <div className="flex">
      
      <div className="flex-1 p-6 ml-20 lg:ml-72 mt-16 bg-gray-100 min-h-screen">
        {/* Product Page Content */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Manage Products
        </h1>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
            Product List
          </h2>

          {/* Table */}
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-3 text-left">Product ID</th>
                <th className="px-6 py-3 text-left">Product Code</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Total Stock</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.ProductID} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3">{product.ProductID}</td>
                  <td className="px-6 py-3">{product.ProductCode}</td>
                  <td className="px-6 py-3">{product.ProductName}</td>
                  <td className="px-6 py-3">{product.TotalStock}</td>
                  <td className="px-6 py-3 flex justify-center gap-4">
                    <Link to={`/product/${product.id}`}
                      className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(product.ProductID)}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
