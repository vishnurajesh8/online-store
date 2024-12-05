import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/SideBar'
import HomePage from './components/Home'
import ProductForm from './components/AddProduct'
import ProductTable from './components/Table'
import LoginPage from './components/Login'
import ProtectedRoute from "./components/ProtectedRoute"

import SingleProduct from './components/Singleproduct'
function App() {

  const location = useLocation()

  // Check if the current route is the login page
  const isLoginPage = location.pathname === '/login'

  return (
    <>
      {!isLoginPage && <Navbar />} {/* Only render Navbar if not on LoginPage */}
      {!isLoginPage && <Sidebar />} {/* Only render Sidebar if not on LoginPage */}

      <Routes>
        <Route path='/' element={ <ProtectedRoute> <HomePage /> </ProtectedRoute> } />
        <Route path='/add_product' element={ <ProtectedRoute> <ProductForm /> </ProtectedRoute> } />
        <Route path='/table' element={ <ProtectedRoute> <ProductTable /> </ProtectedRoute> }/>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/product/:id' element={<SingleProduct/>}/>
      </Routes>
     
    </>
  )
}

export default App
