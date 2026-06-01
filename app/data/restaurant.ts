// Импортируем тип RestaurantInfo из папки ~/types
import type { RestaurantInfo } from "../types";

// Экспортируем константу restaurantInfo, содержащую фактическую информацию о ресторане
export const restaurantInfo: RestaurantInfo = {
    // Название ресторана
    name: "MeowQ",
    // Физический адрес заведения
    address: "ул. Ленина 15",
    // Контактный телефон
    phone: "+7 (953) 780-78-66",
    // Режим работы
    workHours: "Пн-Сб: 08:00 - 20:00",
};