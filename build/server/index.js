import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { FiClock, FiLogIn, FiLogOut, FiShoppingCart, FiUser } from "react-icons/fi";
import axios from "axios";
import { useForm } from "react-hook-form";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/hooks/useCart.tsx
var CartContext = createContext(null);
function CartProvider({ children }) {
	const [items, setItems] = useState([]);
	const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0), [items]);
	const totalCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
	const addItem = (menuItem) => {
		setItems((prev) => {
			if (prev.find((item) => item.menuItem.id === menuItem.id)) return prev.map((item) => item.menuItem.id === menuItem.id ? {
				...item,
				quantity: item.quantity + 1
			} : item);
			return [...prev, {
				menuItem,
				quantity: 1
			}];
		});
	};
	const updateQuantity = (id, newQty) => {
		setItems((prev) => {
			return prev.map((item) => item.menuItem.id === id ? {
				...item,
				quantity: newQty
			} : item).filter((item) => item.quantity > 0);
		});
	};
	const removeItem = (id) => {
		setItems((prev) => prev.filter((item) => item.menuItem.id !== id));
	};
	const clearCart = () => {
		setItems([]);
	};
	return /* @__PURE__ */ jsx(CartContext.Provider, {
		value: {
			items,
			totalAmount,
			totalCount,
			addItem,
			updateQuantity,
			removeItem,
			clearCart
		},
		children
	});
}
function useCart() {
	const context = useContext(CartContext);
	if (!context) throw new Error("useCart must be used within a CartProvider");
	return context;
}
//#endregion
//#region app/firebase.config.ts
var app = initializeApp({
	apiKey: "AIzaSyBZtBkLlMmc9ISS-UNVJzKQ5AKMSlecZf0",
	authDomain: "restaurant-app-3dee2.firebaseapp.com",
	projectId: "restaurant-app-3dee2",
	storageBucket: "restaurant-app-3dee2.firebasestorage.app",
	messagingSenderId: "572657782600",
	appId: "1:572657782600:web:9e106e74d63aae4bf3ad7d",
	measurementId: "G-VT5X76MP0V"
});
typeof window !== "undefined" && getAnalytics(app);
var auth = getAuth(app);
getFirestore(app);
//#endregion
//#region app/hooks/useAuth.tsx
var AuthContext = createContext(null);
function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			if (firebaseUser) setUser({
				uid: firebaseUser.uid,
				email: firebaseUser.email,
				name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Пользователь"
			});
			else setUser(null);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);
	const logout = async () => {
		await signOut(auth);
	};
	return /* @__PURE__ */ jsx(AuthContext.Provider, {
		value: {
			user,
			loading,
			logout
		},
		children: !loading && children
	});
}
function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
//#endregion
//#region app/components/Header.tsx
function Header() {
	const { totalCount } = useCart();
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef(null);
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const handleLogout = async () => {
		await logout();
		navigate("/");
		setIsMenuOpen(false);
	};
	return /* @__PURE__ */ jsx("header", {
		className: "bg-tom-thumb-700 text-white shadow-md sticky top-0 z-50",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-6xl mx-auto px-4 py-4 flex justify-between items-center",
			children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "text-2xl font-bold hover:text-tom-thumb-200 transition-colors",
					children: "MeowQ"
				}),
				/* @__PURE__ */ jsxs("nav", {
					className: "hidden md:flex gap-6",
					children: [
						/* @__PURE__ */ jsx(NavLink, {
							to: "/",
							className: ({ isActive }) => isActive ? "text-tom-thumb-200 font-semibold border-b-2 border-tom-thumb-200" : "text-white hover:text-tom-thumb-200 transition",
							children: "Главная"
						}),
						/* @__PURE__ */ jsx(NavLink, {
							to: "/menu",
							className: ({ isActive }) => isActive ? "text-tom-thumb-200 font-semibold border-b-2 border-tom-thumb-200" : "text-white hover:text-tom-thumb-200 transition",
							children: "Меню"
						}),
						/* @__PURE__ */ jsx(NavLink, {
							to: "/cart",
							className: ({ isActive }) => isActive ? "text-tom-thumb-200 font-semibold border-b-2 border-tom-thumb-200" : "text-white hover:text-tom-thumb-200 transition",
							children: "Корзина"
						}),
						/* @__PURE__ */ jsx(NavLink, {
							to: "/about",
							className: ({ isActive }) => isActive ? "text-tom-thumb-200 font-semibold border-b-2 border-tom-thumb-200" : "text-white hover:text-tom-thumb-200 transition",
							children: "О нас"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: "/cart",
						className: "relative",
						children: [/* @__PURE__ */ jsx(FiShoppingCart, { className: "w-6 h-6 text-white hover:text-tom-thumb-200 transition" }), totalCount > 0 && /* @__PURE__ */ jsx("span", {
							className: "absolute -top-2 -right-2 bg-tom-thumb-200 text-tom-thumb-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold",
							children: totalCount
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "relative",
						ref: menuRef,
						children: user ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("button", {
							onClick: () => setIsMenuOpen(!isMenuOpen),
							className: "flex items-center gap-2 bg-tom-thumb-600 hover:bg-tom-thumb-500 rounded-full px-3 py-2 transition",
							children: [/* @__PURE__ */ jsx(FiUser, { className: "w-4 h-4 text-white" }), /* @__PURE__ */ jsx("span", {
								className: "text-sm font-medium text-white",
								children: user.name
							})]
						}), isMenuOpen && /* @__PURE__ */ jsxs("div", {
							className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50",
							children: [/* @__PURE__ */ jsxs(Link, {
								to: "/orders",
								onClick: () => setIsMenuOpen(false),
								className: "flex items-center gap-3 px-4 py-2 text-stone-700 hover:bg-tom-thumb-50 transition",
								children: [/* @__PURE__ */ jsx(FiClock, { className: "w-4 h-4 text-tom-thumb-600" }), /* @__PURE__ */ jsx("span", { children: "История заказов" })]
							}), /* @__PURE__ */ jsxs("button", {
								onClick: handleLogout,
								className: "w-full flex items-center gap-3 px-4 py-2 text-stone-700 hover:bg-tom-thumb-50 transition",
								children: [/* @__PURE__ */ jsx(FiLogOut, { className: "w-4 h-4 text-tom-thumb-600" }), /* @__PURE__ */ jsx("span", { children: "Выйти" })]
							})]
						})] }) : /* @__PURE__ */ jsxs(Link, {
							to: "/auth",
							className: "flex items-center gap-2 bg-tom-thumb-200 text-tom-thumb-700 hover:bg-tom-thumb-100 px-4 py-2 rounded-full transition font-medium",
							children: [/* @__PURE__ */ jsx(FiLogIn, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Войти" })]
						})
					})]
				})
			]
		})
	});
}
//#endregion
//#region app/data/restaurant.ts
var restaurantInfo = {
	name: "MeowQ",
	address: "ул. Ленина 15",
	phone: "+7 (953) 780-78-66",
	workHours: "Пн-Сб: 08:00 - 20:00"
};
//#endregion
//#region app/components/Footer.tsx
function Footer() {
	return /* @__PURE__ */ jsx("footer", {
		className: "bg-gradient-to-r from-tom-thumb-800 to-tom-thumb-600 text-tom-thumb-100 py-8 mt-12 shadow-inner",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-6xl mx-auto px-4 text-center",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-lg font-bold text-white mb-2 drop-shadow-sm",
					children: restaurantInfo.name
				}),
				/* @__PURE__ */ jsx("p", { children: restaurantInfo.address }),
				/* @__PURE__ */ jsx("p", { children: restaurantInfo.phone }),
				/* @__PURE__ */ jsx("p", { children: restaurantInfo.workHours })
			]
		})
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({ default: () => root_default });
var root_default = UNSAFE_withComponentProps(function RootLayout() {
	return /* @__PURE__ */ jsxs("html", {
		lang: "ru",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			"  ",
			/* @__PURE__ */ jsx(Links, {}),
			"  "
		] }), /* @__PURE__ */ jsxs("body", {
			className: "bg-tom-thumb-50",
			children: [
				/* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(CartProvider, { children: /* @__PURE__ */ jsxs("div", {
					className: "min-h-screen flex flex-col",
					children: [
						/* @__PURE__ */ jsx(Header, {}),
						/* @__PURE__ */ jsxs("main", {
							className: "flex-grow max-w-6xl mx-auto px-4 py-8 w-full",
							children: [/* @__PURE__ */ jsx(Outlet, {}), "  "]
						}),
						/* @__PURE__ */ jsx(Footer, {})
					]
				}) }) }),
				/* @__PURE__ */ jsx(ScrollRestoration, {}),
				"  ",
				/* @__PURE__ */ jsx(Scripts, {}),
				"  "
			]
		})]
	});
});
//#endregion
//#region app/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({
	default: () => home_default,
	meta: () => meta$6
});
function meta$6() {
	return [{ title: "MeowQ — Уютное кафе с домашней кухней" }];
}
var home_default = UNSAFE_withComponentProps(function HomePage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "text-center space-y-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-5xl font-bold text-tom-thumb-800 mt-12",
				children: restaurantInfo.name
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xl text-tom-thumb-600 max-w-2xl mx-auto",
				children: "Вкусно как у бабушки"
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/menu",
				className: "inline-block bg-tom-thumb-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-tom-thumb-700 transition-colors",
				children: "Смотреть меню"
			})
		]
	});
});
//#endregion
//#region app/components/MenuCard.tsx
function MenuCard({ item, onAddToCart }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg hover:shadow-tom-thumb-200 transition-all duration-300",
		children: [/* @__PURE__ */ jsx("img", {
			src: item.image,
			alt: item.name,
			className: "w-full h-48 object-cover"
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between items-start mb-2",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-bold text-lg text-stone-800",
						children: item.name
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-tom-thumb-600 font-bold",
						children: [item.price, " ₽"]
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-stone-500 text-sm mb-4 line-clamp-2",
					children: item.description
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: () => onAddToCart(item),
					className: "w-full bg-tom-thumb-600 text-white py-2 rounded-xl hover:bg-tom-thumb-700 transition-colors duration-200 cursor-pointer",
					children: "В корзину"
				})
			]
		})]
	});
}
//#endregion
//#region app/services/apiClient.ts
var apiClient = axios.create({
	baseURL: "http://localhost:5000/api",
	headers: { "Content-Type": "application/json" }
});
apiClient.interceptors.response.use((response) => response, (error) => {
	console.error("API Error:", error.response?.data || error.message);
	return Promise.reject(error);
});
//#endregion
//#region app/routes/menu.tsx
var menu_exports = /* @__PURE__ */ __exportAll({
	default: () => menu_default,
	meta: () => meta$5
});
function meta$5() {
	return [{ title: "Меню | MeowQ" }];
}
var menu_default = UNSAFE_withComponentProps(function MenuPage() {
	const categories = [
		"Все",
		"Закуски",
		"Основные блюда",
		"Десерты",
		"Напитки"
	];
	const [activeCategory, setActiveCategory] = useState("Все");
	const { totalCount, addItem } = useCart();
	const [menuData, setMenuData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		apiClient.get("/menu").then((response) => {
			setMenuData(response.data);
		}).catch((err) => {
			setError(err?.response?.data?.message || err?.message || "Не удалось загрузить меню");
		}).finally(() => {
			setIsLoading(false);
		});
	}, []);
	const filteredMenu = activeCategory === "Все" ? menuData : menuData.filter((item) => item.category === activeCategory);
	const addToCart = (item) => {
		addItem(item);
	};
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		className: "text-center py-20 text-xl font-medium text-stone-500",
		children: "Загрузка меню..."
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: "text-center py-20 text-xl font-medium text-red-500",
		children: ["Ошибка: ", error]
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "flex justify-between items-center mb-8",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-4xl font-bold text-stone-800",
				children: "Меню"
			}), /* @__PURE__ */ jsxs("span", {
				className: "bg-tom-thumb-100 text-tom-thumb-600 px-4 py-2 rounded-full font-medium",
				children: [totalCount, " блюд"]
			})]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "flex gap-3 mb-8 flex-wrap",
			children: categories.map((cat) => /* @__PURE__ */ jsx("button", {
				onClick: () => setActiveCategory(cat),
				className: `px-5 py-2 rounded-full border transition-colors ${activeCategory === cat ? "bg-tom-thumb-600 text-white border-tom-thumb-600" : "bg-white text-stone-600 border-stone-200 hover:bg-tom-thumb-50 hover:border-tom-thumb-200"}`,
				children: cat
			}, cat))
		}),
		/* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
			children: filteredMenu.map((item) => /* @__PURE__ */ jsx(MenuCard, {
				item,
				onAddToCart: addToCart
			}, item.id))
		})
	] });
});
//#endregion
//#region app/routes/cart.tsx
var cart_exports = /* @__PURE__ */ __exportAll({
	default: () => cart_default,
	meta: () => meta$4
});
function meta$4() {
	return [{ title: "Корзина | MeowQ" }];
}
var cart_default = UNSAFE_withComponentProps(function CartPage() {
	const { items, totalAmount, updateQuantity } = useCart();
	if (items.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "text-center py-20",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-2xl font-bold text-tom-thumb-800 mb-4",
			children: "Корзина пуста"
		}), /* @__PURE__ */ jsx(Link, {
			to: "/menu",
			className: "text-tom-thumb-600 hover:text-tom-thumb-700 hover:underline text-lg transition-colors",
			children: "Перейти в меню"
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-2xl mx-auto",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-3xl font-bold text-tom-thumb-800 mb-8",
				children: "Корзина"
			}),
			items.map((item) => /* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow border border-tom-thumb-100",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [
						/* @__PURE__ */ jsx("img", {
							src: item.menuItem.image,
							alt: item.menuItem.name,
							className: "w-20 h-20 object-cover rounded-lg"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex-grow",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-bold text-stone-800",
								children: item.menuItem.name
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-tom-thumb-600 font-medium",
								children: [item.menuItem.price, " ₽"]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => updateQuantity(item.menuItem.id, item.quantity - 1),
									className: "w-8 h-8 bg-tom-thumb-100 text-tom-thumb-600 rounded-full hover:bg-tom-thumb-200 transition-colors flex items-center justify-center font-bold",
									children: "−"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "w-8 text-center font-medium text-stone-700",
									children: item.quantity
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => updateQuantity(item.menuItem.id, item.quantity + 1),
									className: "w-8 h-8 bg-tom-thumb-100 text-tom-thumb-600 rounded-full hover:bg-tom-thumb-200 transition-colors flex items-center justify-center font-bold",
									children: "+"
								})
							]
						})
					]
				})
			}, item.menuItem.id)),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-tom-thumb-50 rounded-xl p-6 mt-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between text-xl font-bold mb-4",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-tom-thumb-800",
						children: "Итого:"
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-tom-thumb-800",
						children: [totalAmount, " ₽"]
					})]
				}), /* @__PURE__ */ jsx(Link, {
					to: "/checkout",
					className: "block text-center w-full bg-tom-thumb-600 text-white py-3 rounded-xl text-lg hover:bg-tom-thumb-700 transition-colors duration-200",
					children: "Оформить заказ"
				})]
			})
		]
	});
});
//#endregion
//#region app/components/ui/Modal.tsx
function Modal({ isOpen, onClose, children, title }) {
	if (!isOpen) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
			onClick: onClose
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-tom-thumb-100",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-center mb-4",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-bold text-tom-thumb-800",
						children: title
					}),
					"  ",
					/* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "text-tom-thumb-300 hover:text-tom-thumb-500 text-2xl leading-none transition-colors",
						children: "✕"
					})
				]
			}), children]
		})]
	});
}
//#endregion
//#region app/components/ui/Button.tsx
function Button({ children, variant = "primary", className = "", ...props }) {
	return /* @__PURE__ */ jsx("button", {
		className: `px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 ${{
			primary: "bg-tom-thumb-600 text-white hover:bg-tom-thumb-700",
			secondary: "bg-tom-thumb-100 text-tom-thumb-700 hover:bg-tom-thumb-200"
		}[variant]} ${className}`,
		...props,
		children
	});
}
//#endregion
//#region app/routes/checkout.tsx
var checkout_exports = /* @__PURE__ */ __exportAll({
	default: () => checkout_default,
	meta: () => meta$3
});
function meta$3() {
	return [{ title: "Оформление заказа | MeowQ" }];
}
var checkout_default = UNSAFE_withComponentProps(function CheckoutPage() {
	const navigate = useNavigate();
	const { items, totalAmount, clearCart } = useCart();
	const { user } = useAuth();
	const [isProcessing, setIsProcessing] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [submittedData, setSubmittedData] = useState(null);
	const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({ defaultValues: {
		name: "",
		phone: "",
		comment: "",
		paymentMethod: "card"
	} });
	watch("paymentMethod");
	useEffect(() => {
		if (user?.name) setValue("name", user.name);
	}, [user, setValue]);
	if (items.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "text-center py-20",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-stone-600 mb-4",
			children: "Корзина пуста"
		}), /* @__PURE__ */ jsx(Link, {
			to: "/menu",
			className: "text-tom-thumb-600 hover:underline",
			children: "Перейти в меню"
		})]
	});
	const onSubmit = async (data) => {
		setIsProcessing(true);
		const orderData = {
			customer: {
				name: data.name,
				phone: data.phone,
				comment: data.comment,
				paymentMethod: data.paymentMethod
			},
			items: items.map((item) => ({
				id: item.menuItem.id,
				name: item.menuItem.name,
				price: item.menuItem.price,
				quantity: item.quantity
			})),
			total: totalAmount,
			userId: user?.uid || null
		};
		try {
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
	const handleCloseModal = () => {
		setIsModalOpen(false);
		clearCart();
		navigate("/");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-2xl mx-auto px-4 py-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-4xl font-bold text-tom-thumb-800 mb-8 text-center",
				children: "Оформление заказа"
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit(onSubmit),
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-stone-700 font-medium mb-2",
							children: "Ваше имя *"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Иван Иванов",
							className: "w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400",
							...register("name", { required: "Укажите ваше имя" })
						}),
						errors.name && /* @__PURE__ */ jsx("p", {
							className: "text-red-500 text-xs mt-1",
							children: errors.name.message
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-stone-700 font-medium mb-2",
							children: "Телефон *"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "tel",
							placeholder: "+7 (999) 123-45-67",
							className: "w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400",
							...register("phone", { required: "Укажите номер телефона" })
						}),
						errors.phone && /* @__PURE__ */ jsx("p", {
							className: "text-red-500 text-xs mt-1",
							children: errors.phone.message
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-stone-700 font-medium mb-2",
						children: "Комментарий к заказу"
					}), /* @__PURE__ */ jsx("textarea", {
						rows: 3,
						placeholder: "Пожелания, аллергии...",
						className: "w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400",
						...register("comment")
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-stone-700 font-medium mb-2",
						children: "Способ оплаты"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-6",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 cursor-pointer",
							children: [/* @__PURE__ */ jsx("input", {
								type: "radio",
								value: "card",
								className: "accent-tom-thumb-600",
								...register("paymentMethod")
							}), /* @__PURE__ */ jsx("span", { children: "Картой онлайн" })]
						}), /* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 cursor-pointer",
							children: [/* @__PURE__ */ jsx("input", {
								type: "radio",
								value: "cash",
								className: "accent-tom-thumb-600",
								...register("paymentMethod")
							}), /* @__PURE__ */ jsx("span", { children: "Наличными при получении" })]
						})]
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-tom-thumb-50 rounded-xl p-5 border border-tom-thumb-100",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "font-bold text-tom-thumb-800 mb-3",
								children: "Ваш заказ:"
							}),
							items.map((item) => /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-stone-600 py-1",
								children: [/* @__PURE__ */ jsxs("span", { children: [
									item.menuItem.name,
									" × ",
									item.quantity
								] }), /* @__PURE__ */ jsxs("span", { children: [item.menuItem.price * item.quantity, " ₽"] })]
							}, item.menuItem.id)),
							/* @__PURE__ */ jsxs("div", {
								className: "border-t border-tom-thumb-200 mt-3 pt-3 flex justify-between font-bold text-lg",
								children: [/* @__PURE__ */ jsx("span", { children: "Итого:" }), /* @__PURE__ */ jsxs("span", {
									className: "text-tom-thumb-700",
									children: [totalAmount, " ₽"]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsx(Button, {
						type: "submit",
						disabled: isProcessing,
						className: "w-full py-4 text-lg",
						children: isProcessing ? "Обработка платежа..." : "Оформить заказ"
					})
				]
			}),
			/* @__PURE__ */ jsx(Modal, {
				isOpen: isModalOpen,
				onClose: handleCloseModal,
				title: "Заказ оформлен!",
				children: /* @__PURE__ */ jsxs("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "text-stone-600 mb-4",
							children: [submittedData?.name, ", спасибо за заказ!"]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-stone-600 mb-4",
							children: ["Мы свяжемся с вами по номеру ", submittedData?.phone]
						}),
						/* @__PURE__ */ jsx(Button, {
							onClick: handleCloseModal,
							className: "mt-4",
							children: "На главную"
						})
					]
				})
			})
		]
	});
});
//#endregion
//#region app/assets/restaurant.avif
var restaurant_default = "/assets/restaurant-DlWybjMz.avif";
//#endregion
//#region app/routes/about.tsx
var about_exports = /* @__PURE__ */ __exportAll({
	default: () => about_default,
	meta: () => meta$2
});
function meta$2() {
	return [{ title: "О нас | MeowQ" }];
}
var about_default = UNSAFE_withComponentProps(function AboutPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-4xl mx-auto space-y-8",
		children: [/* @__PURE__ */ jsxs("section", {
			className: "bg-tom-thumb-50 rounded-3xl p-8 shadow-sm border border-tom-thumb-100",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-3xl font-bold text-tom-thumb-800 mb-4",
				children: "О нас"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-lg text-tom-thumb-600 leading-relaxed",
				children: "MeowQ — уютное кафе с домашней атмосферой и авторской кухней. Мы готовим с любовью, используя только свежие продукты, и всегда рады видеть вас в нашем кошачьем уголке"
			})]
		}), /* @__PURE__ */ jsxs("section", {
			className: "grid gap-6 md:grid-cols-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "rounded-3xl bg-white p-8 shadow-sm border border-tom-thumb-100 hover:shadow-md transition-shadow",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-semibold text-tom-thumb-800 mb-3",
					children: "Наши преимущества"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "space-y-3 text-tom-thumb-600",
					children: [
						/* @__PURE__ */ jsx("li", {
							className: "flex items-center gap-2",
							children: "Свежие ингредиенты и домашние рецепты"
						}),
						/* @__PURE__ */ jsx("li", {
							className: "flex items-center gap-2",
							children: "Быстрое обслуживание и уютная атмосфера"
						}),
						/* @__PURE__ */ jsx("li", {
							className: "flex items-center gap-2",
							children: "Удобное расположение в центре города"
						}),
						/* @__PURE__ */ jsx("li", {
							className: "flex items-center gap-2",
							children: "Домашняя кухня как у бабушки"
						})
					]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "rounded-3xl bg-white p-4 shadow-sm border border-tom-thumb-100 overflow-hidden",
				children: /* @__PURE__ */ jsx("img", {
					src: restaurant_default,
					alt: "Ресторан MeowQ",
					className: "w-full h-auto rounded-2xl object-cover hover:scale-105 transition-transform duration-500"
				})
			})]
		})]
	});
});
//#endregion
//#region app/routes/auth.tsx
var auth_exports = /* @__PURE__ */ __exportAll({
	default: () => auth_default,
	meta: () => meta$1
});
function meta$1() {
	return [{ title: "Авторизация | MeowQ" }];
}
var auth_default = UNSAFE_withComponentProps(function AuthPage() {
	const navigate = useNavigate();
	const [isLogin, setIsLogin] = useState(true);
	const [serverError, setServerError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { register, handleSubmit, formState: { errors }, reset } = useForm();
	const onSubmit = async (data) => {
		setServerError(null);
		setIsLoading(true);
		if (!isLogin && data.password !== data.confirmPassword) {
			setServerError("пароли не совпадают");
			setIsLoading(false);
			return;
		}
		try {
			if (isLogin) await signInWithEmailAndPassword(auth, data.email, data.password);
			else {
				const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
				if (data.name) await updateProfile(userCredential.user, { displayName: data.name });
			}
			navigate("/menu");
		} catch (err) {
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
				default: setServerError("ошибка доступа. попробуйте снова");
			}
		} finally {
			setIsLoading(false);
		}
	};
	const handleTabChange = (mode) => {
		setIsLogin(mode);
		setServerError(null);
		reset();
	};
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md w-full bg-white rounded-2xl shadow-lg p-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-4 mb-8",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => handleTabChange(true),
						className: `flex-1 py-2 text-center font-medium rounded-lg transition ${isLogin ? "bg-tom-thumb-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`,
						children: "вход"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => handleTabChange(false),
						className: `flex-1 py-2 text-center font-medium rounded-lg transition ${!isLogin ? "bg-tom-thumb-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`,
						children: "регистрация"
					})]
				}),
				serverError && /* @__PURE__ */ jsx("div", {
					className: "mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm",
					children: serverError
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit(onSubmit),
					className: "space-y-4",
					children: [
						!isLogin && /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-stone-700 font-medium mb-2",
								children: "имя"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "ваше имя",
								className: "w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400",
								...register("name", { required: !isLogin ? "укажите ваше имя" : false })
							}),
							errors.name && /* @__PURE__ */ jsx("p", {
								className: "text-red-500 text-xs mt-1",
								children: errors.name.message
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-stone-700 font-medium mb-2",
								children: "email"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "email",
								placeholder: "your@email.com",
								className: "w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400",
								...register("email", {
									required: "укажите email",
									pattern: {
										value: /^\S+@\S+$/i,
										message: "неверный формат email"
									}
								})
							}),
							errors.email && /* @__PURE__ */ jsx("p", {
								className: "text-red-500 text-xs mt-1",
								children: errors.email.message
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-stone-700 font-medium mb-2",
								children: "пароль"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "password",
								placeholder: "••••••••",
								className: "w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400",
								...register("password", {
									required: "укажите пароль",
									minLength: {
										value: 6,
										message: "пароль должен содержать минимум 6 символов"
									}
								})
							}),
							errors.password && /* @__PURE__ */ jsx("p", {
								className: "text-red-500 text-xs mt-1",
								children: errors.password.message
							})
						] }),
						!isLogin && /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-stone-700 font-medium mb-2",
								children: "подтвердите пароль"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "password",
								placeholder: "••••••••",
								className: "w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400",
								...register("confirmPassword", { required: !isLogin ? "подтвердите пароль" : false })
							}),
							errors.confirmPassword && /* @__PURE__ */ jsx("p", {
								className: "text-red-500 text-xs mt-1",
								children: errors.confirmPassword.message
							})
						] }),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: isLoading,
							className: "w-full bg-tom-thumb-600 text-white py-3 rounded-xl font-medium hover:bg-tom-thumb-700 transition disabled:opacity-50 mt-6",
							children: isLoading ? "загрузка..." : isLogin ? "войти" : "зарегистрироваться"
						})
					]
				})
			]
		})
	});
});
//#endregion
//#region app/routes/orders.tsx
var orders_exports = /* @__PURE__ */ __exportAll({
	default: () => orders_default,
	meta: () => meta
});
function meta() {
	return [{ title: "История заказов | MeowQ" }];
}
var orders_default = UNSAFE_withComponentProps(function OrdersPage() {
	const { user, loading: authLoading } = useAuth();
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		if (authLoading || !user) return;
		const fetchOrders = async () => {
			try {
				setOrders((await apiClient.get("/orders", { params: { userId: user.uid } })).data);
			} catch (error) {
				console.error("Ошибка при загрузке заказов:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchOrders();
	}, [user, authLoading]);
	if (authLoading || user && isLoading) return /* @__PURE__ */ jsx("div", {
		className: "text-center py-20 text-stone-500",
		children: "Загрузка истории заказов..."
	});
	if (!user) return /* @__PURE__ */ jsxs("div", {
		className: "text-center py-20",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-2xl font-bold text-stone-700 mb-4",
				children: "История заказов недоступна"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-stone-500 mb-6",
				children: "Чтобы просматривать свои заказы, необходимо войти в аккаунт."
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/auth",
				className: "inline-block bg-tom-thumb-600 text-white px-6 py-3 rounded-xl hover:bg-tom-thumb-700 transition-colors",
				children: "Войти в профиль"
			})
		]
	});
	if (orders.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "text-center py-20",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-2xl font-bold text-stone-700 mb-4",
			children: "Вы еще не делали заказов"
		}), /* @__PURE__ */ jsx(Link, {
			to: "/menu",
			className: "text-tom-thumb-600 hover:underline text-lg",
			children: "Перейти в меню и заказать"
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-2xl mx-auto",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "text-4xl font-bold text-tom-thumb-900 mb-8 text-center",
			children: "Мои заказы"
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-6",
			children: orders.map((order) => /* @__PURE__ */ jsxs("div", {
				className: "bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-stone-50 px-5 py-4 border-b border-stone-200 flex justify-between items-center flex-wrap gap-2",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
							className: "text-xs font-mono text-stone-400 block mb-0.5",
							children: ["ID: ", order.id]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-xs font-medium text-stone-600",
							children: order.created_at ? new Date(order.created_at).toLocaleDateString("ru-RU", {
								day: "numeric",
								month: "long",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit"
							}) : "Дата не указана"
						})] }), /* @__PURE__ */ jsx("div", {
							className: "bg-stone-100 text-tom-thumb-600 text-xs font-semibold px-3 py-1 rounded-full",
							children: order.status
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "p-5 space-y-2",
						children: order.items.map((item, idx) => /* @__PURE__ */ jsxs("div", {
							className: "flex justify-between text-stone-600",
							children: [/* @__PURE__ */ jsxs("span", { children: [
								item.name,
								" × ",
								item.quantity
							] }), /* @__PURE__ */ jsxs("span", { children: [item.price * item.quantity, " ₽"] })]
						}, item.id || idx))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-stone-50/50 px-5 py-4 border-t border-stone-100 flex justify-between items-center font-bold text-lg",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-stone-700 text-base",
							children: "Итого:"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-tom-thumb-600",
							children: [order.total, " ₽"]
						})]
					})
				]
			}, order.id))
		})]
	});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-BMS3vPhT.js",
		"imports": ["/assets/jsx-runtime-S6hHLFA9.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/root-CC4f1jAN.js",
			"imports": [
				"/assets/jsx-runtime-S6hHLFA9.js",
				"/assets/restaurant-WVrP9AXl.js",
				"/assets/useAuth-z6JDzDoL.js",
				"/assets/useCart-DTy1FWHG.js",
				"/assets/firebase.config-DR_isz1u.js"
			],
			"css": ["/assets/root-CG2cXkn8.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-fpEF9cTI.js",
			"imports": ["/assets/jsx-runtime-S6hHLFA9.js", "/assets/restaurant-WVrP9AXl.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/menu": {
			"id": "routes/menu",
			"parentId": "root",
			"path": "menu",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/menu-DwJHUWXD.js",
			"imports": [
				"/assets/jsx-runtime-S6hHLFA9.js",
				"/assets/apiClient-BQV9qE9X.js",
				"/assets/useCart-DTy1FWHG.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/cart": {
			"id": "routes/cart",
			"parentId": "root",
			"path": "cart",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/cart-ChWmWeg7.js",
			"imports": ["/assets/jsx-runtime-S6hHLFA9.js", "/assets/useCart-DTy1FWHG.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/checkout": {
			"id": "routes/checkout",
			"parentId": "root",
			"path": "checkout",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/checkout-BYfKCkKA.js",
			"imports": [
				"/assets/jsx-runtime-S6hHLFA9.js",
				"/assets/apiClient-BQV9qE9X.js",
				"/assets/useAuth-z6JDzDoL.js",
				"/assets/useCart-DTy1FWHG.js",
				"/assets/index.esm-DZrXM00L.js",
				"/assets/firebase.config-DR_isz1u.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/about": {
			"id": "routes/about",
			"parentId": "root",
			"path": "about",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/about-DP_3UGKj.js",
			"imports": ["/assets/jsx-runtime-S6hHLFA9.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/auth": {
			"id": "routes/auth",
			"parentId": "root",
			"path": "auth",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/auth-BolVAqG9.js",
			"imports": [
				"/assets/jsx-runtime-S6hHLFA9.js",
				"/assets/firebase.config-DR_isz1u.js",
				"/assets/index.esm-DZrXM00L.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/orders": {
			"id": "routes/orders",
			"parentId": "root",
			"path": "orders",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/orders-BSqO_gLZ.js",
			"imports": [
				"/assets/jsx-runtime-S6hHLFA9.js",
				"/assets/apiClient-BQV9qE9X.js",
				"/assets/useAuth-z6JDzDoL.js",
				"/assets/firebase.config-DR_isz1u.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-684b32e6.js",
	"version": "684b32e6",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"v8_passThroughRequests": false,
	"unstable_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	},
	"routes/menu": {
		id: "routes/menu",
		parentId: "root",
		path: "menu",
		index: void 0,
		caseSensitive: void 0,
		module: menu_exports
	},
	"routes/cart": {
		id: "routes/cart",
		parentId: "root",
		path: "cart",
		index: void 0,
		caseSensitive: void 0,
		module: cart_exports
	},
	"routes/checkout": {
		id: "routes/checkout",
		parentId: "root",
		path: "checkout",
		index: void 0,
		caseSensitive: void 0,
		module: checkout_exports
	},
	"routes/about": {
		id: "routes/about",
		parentId: "root",
		path: "about",
		index: void 0,
		caseSensitive: void 0,
		module: about_exports
	},
	"routes/auth": {
		id: "routes/auth",
		parentId: "root",
		path: "auth",
		index: void 0,
		caseSensitive: void 0,
		module: auth_exports
	},
	"routes/orders": {
		id: "routes/orders",
		parentId: "root",
		path: "orders",
		index: void 0,
		caseSensitive: void 0,
		module: orders_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
