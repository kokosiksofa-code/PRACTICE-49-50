from flask import Blueprint, jsonify, request
from config.firebase import db
from firebase_admin import firestore

# Создание Blueprint для маршрутов отзывов
reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route("/reviews", methods=["GET"])
def get_reviews():
    """
    Эндпоинт для получения списка всех отзывов.
    Отзывы сортируются по дате создания: от новых к старым.
    """
    # Проверка доступности базы данных
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500
    try:
        # Получаем все отзывы из коллекции "reviews", сортируем по created_at по убыванию (сначала новые)
        reviews_ref = db.collection("reviews").order_by("created_at", direction=firestore.Query.DESCENDING).stream()
        reviews_list = []
        
        # Проходим по каждому документу-отзыву
        for doc in reviews_ref:
            r = doc.to_dict()        # Преобразуем документ в словарь
            r["id"] = doc.id         # Добавляем ID документа в данные отзыва
            
            # Преобразуем временную метку Firebase Timestamp в ISO-строку для JSON-сериализации
            if "created_at" in r and r["created_at"]:
                r["created_at"] = r["created_at"].isoformat()
            
            reviews_list.append(r)
        
        # Возвращаем список отзывов в формате JSON
        return jsonify(reviews_list), 200
    except Exception as e:
        # В случае ошибки возвращаем сообщение об ошибке и код 500
        return jsonify({"error": str(e)}), 500

@reviews_bp.route("/reviews", methods=["POST"])
def add_review():
    """
    Эндпоинт для добавления нового отзыва.
    Ожидает JSON с полями: name (обязательно), text (обязательно), rating (опционально).
    """
    # Проверка доступности базы данных
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500
    
    # Получаем JSON-данные из тела запроса
    data = request.json
    
    # Валидация: проверяем наличие обязательных полей (имя и текст отзыва)
    if not data or "name" not in data or "text" not in data:
        return jsonify({"error": "Имя и текст отзыва обязательны"}), 400

    try:
        # Формируем объект нового отзыва
        new_review = {
            "name": data["name"],                    # Имя автора отзыва
            "rating": data.get("rating", 5),         # Оценка (по умолчанию 5, если не указана)
            "text": data["text"],                    # Текст отзыва
            "created_at": firestore.SERVER_TIMESTAMP # Серверная временная метка Firebase
        }
        
        # Добавляем документ в коллекцию "reviews" (автоматическая генерация ID)
        db.collection("reviews").add(new_review)
        
        # Возвращаем успешный ответ
        return jsonify({"success": True}), 201
    except Exception as e:
        # В случае ошибки возвращаем сообщение об ошибке и код 500
        return jsonify({"error": str(e)}), 500