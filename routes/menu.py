from flask import Blueprint, jsonify, request
from config.firebase import db
from data.menu_data import DEFAULT_MENU

# Создание Blueprint для маршрутов меню
menu_bp = Blueprint('menu', __name__)

def seed_menu_if_empty():
    """
    Проверяет, пуста ли коллекция 'menu' в Firebase.
    Если пуста - заполняет её данными из DEFAULT_MENU.
    """
    # Проверка: доступна ли база данных
    if db is None:
        return
    try:
        # Ссылка на коллекцию "menu"
        menu_ref = db.collection("menu")
        # Пытаемся получить один документ, чтобы проверить наличие данных
        docs = menu_ref.limit(1).get()
        # Если документов нет (коллекция пуста)
        if len(docs) == 0:
            print("База данных пуста. Заполняю меню оригинальными блюдами...")
            # Проходим по каждому пункту меню из DEFAULT_MENU
            for item in DEFAULT_MENU:
                # Добавляем документ с ID = item["id"] и данными из item
                menu_ref.document(str(item["id"])).set(item)
            print("Наполнение базы успешно завершено!")
    except Exception as e:
        # Логируем ошибку, но не прерываем выполнение программы
        print(f"Не удалось проверить или заполнить меню: {e}")

@menu_bp.route("/menu", methods=["GET"])
def get_menu():
    """
    Эндпоинт для получения всего меню.
    Возвращает JSON-список всех блюд с обновлёнными путями к изображениям.
    """
    # Проверка доступности базы данных
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500
    try:
        # Заполняем меню, если оно пустое
        seed_menu_if_empty()
        
        # Получаем все документы из коллекции "menu" в виде потока
        menu_ref = db.collection("menu").stream()
        menu_list = []
        # Базовый URL сервера (например, http://localhost:5000/)
        base_url = request.host_url 
        
        # Проходим по каждому документу
        for doc in menu_ref:
            # Преобразуем документ в словарь
            item = doc.to_dict()
            # Формируем полный URL к изображению (относительный путь заменяем на абсолютный)
            item["image"] = f"{base_url}assets/{item['image']}"
            menu_list.append(item)
        
        # Сортируем блюда по ID (по возрастанию) для консистентного порядка
        menu_list.sort(key=lambda x: x.get("id", 0))
        
        # Возвращаем JSON с кодом 200 (OK)
        return jsonify(menu_list), 200
    except Exception as e:
        # В случае любой ошибки возвращаем сообщение об ошибке и код 500
        return jsonify({"error": str(e)}), 500