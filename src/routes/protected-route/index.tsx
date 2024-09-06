import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../../config/isTokenExpired';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

    const token = localStorage.getItem("token");
    const isExpiredToken: boolean = isTokenExpired(token);
    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute