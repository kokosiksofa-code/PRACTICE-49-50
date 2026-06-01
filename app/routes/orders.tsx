import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import apiClient from "~/services/apiClient";

// Интерфейс товара в заказе
interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

// Интерфейс заказа
interface Order {
    id: string;
    status: string;
    total: number;
    created_at?: string;
    items: OrderItem[];
}

// Метаданные страницы (исправлено название на MeowQ)
export function meta() {
    return [{ title: "История заказов | MeowQ" }];
}

export default function OrdersPage() {
    // Получаем пользователя и статус загрузки аутентификации
    const { user, loading: authLoading } = useAuth();
    // Состояние для списка заказов
    const [orders, setOrders] = useState<Order[]>([]);
    // Состояние загрузки заказов
    const [isLoading, setIsLoading] = useState(true);

    // Эффект для загрузки заказов после того, как пользователь авторизован
    useEffect(() => {
        // Если аутентификация ещё загружается или пользователь не авторизован - ничего не делаем
        if (authLoading || !user) return;

        // Функция загрузки заказов с сервера
        const fetchOrders = async () => {
            try {
                // GET-запрос к эндпоинту /orders с параметром userId
                const response = await apiClient.get("/orders", {
                    params: { userId: user.uid }
                });
                // Сохраняем полученные заказы в состояние
                setOrders(response.data);
            } catch (error) {
                // Логируем ошибку в консоль
                console.error("Ошибка при загрузке заказов:", error);
            } finally {
                // В любом случае выключаем индикатор загрузки
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user, authLoading]); // Зависимости: перезапускаем при изменении user или authLoading

    // Пока идёт аутентификация или загрузка заказов - показываем сообщение
    if (authLoading || (user && isLoading)) {
        return <div className="text-center py-20 text-stone-500">Загрузка истории заказов...</div>;
    }

    // Если пользователь не авторизован - показываем предложение войти
    if (!user) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-stone-700 mb-4">История заказов недоступна</h2>
                <p className="text-stone-500 mb-6">Чтобы просматривать свои заказы, необходимо войти в аккаунт.</p>
                <Link to="/auth" className="inline-block bg-tom-thumb-600 text-white px-6 py-3 rounded-xl hover:bg-tom-thumb-700 transition-colors">
                    Войти в профиль
                </Link>
            </div>
        );
    }

    // Если заказов нет - показываем сообщение и ссылку на меню
    if (orders.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-stone-700 mb-4">Вы еще не делали заказов</h2>
                <Link to="/menu" className="text-tom-thumb-600 hover:underline text-lg">
                    Перейти в меню и заказать
                </Link>
            </div>
        );
    }

    // Основной рендер страницы со списком заказов
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-tom-thumb-900 mb-8 text-center">Мои заказы</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                        
                        {/* Верхняя часть карточки заказа: ID, дата, статус */}
                        <div className="bg-stone-50 px-5 py-4 border-b border-stone-200 flex justify-between items-center flex-wrap gap-2">
                            <div>
                                <span className="text-xs font-mono text-stone-400 block mb-0.5">ID: {order.id}</span>
                                <span className="text-xs font-medium text-stone-600">
                                    {order.created_at 
                                        ? new Date(order.created_at).toLocaleDateString("ru-RU", { 
                                            day: "numeric", 
                                            month: "long", 
                                            year: "numeric", 
                                            hour: "2-digit", 
                                            minute: "2-digit" 
                                        }) 
                                        : "Дата не указана"}
                                </span>
                            </div>
                            <div className="bg-stone-100 text-tom-thumb-600 text-xs font-semibold px-3 py-1 rounded-full">
                                {order.status}
                            </div>
                        </div>

                        {/* Список товаров в заказе */}
                        <div className="p-5 space-y-2">
                            {order.items.map((item, idx) => (
                                <div key={item.id || idx} className="flex justify-between text-stone-600">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>{item.price * item.quantity} ₽</span>
                                </div>
                            ))}
                        </div>

                        {/* Нижняя часть карточки: итоговая сумма */}
                        <div className="bg-stone-50/50 px-5 py-4 border-t border-stone-100 flex justify-between items-center font-bold text-lg">
                            <span className="text-stone-700 text-base">Итого:</span>
                            <span className="text-tom-thumb-600">{order.total} ₽</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}