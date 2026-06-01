// Импорт хуков React для управления состоянием и побочными эффектами
import { useState, useEffect } from "react";
// Импорт кастомного хука для работы с корзиной
import { useCart } from "../hooks/useCart";
// Импорт компонента карточки блюда
import MenuCard from "../components/MenuCard";
// Импорт типа MenuItem для типизации данных о блюдах
import type { MenuItem } from "../types";
// Импорт настроенного клиента для HTTP-запросов к бэкенду
import { apiClient } from "../services/apiClient";

export function meta() {
    return [
        { title: "Меню | MeowQ" }  
    ];
}

// Главный компонент страницы меню
export default function MenuPage() {
    // Список категорий для фильтрации блюд
    const categories = ["Все", "Закуски", "Основные блюда", "Десерты", "Напитки"];
    
    // Состояние активной (выбранной) категории
    const [activeCategory, setActiveCategory] = useState("Все");
    
    // Получаем из хука корзины: общее количество товаров и функцию добавления
    const { totalCount, addItem } = useCart();

    // Состояние для хранения списка блюд, загруженных с сервера
    const [menuData, setMenuData] = useState<MenuItem[]>([]);
    
    // Состояние загрузки (показываем спиннер/сообщение пока данные грузятся)
    const [isLoading, setIsLoading] = useState(true);
    
    // Состояние для хранения ошибки, если запрос к серверу не удался
    const [error, setError] = useState<string | null>(null);

    // Эффект, который срабатывает один раз при загрузке компонента
    useEffect(() => {
        // Отправляем GET-запрос к бэкенду для получения меню
        apiClient.get("/menu")
            .then((response) => {
                // При успешном ответе сохраняем полученные данные в состояние
                setMenuData(response.data);
            })
            .catch((err) => {
                // При ошибке: извлекаем сообщение об ошибке или показываем стандартное
                setError(err?.response?.data?.message || err?.message || "Не удалось загрузить меню");
            })
            .finally(() => {
                // В любом случае (успех/ошибка) выключаем индикатор загрузки
                setIsLoading(false);
            });
    }, []);

    // Фильтрация блюд по выбранной категории
    const filteredMenu = activeCategory === "Все"
        ? menuData
        : menuData.filter(item => item.category === activeCategory);

    // Функция-обертка для добавления блюда в корзину
    const addToCart = (item: MenuItem) => {
        addItem(item);
    };

    // Пока данные загружаются — показываем сообщение о загрузке
    if (isLoading) {
        return (
            <div className="text-center py-20 text-xl font-medium text-stone-500">
                Загрузка меню...
            </div>
        );
    }

    // Если произошла ошибка — показываем сообщение об ошибке
    if (error) {
        return (
            <div className="text-center py-20 text-xl font-medium text-red-500">
                Ошибка: {error}
            </div>
        );
    }

    // Основной рендер страницы
    return (
        <div>
            {/* Верхняя панель: заголовок + счетчик */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-stone-800">Меню</h1>
                <span className="bg-tom-thumb-100 text-tom-thumb-600 px-4 py-2 rounded-full font-medium">
                    {totalCount} блюд
                </span>
            </div>

            {/* Строка фильтрации по категориям */}
            <div className="flex gap-3 mb-8 flex-wrap">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 rounded-full border transition-colors ${
                            activeCategory === cat 
                                ? "bg-tom-thumb-600 text-white border-tom-thumb-600"  // Активная = медово-желтая
                                : "bg-white text-stone-600 border-stone-200 hover:bg-tom-thumb-50 hover:border-tom-thumb-200"  // Неактивная
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Сетка карточек блюд */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenu.map(item => (
                    <MenuCard 
                        key={item.id}
                        item={item}
                        onAddToCart={addToCart}
                    />
                ))}
            </div>
        </div>
    );
}