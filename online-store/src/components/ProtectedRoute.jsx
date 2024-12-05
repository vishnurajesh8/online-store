

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Attempt to retrieve the token
    console.log("JWT Token Retrieved in ProtectedRoute:", token);
    return token ? children : <Navigate to={'/login'} replace/>;
    
};
console.log("ProtectedRoute Loaded");
export default ProtectedRoute;
