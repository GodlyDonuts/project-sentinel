import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) {
        // Simple loading state while checking auth
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center text-white font-mono">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-sentinel-green border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm tracking-widest text-sentinel-green">AUTHENTICATING...</span>
                </div>
            </div>
        );
    }

    // Only render children if user exists
    return user ? <>{children}</> : null;
};
