// src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'


export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = useAuthStore((s) => s.token)
    return token ? children : <Navigate to="/login" replace />
}
