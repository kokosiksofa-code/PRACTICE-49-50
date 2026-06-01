// Импортируем тип ReactNode для children (содержимого модального окна)
import type { ReactNode } from "react";

// Интерфейс пропсов компонента Modal
interface ModalProps {
    isOpen: boolean;        // Флаг: открыто ли модальное окно
    onClose: () => void;    // Функция закрытия окна
    children: ReactNode;    // Содержимое модального окна
    title: string;          // Заголовок модального окна
}

// Экспортируем компонент Modal по умолчанию
export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
    // Если окно закрыто — ничего не рендерим
    if (!isOpen) return null;

    return (
        // Затемняющий фон на весь экран, центрирует содержимое
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            
            {/* Полупрозрачный затемнённый фон (оверлей) — при клике закрывает окно */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Само модальное окно (белая карточка с медовыми акцентами) */}
            <div className="relative bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-tom-thumb-100">
                {/* Верхняя панель: заголовок + кнопка закрытия */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-tom-thumb-800">{title}</h2>  {/* МЕДОВЫЙ: заголовок тёмно-медовый */}
                    {/* Кнопка закрытия (крестик) */}
                    <button
                        onClick={onClose}
                        className="text-tom-thumb-300 hover:text-tom-thumb-500 text-2xl leading-none transition-colors"
                    >
                        ✕
                    </button>
                </div>
                  {children}
             </div>
        </div>
    );
}