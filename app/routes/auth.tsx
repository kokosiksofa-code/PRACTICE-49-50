// страница авторизации (вход и регистрация)

import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase.config";

// тип данных формы
interface AuthFormData {
  name?: string;          
  email: string;       
  password: string;        
  confirmPassword?: string; 
}

// метаданные страницы (исправлено название)
export function meta() {
  return [{ title: "Авторизация | MeowQ" }];  
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);     // режим вход или регистрация
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // настройка react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>();

  // обработка отправки формы
  const onSubmit = async (data: AuthFormData) => {
    setServerError(null);
    setIsLoading(true);

    // проверка совпадения паролей при регистрации
    if (!isLogin && data.password !== data.confirmPassword) {
      setServerError("пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // вход существующего пользователя
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        // регистрация нового пользователя
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          data.email, 
          data.password
        );
        // если указано имя, обновляем профиль
        if (data.name) {
          await updateProfile(userCredential.user, { displayName: data.name });
        }
      }
      // после успешной авторизации переходим в меню
      navigate("/menu");
    } catch (err: any) {
      // обработка ошибок firebase
      switch (err.code) {
        case "auth/email-already-in-use":
          setServerError("этот email уже зарегистрирован");
          break;
        case "auth/weak-password":
          setServerError("пароль слишком простой (минимум 6 символов)");
          break;
        case "auth/invalid-credential":
          setServerError("неверная почта или пароль");
          break;
        default:
          setServerError("ошибка доступа. попробуйте снова");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // переключение между режимами
  const handleTabChange = (mode: boolean) => {
    setIsLogin(mode);
    setServerError(null);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        
        {/* переключатель режимов */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => handleTabChange(true)}
            className={`flex-1 py-2 text-center font-medium rounded-lg transition ${
              isLogin 
                ? "bg-tom-thumb-600 text-white"   // ← tom-thumb вместо copper
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            вход
          </button>
          <button
            onClick={() => handleTabChange(false)}
            className={`flex-1 py-2 text-center font-medium rounded-lg transition ${
              !isLogin 
                ? "bg-tom-thumb-600 text-white"   // ← tom-thumb вместо copper
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            регистрация
          </button>
        </div>

        {/* сообщение об ошибке */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        {/* форма */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* поле имени (только для регистрации) */}
          {!isLogin && (
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                имя
              </label>
              <input
                type="text"
                placeholder="ваше имя"
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"  // ← tom-thumb
                {...register("name", { 
                  required: !isLogin ? "укажите ваше имя" : false 
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
          )}

          {/* поле email */}
          <div>
            <label className="block text-stone-700 font-medium mb-2">
              email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"  // ← tom-thumb
              {...register("email", { 
                required: "укажите email",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "неверный формат email"
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* поле пароля */}
          <div>
            <label className="block text-stone-700 font-medium mb-2">
              пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"  // ← tom-thumb
              {...register("password", { 
                required: "укажите пароль",
                minLength: {
                  value: 6,
                  message: "пароль должен содержать минимум 6 символов"
                }
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* поле подтверждения пароля (только для регистрации) */}
          {!isLogin && (
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                подтвердите пароль
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"  // ← tom-thumb
                {...register("confirmPassword", { 
                  required: !isLogin ? "подтвердите пароль" : false 
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          {/* кнопка отправки */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-tom-thumb-600 text-white py-3 rounded-xl font-medium hover:bg-tom-thumb-700 transition disabled:opacity-50 mt-6"  // ← tom-thumb
          >
            {isLoading 
              ? "загрузка..." 
              : isLogin 
                ? "войти" 
                : "зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
}