from flask import Blueprint, jsonify, request
from config.firebase import db
from firebase_admin import firestore

# Создание Blueprint для маршрутов заказов
orders_bp = Blueprint('orders', __name__)

@orders_bp.route("/orders", methods=["POST"])
def create_order():
    """
    Эндпоинт для создания нового заказа.
    Ожидает JSON с полями: customer, items, total (опционально), userId (опционально).
    """
    # Проверка доступности базы данных
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500
    
    # Получаем JSON-данные из тела запроса
    data = request.json
    # Валидация: проверяем наличие обязательных полей
    if not data or "customer" not in data or "items" not in data:
        return jsonify({"error": "Неполные данные заказа."}), 400

    try:
        # Формируем объект нового заказа для сохранения в БД
        new_order = {
            "customer": data["customer"],          # Информация о клиенте (имя, телефон и т.д.)
            "items": data["items"],                # Список заказанных блюд
            "total": data.get("total", 0),         # Общая сумма заказа (по умолчанию 0)
            "userId": data.get("userId"),          # Идентификатор пользователя (если авторизован)
            "status": "Новый",                     # Статус заказа (по умолчанию "Новый")
            "created_at": firestore.SERVER_TIMESTAMP  # Серверная временная метка Firebase
        }
        # Добавляем документ в коллекцию "orders" (автоматическая генерация ID)
        _, doc_ref = db.collection("orders").add(new_order)
        # Логируем успешное создание заказа с полученным ID
        print(f"Получен новый заказ! ID в Firebase: {doc_ref.id}")
        # Возвращаем успешный ответ с ID созданного заказа
        return jsonify({"success": True, "order_id": doc_ref.id}), 201
    except Exception as e:
        # В случае ошибки возвращаем сообщение и код 500
        return jsonify({"error": str(e)}), 500

@orders_bp.route("/orders", methods=["GET"])
def get_orders():
    """
    Эндпоинт для получения списка заказов.
    Поддерживает фильтрацию по userId через query-параметр.
    """
    # Проверка доступности базы данных
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500

    try:
        # Получаем userId из query-параметров (например, ?userId=123)
        user_id = request.args.get("userId")
        orders_ref = db.collection("orders")

        # Если userId передан - фильтруем заказы только этого пользователя
        if user_id:
            # Используем FieldFilter для сравнения (современный синтаксис Firebase)
            query = orders_ref.where(filter=firestore.FieldFilter("userId", "==", user_id))
            docs = query.stream()  # Выполняем запрос и получаем поток документов
        else:
            # Если userId не передан - получаем ВСЕ заказы из коллекции
            docs = orders_ref.stream()

        orders_list = []
        # Проходим по каждому документу-заказу
        for doc in docs:
            order_data = doc.to_dict()  # Преобразуем документ в словарь
            order_data["id"] = doc.id   # Добавляем ID документа в данные заказа
            
            # Обработка временной метки created_at
            if "created_at" in order_data and order_data["created_at"]:
                try:
                    # Преобразуем Firebase Timestamp в ISO-строку для JSON-сериализации
                    order_data["created_at"] = order_data["created_at"].isoformat()
                except AttributeError:
                    # Если это не Timestamp (например, строка), просто преобразуем в строку
                    order_data["created_at"] = str(order_data["created_at"])
            
            orders_list.append(order_data)

        # Возвращаем список заказов в формате JSON
        return jsonify(orders_list), 200
    except Exception as e:
        # Обработка любых ошибок при получении заказов
        return jsonify({"error": str(e)}), 500