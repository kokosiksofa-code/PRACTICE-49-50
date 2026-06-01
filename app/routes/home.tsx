// Импортируем Link для навигации между страницами
import { Link } from "react-router";
// Импортируем информацию о ресторане
import { restaurantInfo } from "../data/restaurant";

// Функция meta() для SEO — задаёт заголовок страницы
export function meta() {
    return [{ title: "MeowQ — Уютное кафе с домашней кухней" }];
}
// Экспортируем компонент HomePage по умолчанию
export default function HomePage() {
    return (
        // Основной контейнер: центрирование, вертикальные отступы
        <div className="text-center space-y-8">
            {/* Заголовок с названием ресторана */}
            <h1 className="text-5xl font-bold text-tom-thumb-800 mt-12">
                {restaurantInfo.name}
            </h1>
            {/* Подзаголовок/слоган ресторана — ПРИДУМАЙТЕ СВОЙ! */}
            <p className="text-xl text-tom-thumb-600 max-w-2xl mx-auto">
                Вкусно как у бабушки 
            </p>
            {/* Кнопка перехода в меню */}
            <Link
                to="/menu"
                className="inline-block bg-tom-thumb-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-tom-thumb-700 transition-colors"
            >
                Смотреть меню
            </Link>
     </div>
  );
}