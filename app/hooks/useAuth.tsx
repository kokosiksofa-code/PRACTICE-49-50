import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase.config";
import type { UserProfile } from "~/types";

// Тип значения контекста аутентификации
interface AuthContextValue {
    user: UserProfile | null;      // Текущий пользователь или null
    loading: boolean;               // Флаг загрузки
    logout: () => Promise<void>;    // Функция выхода
}

// Создание контекста (изначально null)
const AuthContext = createContext<AuthContextValue | null>(null);

// Провайдер аутентификации (оборачивает приложение)
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Подписка на изменения состояния аутентификации Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Если пользователь авторизован - сохраняем его данные
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Пользователь",
                });
            } else {
                // Если не авторизован - null
                setUser(null);
            }
            setLoading(false); // Загрузка завершена
        });

        // Отписка при размонтировании
        return () => unsubscribe();
    }, []);

    // Функция выхода из аккаунта
    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Хук для использования контекста аутентификации
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}