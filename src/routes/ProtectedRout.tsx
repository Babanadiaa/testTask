// src/routes/ProtectedRout.tsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import type { ReactNode } from 'react'


export default function ProtectedRout({ children }: { children: ReactNode }) {
    const { user } = useAuthStore()
    return user ? children : <Navigate to="/login" />
}
