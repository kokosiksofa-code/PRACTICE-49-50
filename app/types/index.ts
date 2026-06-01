// Интерфейс: пункт меню
export interface MenuItem {
    id: number;  // Уникальный числовой идентификатор блюда
    name: string; // Название блюда 
    description: string;  // Текстовое описание состава и особенностей
    price: number; // Цена в рублях (или другой валюте)
    category: "Закуски" | "Основные блюда" | "Десерты" | "Напитки"; // Категория — только один из четырёх вариантов
    image: string; // Ссылка на изображение блюда (URL или путь к файлу)
}

// Интерфейс: позиция в корзине (блюдо + количество)
export interface CartItem {
    menuItem: MenuItem; // Объект с данными блюда (ссылка на MenuItem)
    quantity: number;// Количество единиц данного блюда в корзине
}

// Интерфейс: информация о ресторане
export interface RestaurantInfo {
    name: string; // Название ресторана 
    address: string; // Физический адрес заведения
    phone: string;  // Контактный телефон (в виде строки, может содержать + и скобки)
    workHours: string; // Режим работы
}

// Интерфейс: данные оформленного заказа
export interface OrderData {
    items: CartItem[];  // Массив позиций корзины (что заказано и в каком количестве)
    total: number;   // Итоговая стоимость заказа
    customerName: string; // Имя клиента, оформившего заказ
}
// Информация о клиенте для заказа
export interface CustomerInfo {
    name: string;            
    phone: string;             
    comment?: string;          
    paymentMethod: "card" | "cash";  
}

// Заказ на сервере
export interface ServerOrder {
    id: string;                
    userId: string | null;     
    customer: CustomerInfo;   
    items: {                   
        id: number;            
        name: string;         
        price: number;        
        quantity: number;     
    }[];
    total: number;      
    status: "Новый" | "Готовится" | "В пути" | "Доставлен";  
    created_at: string;        
}

// Профиль пользователя
export interface UserProfile {
    uid: string;              
    email: string | null;     
    name?: string;           
}