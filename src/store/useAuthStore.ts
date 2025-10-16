import { create } from 'zustand'
import Cookies from 'js-cookie'
import { auth } from '../firebaseConfig'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
} from 'firebase/auth'

// Тип користувача (спрощений)
type User = {
    uid: string
    email: string | null
    name?: string | null
}

type AuthState = {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    setUser: (user: User | null) => void
}

// 🔹 Створюємо Zustand store
export const useAuthStore = create<AuthState>((set) => ({
    user: Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null,
    loading: true,

    // 🔹 Вхід
    login: async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        const currentUser: User = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
        }

        Cookies.set('user', JSON.stringify(currentUser))
        set({ user: currentUser, loading: false })
    },

    // 🔹 Реєстрація
    register: async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        const newUser: User = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
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
    setUser: (user) => set({ user }),
}))

// 🔹 Відстеження стану користувача при оновленні сторінки
onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
        const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
        }
        Cookies.set('user', JSON.stringify(user))
        useAuthStore.getState().setUser(user)
    } else {
        Cookies.remove('user')
        useAuthStore.getState().setUser(null)
    }
})
