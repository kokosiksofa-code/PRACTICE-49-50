import axios from "axios";
import { API_URL } from "~/config";

// Создание экземпляра axios клиента для взаимодействия с API
export const apiClient = axios.create({
    baseURL: API_URL,              // Базовый URL для всех запросов (из конфигурации)
    headers: {
        "Content-Type": "application/json",  // Устанавливаем формат данных JSON
    },
});

// Добавление интерсептора для обработки ответов и ошибок
apiClient.interceptors.response.use(
    // Функция успешного ответа: просто возвращаем ответ без изменений
    (response) => response,
    // Функция обработки ошибок: логируем ошибку в консоль и пробрасываем дальше
    (error) => {
        // Выводим в консоль данные об ошибке (если есть response.data) или просто текст ошибки
        console.error("API Error:", error.response?.data || error.message);
        // Возвращаем отклонённый промис с ошибкой для дальнейшей обработки вызывающим кодом
        return Promise.reject(error);
    }
);

// Экспортируем клиент как значение по умолчанию
export default apiClient;