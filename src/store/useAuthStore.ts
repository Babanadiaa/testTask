// src/store/useAuthStore.ts
import { create } from 'zustand'
import Cookies from 'js-cookie'
import { auth } from '../firebaseConfig'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'
import type { User } from 'firebase/auth'

// Тип користувача (спрощений)
export type MyUser = {
    uid: string
    email: string | null
    name?: string | null
}

type AuthState = {
    user: MyUser | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    setUser: (user: MyUser | null) => void
}

// 🔹 Створюємо Zustand store
export const useAuthStore = create<AuthState>((set) => ({
    user: Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null,
    loading: true,

    // 🔹 Вхід
    login: async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const firebaseUser = userCredential.user

        const currentUser: MyUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName ?? null
        }

        Cookies.set('user', JSON.stringify(currentUser))
        set({ user: currentUser, loading: false })
    },

    // 🔹 Реєстрація
    register: async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const firebaseUser = userCredential.user

        const newUser: MyUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName ?? null
        }

        Cookies.set('user', JSON.stringify(newUser))
        set({ user: newUser, loading: false })
    },

    // 🔹 Вихід
    logout: async () => {
        await signOut(auth)
        Cookies.remove('user')
        set({ user: null })
    },

    // 🔹 Встановлення користувача вручну (для listener)
    setUser: (user) => set({ user })
}))

// 🔹 Відстеження стану користувача при оновленні сторінки
onAuthStateChanged(auth, (firebaseUser: User | null) => {
    if (firebaseUser) {
        const user: MyUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName ?? null
        }
        Cookies.set('user', JSON.stringify(user))
        useAuthStore.getState().setUser(user)
    } else {
        Cookies.remove('user')
        useAuthStore.getState().setUser(null)
    }
})
