// Импортируем компоненты Link и NavLink из react-router
import { Link, NavLink, useNavigate } from "react-router";
// Импортируем хуки для корзины и аутентификации
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
// Импортируем иконки
import { FiShoppingCart, FiUser, FiLogOut, FiClock, FiLogIn } from "react-icons/fi";
// Импортируем хуки React
import { useState, useRef, useEffect } from "react";

// Экспортируем компонент Header по умолчанию
export default function Header() {
    // Получаем количество товаров из корзины
    const { totalCount } = useCart();
    // Получаем данные пользователя и функцию выхода
    const { user, logout } = useAuth();
    // Хук для навигации
    const navigate = useNavigate();
    // Состояние для выпадающего меню пользователя
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Ref для отслеживания кликов вне меню
    const menuRef = useRef<HTMLDivElement>(null);

    // Закрытие меню при клике вне его области
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Выход из аккаунта и перенаправление на главную
    const handleLogout = async () => {
        await logout();
        navigate("/");
        setIsMenuOpen(false);
    };

    return (
        // Шапка с медово-жёлтой цветовой схемой (твой цвет tom-thumb-700)
        <header className="bg-tom-thumb-700 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                
                {/* Логотип/название ресторана — ссылка на главную */}
                <Link to="/" className="text-2xl font-bold hover:text-tom-thumb-200 transition-colors">
                    MeowQ
                </Link>

                {/* Навигационное меню (десктоп) */}
                <nav className="hidden md:flex gap-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive 
                                ? "text-tom-thumb-200 font-semibold border-b-2 border-tom-thumb-200" 
                                : "text-white hover:text-tom-thumb-200 transition"
                        }
                    >
                        Главная
                    </NavLink>
                    <NavLink
                        to="/menu"
                        className={({ isActive }) =>
                            isActive 
                                ? "text-tom-thumb-200 font-semibold border-b-2 border-tom-thumb-200" 
                                : "text-white hover:text-tom-thumb-200 transition"
                        }
                    >
                        Меню
                    </NavLink>
                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            isActive 
                                ? "text-tom-thumb-200 font-semibold border-b-2 border-tom-thumb-200" 
                                : "text-white hover:text-tom-thumb-200 transition"
                        }
                    >
                        Корзина
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive 
                                ? "text-tom-thumb-200 font-semibold border-b-2 border-tom-thumb-200" 
                                : "text-white hover:text-tom-thumb-200 transition"
                        }
                    >
                        О нас
                    </NavLink>
                </nav>

                {/* Правая часть: корзина и профиль */}
                <div className="flex items-center gap-4">
                    
                    {/* Корзина с иконкой и счетчиком */}
                    <Link to="/cart" className="relative">
                        <FiShoppingCart className="w-6 h-6 text-white hover:text-tom-thumb-200 transition" />
                        {totalCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-tom-thumb-200 text-tom-thumb-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {totalCount}
                            </span>
                        )}
                    </Link>

                    {/* Профиль пользователя / выпадающее меню */}
                    <div className="relative" ref={menuRef}>
                        {user ? (
                            <>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 bg-tom-thumb-600 hover:bg-tom-thumb-500 rounded-full px-3 py-2 transition"
                                >
                                    <FiUser className="w-4 h-4 text-white" />
                                    <span className="text-sm font-medium text-white">{user.name}</span>
                                </button>

                                {/* Выпадающее меню пользователя */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50">
                                        <Link
                                            to="/orders"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-stone-700 hover:bg-tom-thumb-50 transition"
                                        >
                                            <FiClock className="w-4 h-4 text-tom-thumb-600" />
                                            <span>История заказов</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-stone-700 hover:bg-tom-thumb-50 transition"
                                        >
                                            <FiLogOut className="w-4 h-4 text-tom-thumb-600" />
                                            <span>Выйти</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                to="/auth"
                                className="flex items-center gap-2 bg-tom-thumb-200 text-tom-thumb-700 hover:bg-tom-thumb-100 px-4 py-2 rounded-full transition font-medium"
                            >
                                <FiLogIn className="w-4 h-4" />
                                <span>Войти</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}