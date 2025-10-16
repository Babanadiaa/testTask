// src/store/useAuthStore.ts
import { create } from 'zustand'
import Cookies from 'js-cookie'
import axios from 'axios'

type User = {
    id: number
    name: string
    email: string
    password: string
}

type AuthState = {
    token: string | null
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    token: Cookies.get('token') || null,
    user: Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null,

    // 🔹 Авторизація
    login: async (email, password) => {
        const res = await axios.get(`http://localhost:5000/users?email=${email}`)
        const user = res.data[0]

        if (!user || user.password !== password) {
            throw new Error('Invalid email or password')
        }

        const token = `token-${user.id}`

        // зберігаємо в Cookies
        Cookies.set('token', token)
        Cookies.set('user', JSON.stringify(user))

        set({ token, user })
    },

    // 🔹 Реєстрація
    register: async (name, email, password) => {
        const existing = await axios.get(`http://localhost:5000/users?email=${email}`)
        if (existing.data.length > 0) {
            throw new Error('User already exists')
        }

        const res = await axios.post('http://localhost:5000/users', {
            id: Date.now(),
            name,
            email,
            password
        })

        const user = res.data
        const token = `token-${user.id}`

        Cookies.set('token', token)
        Cookies.set('user', JSON.stringify(user))

        set({ token, user })
    },

    // 🔹 Вихід
    logout: () => {
        Cookies.remove('token')
        Cookies.remove('user')
        set({ token: null, user: null })
    }
}))
