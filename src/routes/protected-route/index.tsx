import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    // const { remove, getDecoded } = useJwt();
    // const { allowedPages } = useUserState();

    const tokenExp = true;
    if (!tokenExp) {
        // const currentDate = Date.now() / 1000;
        // if (currentDate > tokenExp) {
        //     remove();
        //     localStorage.clear();
        //     return <Navigate to="/login" />;
        // } else {
        //     if (!allowedPages) {
        //         remove();
        //         localStorage.clear();
        //         return <Navigate to="/login" />;
        //     }
        //     if (!allowedPages?.includes(permission)) {
        //         return <Navigate to="/unauthorized" />;
        //     }
        // }
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute