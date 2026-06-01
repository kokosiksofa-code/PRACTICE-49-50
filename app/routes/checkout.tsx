// страница оформления заказа

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../services/apiClient";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

// тип данных формы
interface CheckoutFormData {
    name: string;
    phone: string;
    comment?: string;
    paymentMethod: "card" | "cash";
}

// метаданные страницы
export function meta() {
    return [{ title: "Оформление заказа | MeowQ" }];
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submittedData, setSubmittedData] = useState<CheckoutFormData | null>(null);

    // react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CheckoutFormData>({
        defaultValues: {
            name: "",
            phone: "",
            comment: "",
            paymentMethod: "card",
        },
    });

    const paymentMethod = watch("paymentMethod");

    // автозаполнение имени, если пользователь авторизован
    useEffect(() => {
        if (user?.name) {
            setValue("name", user.name);
        }
    }, [user, setValue]);

    // если корзина пуста - показываем сообщение
    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-stone-600 mb-4">Корзина пуста</p>
                <Link to="/menu" className="text-tom-thumb-600 hover:underline">
                    Перейти в меню
                </Link>
            </div>
        );
    }

    // отправка формы
    const onSubmit = async (data: CheckoutFormData) => {
        setIsProcessing(true);

        // формируем данные для отправки на сервер
        const orderData = {
            customer: {
                name: data.name,
                phone: data.phone,
                comment: data.comment,
                paymentMethod: data.paymentMethod,
            },
            items: items.map(item => ({
                id: item.menuItem.id,
                name: item.menuItem.name,
                price: item.menuItem.price,
                quantity: item.quantity,
            })),
            total: totalAmount,
            userId: user?.uid || null,  // привязываем заказ к пользователю
        };

        try {
            // отправляем заказ на сервер
            await apiClient.post("/orders", orderData);
            setSubmittedData(data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("ошибка при отправке заказа:", error);
            alert("не удалось отправить заказ. проверьте подключение к серверу.");
        } finally {
            setIsProcessing(false);
        }
    };

    // закрытие модального окна и очистка корзины
    const handleCloseModal = () => {
        setIsModalOpen(false);
        clearCart();
        navigate("/");
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-tom-thumb-800 mb-8 text-center">
                Оформление заказа
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* поле имени */}
                <div>
                    <label className="block text-stone-700 font-medium mb-2">
                        Ваше имя *
                    </label>
                    <input
                        type="text"
                        placeholder="Иван Иванов"
                        className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"
                        {...register("name", { required: "Укажите ваше имя" })}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* поле телефона */}
                <div>
                    <label className="block text-stone-700 font-medium mb-2">
                        Телефон *
                    </label>
                    <input
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"
                        {...register("phone", { required: "Укажите номер телефона" })}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                </div>

                {/* поле комментария */}
                <div>
                    <label className="block text-stone-700 font-medium mb-2">
                        Комментарий к заказу
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Пожелания, аллергии..."
                        className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"
                        {...register("comment")}
                    />
                </div>

                {/* способ оплаты */}
                <div>
                    <label className="block text-stone-700 font-medium mb-2">
                        Способ оплаты
                    </label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="card"
                                className="accent-tom-thumb-600"
                                {...register("paymentMethod")}
                            />
                            <span>Картой онлайн</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="cash"
                                className="accent-tom-thumb-600"
                                {...register("paymentMethod")}
                            />
                            <span>Наличными при получении</span>
                        </label>
                    </div>
                </div>

                {/* блок с составом заказа */}
                <div className="bg-tom-thumb-50 rounded-xl p-5 border border-tom-thumb-100">
                    <h3 className="font-bold text-tom-thumb-800 mb-3">Ваш заказ:</h3>
                    {items.map((item) => (
                        <div key={item.menuItem.id} className="flex justify-between text-stone-600 py-1">
                            <span>
                                {item.menuItem.name} × {item.quantity}
                            </span>
                            <span>{item.menuItem.price * item.quantity} ₽</span>
                        </div>
                    ))}
                    <div className="border-t border-tom-thumb-200 mt-3 pt-3 flex justify-between font-bold text-lg">
                        <span>Итого:</span>
                        <span className="text-tom-thumb-700">{totalAmount} ₽</span>
                    </div>
                </div>

                {/* кнопка отправки */}
                <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 text-lg"
                >
                    {isProcessing ? "Обработка платежа..." : "Оформить заказ"}
                </Button>
            </form>

            {/* модальное окно подтверждения */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Заказ оформлен!"
            >
                <div className="text-center">
                    <p className="text-stone-600 mb-4">
                        {submittedData?.name}, спасибо за заказ!
                    </p>
                    <p className="text-stone-600 mb-4">
                        Мы свяжемся с вами по номеру {submittedData?.phone}
                    </p>
                    <Button onClick={handleCloseModal} className="mt-4">
                        На главную
                    </Button>
                </div>
            </Modal>
        </div>
    );
}