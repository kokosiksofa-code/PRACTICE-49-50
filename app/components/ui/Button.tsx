// Импортируем типы из React: ButtonHTMLAttributes (стандартные атрибуты кнопки) и ReactNode (для children)
import type { ButtonHTMLAttributes, ReactNode } from "react";

// Интерфейс пропсов компонента Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode; // Содержимое кнопки (текст, иконки, другие элементы)
    variant?: "primary" | "secondary"; // Вариант стиля кнопки: основной или второстепенный
}

// Экспортируем компонент Button по умолчанию
export default function Button({
    children,                               // Содержимое кнопки
    variant = "primary",                    // Вариант стиля, по умолчанию "primary"
    className = "",                         // Дополнительные CSS-классы (можно передать извне)
    ...props                                // Все остальные стандартные атрибуты кнопки (onClick, disabled, type и т.д.)
}: ButtonProps) {
    // Базовые CSS-классы для всех кнопок
    const baseClass = "px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50";
    // Объект с вариантами стилей 
    const variants = {
        // Основная кнопка: насыщенный медовый фон с тёмно-медовым при наведении
        primary: "bg-tom-thumb-600 text-white hover:bg-tom-thumb-700",
        // Второстепенная кнопка: светло-медовый фон с тёмно-медовым текстом
        secondary: "bg-tom-thumb-100 text-tom-thumb-700 hover:bg-tom-thumb-200",
    };
    // Объединяем базовые классы, вариант стиля и пользовательские классы
    return (
        <button
            className={`${baseClass} ${variants[variant]} ${className}`}  // Объединяем все классы
            {...props}  // Передаём все остальные атрибуты (onClick, disabled, type, id и т.д.)
        >
            {children}
        </button>
    );
}