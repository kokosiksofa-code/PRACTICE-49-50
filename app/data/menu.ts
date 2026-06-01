import type { MenuItem } from "../types";

export const menuData: MenuItem[] = [
    // Закуски
    {
        id: 1,
        name: "Сырные палочки с соусом песто",
        description: "Хрустящие сырные палочки из моцареллы с ароматным соусом песто",
        price: 250,
        category: "Закуски",
        image: new URL("../assets/cheese_sticks.avif", import.meta.url).href,
    },
    {
        id: 2,
        name: "Овощные крокеты",
        description: "Картофельно-овощные шарики с пряной паприкой и сливочным соусом",
        price: 210,
        category: "Закуски",
        image: new URL("../assets/vegetable_croquettes.avif", import.meta.url).href,
    },
    {
        id: 3,
        name: "Креветки в кляре",
        description: "Тигровые креветки в хрустящем кляре с кисло-сладким соусом",
        price: 420,
        category: "Закуски",
        image: new URL("../assets/shrimp_tempura.avif", import.meta.url).href,
    },
    {
        id: 4,
        name: "Брускетта с авокадо",
        description: "Багет с нежным авокадо, кунжутом и бальзамическим кремом",
        price: 230,
        category: "Закуски",
        image: new URL("../assets/avocado_bruschetta.avif", import.meta.url).href,
    },

    //Основные блюда
    {
        id: 5,
        name: "Бургер с говядиной",
        description: "Сочная говяжья котлета, сыр чеддер, свежие овощи и фирменный соус",
        price: 520,
        category: "Основные блюда",
        image: new URL("../assets/beef_burger.avif", import.meta.url).href,
    },
    {
        id: 6,
        name: "Паста Карбонара",
        description: "Спагетти с беконом, сливочным соусом, пармезаном и яйцом пашот",
        price: 480,
        category: "Основные блюда",
        image: new URL("../assets/carbonara.avif", import.meta.url).href,
    },
    {
        id: 7,
        name: "Цезарь с курицей",
        description: "Классический салат с курицей-гриль, пармезаном и соусом Цезарь",
        price: 390,
        category: "Основные блюда",
        image: new URL("../assets/caesar_chicken.avif", import.meta.url).href,
    },
    {
        id: 8,
        name: "Рис с креветками и овощами",
        description: "Ароматный рис с тигровыми креветками, болгарским перцем и зеленым горошком",
        price: 550,
        category: "Основные блюда",
        image: new URL("../assets/shrimp_rice.avif", import.meta.url).href,
    },

    //Десерты
    {
        id: 9,
        name: "Чизкейк Нью-Йорк",
        description: "Нежный сливочный чизкейк с ягодным топпингом",
        price: 320,
        category: "Десерты",
        image: new URL("../assets/cheesecake.avif", import.meta.url).href,
    },
    {
        id: 10,
        name: "Тирамису",
        description: "Итальянский десерт с кофе маскарпоне и какао",
        price: 340,
        category: "Десерты",
        image: new URL("../assets/tiramisu.avif", import.meta.url).href,
    },
    {
        id: 11,
        name: "Мороженое пломбир",
        description: "Три шарика сливочного пломбира с шоколадным сиропом и вишней",
        price: 190,
        category: "Десерты",
        image: new URL("../assets/ice_cream.avif", import.meta.url).href,
    },

    //Напитки
    {
        id: 12,
        name: "Матча латте",
        description: "Японский зеленый чай матча с подогретым молоком",
        price: 240,
        category: "Напитки",
        image: new URL("../assets/matcha_latte.avif", import.meta.url).href,
    },
    {
        id: 13,
        name: "Лимонад малина-базилик",
        description: "Домашний лимонад с малиной, базиликом и газированной водой",
        price: 200,
        category: "Напитки",
        image: new URL("../assets/raspberry_basil_lemonade.avif", import.meta.url).href,
    },
    {
        id: 14,
        name: "Капучино",
        description: "Эспрессо с нежной молочной пенкой",
        price: 170,
        category: "Напитки",
        image: new URL("../assets/cappuccino.avif", import.meta.url).href,
    },
];