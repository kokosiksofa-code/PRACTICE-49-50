import { restaurantInfo } from "../data/restaurant";
import restaurantImage from "../assets/restaurant.avif";

// Мета-данные для SEO
export function meta() {
    return [{ title: "О нас | MeowQ" }];
}

// Экспортируем компонент AboutPage по умолчанию
export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Секция "О нас" — описание ресторана */}
            <section className="bg-tom-thumb-50 rounded-3xl p-8 shadow-sm border border-tom-thumb-100">
                <h1 className="text-3xl font-bold text-tom-thumb-800 mb-4">О нас</h1>
                <p className="text-lg text-tom-thumb-600 leading-relaxed">
                    MeowQ — уютное кафе с домашней атмосферой и авторской кухней. 
                    Мы готовим с любовью, используя только свежие продукты, 
                    и всегда рады видеть вас в нашем кошачьем уголке
                </p>
            </section>

            {/* Секция "Наши преимущества" — сетка с преимуществами */}
            <section className="grid gap-6 md:grid-cols-2">
                {/* Блок преимуществ */}
                <div className="rounded-3xl bg-white p-8 shadow-sm border border-tom-thumb-100 hover:shadow-md transition-shadow">
                    <h2 className="text-2xl font-semibold text-tom-thumb-800 mb-3">Наши преимущества</h2>
                    <ul className="space-y-3 text-tom-thumb-600">
                        <li className="flex items-center gap-2">
                            Свежие ингредиенты и домашние рецепты
                        </li>
                        <li className="flex items-center gap-2">
                            Быстрое обслуживание и уютная атмосфера
                        </li>
                        <li className="flex items-center gap-2">
                            Удобное расположение в центре города
                        </li>
                        <li className="flex items-center gap-2">
                            Домашняя кухня как у бабушки
                        </li>
                    </ul>
                </div>
                {/* Блок с изображением ресторана */}
                <div className="rounded-3xl bg-white p-4 shadow-sm border border-tom-thumb-100 overflow-hidden">
                    <img 
                        src={restaurantImage} 
                        alt="Ресторан MeowQ" 
                        className="w-full h-auto rounded-2xl object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </section>
        </div>
    );
}