import { Notification } from 'resto-ui';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, YANDEX_API_GEOCODER, YANDEX_API_SAGESTS } from '../constants';
import ajax from './ajax';

/**
 * Класс, содержащий запросы
 */
class Api {
	#url;

	/**
	 * Конструктор класса
	 */
	constructor() {
		this.#url = '/api/v1';
	}

	/**
	 * Метод для получения ссылки на оплату
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getCheckoutUrl(callback) {
		const data = await ajax.get(`${this.#url}/order/pay/url`);

		callback(data);
	}

	/**
	 * Метод для получения списка ресторанов
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 * @param {string} categoryId - id Категории ресторана
	 */
	async getRestaurants(callback, categoryId = null) {
		let url = `${this.#url}/restaurants`;

		if (categoryId) {
			url += `?filter=${categoryId}`;
		}

		const data = await ajax.get(url);
		callback(data);
	}

	/**
	 * Метод для получения списка ресторанов
	 * @param {Function} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getSearchRestaurants(callback) {
		const data = await ajax.get(`${this.#url}/search`);

		callback(data);
	}

	/**
	 * Метод для получения списка ресторанов
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getOrdersData(callback) {
		const data = await ajax.get(`${this.#url}/orders/current`, { showNotifyError: false });

		callback(data);
	}

	/**
	 * Метод для получения информации о заказе
	 * @param {number} id - id заказа
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getOrderInfo(id, callback) {
		const data = await ajax.get(`${this.#url}/order/${id}`);

		callback(data);
	}

	/**
	 * Метод для получения информации о пользователе
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getUserInfo(callback) {
		const data = await ajax.get(`${this.#url}/user`, { showNotifyError: false });

		callback(data);
	}

	/**
	 * Метод для получения информации о пользователе
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getUserAddress(callback) {
		const data = await ajax.get(`${this.#url}/user/address`, { showNotifyError: false });

		callback(data);
	}

	/**
	 * Метод для изменения информации пользователя
	 * @param {object} body - объект, посылаемый в запросе
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async updateUserData(body, callback) {
		const { data, error } = await ajax.put(`${this.#url}/user`, body, { formData: true });

		if (data && !error && !data?.detail) {
			Notification.open({
				duration: 3,
				title: SUCCESS_MESSAGES.profileSave.title,
				description: SUCCESS_MESSAGES.profileSave.description,
				type: 'success',
			});

			callback(data);
			return;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.PROFILE_SAVE,
			description: error || data?.detail,
			type: 'error',
		});
	}

	/**
	 * Метод для изменения пароля пользователя
	 * @param {object} body - объект, посылаемый в запросе
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async changeUserPassword(body, callback) {
		const { data, error } = await ajax.put(`${this.#url}/user/new_password`, body, { formData: false });

		if (data && !error) {
			Notification.open({
				duration: 3,
				title: SUCCESS_MESSAGES.passwordChange.title,
				description: SUCCESS_MESSAGES.passwordChange.description,
				type: 'success',
			});

			callback(data);
			return;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.PASSWORD_CHANGE,
			description: error || data.detail,
			type: 'error',
		});
	}

	/**
	 * Метод для получения информации о корзине
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getCartInfo(callback) {
		let data = await ajax.get(`${this.#url}/order`, { showNotifyError: false });

		callback(data);
	}

	/**
	 * Метод для получения информации о ресторане
	 * @param {number} id - id ресторана
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getRestaurantInfo(id, callback) {
		let data = await ajax.get(`${this.#url}/restaurants/${id}`);

		callback(data);
	}

	/**
	 * Метод для авторизации пользователя
	 * @param {object} body - объект, посылаемый в запросе
	 * @param {string} body.email - почта пользователя
	 * @param {string} body.password - пароль пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async login(body, callback) {
		const { data, error } = await ajax.post(`${this.#url}/signin`, body);

		if (data && !error) {
			Notification.open({
				duration: 3,
				title: SUCCESS_MESSAGES.login.title,
				description: SUCCESS_MESSAGES.login.description,
				type: 'success',
			});

			callback(data);
			return;
		}

		Notification.open({
			duration: 0,
			title: ERROR_MESSAGES.LOGIN,
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});
	}

	/**
	 * Метод для регистрации пользователя
	 * @param {object} body - объект, посылаемый в запросе
	 * @param {string} body.email - почта пользователя
	 * @param {string} body.password - пароль пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async signup(body, callback) {
		const { data, error } = await ajax.post(`${this.#url}/signup`, body);

		if (data && !error) {
			Notification.open({
				duration: 3,
				title: SUCCESS_MESSAGES.signup.title,
				description: SUCCESS_MESSAGES.signup.description,
				type: 'success',
			});

			callback(data);
			return;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.SIGNUP,
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});
	}

	/**
	 * Метод для выхода пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async signout(callback) {
		const { data, error } = await ajax.post(`${this.#url}/signout`);

		if (error || !data) {
			Notification.open({
				duration: 3,
				title: ERROR_MESSAGES.SIGNOUT,
				description: error || ERROR_MESSAGES.SERVER_RESPONSE,
				type: 'error',
			});

			return;
		}

		Notification.open({
			duration: 3,
			title: SUCCESS_MESSAGES.signout.title,
			description: SUCCESS_MESSAGES.signout.description,
			type: 'success',
		});

		callback();
	}

	/**
	 * Метод для получения саджестов
	 * @param {object} text - слово, по которому создаются саджесты
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getSagests(text, callback) {
		const { results } = await ajax.get(
			`https://suggest-maps.yandex.ru/v1/suggest?text=${text}&bbox=37.39,55.57~37.84,55.9&strict_bounds=1&apikey=${YANDEX_API_SAGESTS}&lang=ru`,
			{ xsrf: false },
		);

		callback(results);
	}

	/**
	 * Метод для получения координат объекта
	 * @param {object} address - адрес, по которому находятся координаты
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 * @param {object} params - параметры
	 * @param {boolean} params.getCoords - получение координат, иначе - получение адреса
	 */
	async geoCoder(address, callback, { getCoords = true } = {}) {
		const { response } = await ajax.get(
			`https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_API_GEOCODER}&geocode=${address}&format=json&bbox=37.39,55.57~37.84,55.92&rspn=${
				getCoords ? 1 : 0
			}`,
		);

		if (getCoords) {
			const coords = response.GeoObjectCollection.featureMember[0]?.GeoObject.Point.pos.split(' ');

			if (coords) {
				callback([Number(coords[0]), Number(coords[1])]);
			}
		} else {
			const address = response.GeoObjectCollection.featureMember[0]?.GeoObject.name;
			callback(address);
		}
	}

	/**
	 * Метод для обновления адреса
	 * @param {object} body - объект
	 * @param {object} body.address - основной
	 * @param {object} body.extra_address - доп
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 * @returns {Promise<object>} - результат запроса
	 */
	async updateAddress(body, callback = () => {}) {
		const { data, error } = await ajax.put(`${this.#url}/order/update_address`, body);

		if (!error) {
			callback(data);
			return true;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.ADDRESS,
			description: error || data?.detail,
			type: 'error',
		});

		return false;
	}

	/**
	 *  Метод для обновления адреса
	 * @param {object} body - объект
	 * @param {object} body.address - основной
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 * @returns {Promise<object>} - результат запроса
	 */
	async updateAddressSagests(body, callback = () => {}) {
		const { data, error } = await ajax.put(`${this.#url}/user/address`, body);

		if (data && !error) {
			Notification.open({
				duration: 3,
				title: SUCCESS_MESSAGES.address.title,
				description: SUCCESS_MESSAGES.address.description,
				type: 'success',
			});

			callback(data);
			return data;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.ADDRESS,
			description: error || data.detail,
			type: 'error',
		});

		return data;
	}

	/**
	 * Метод для добавления блюда в корзину
	 * @param {object} body - объект
	 * @param {object} body.food_id - id блюдп
	 * @param {object} body.count - количество
	 * @returns {Promise<boolean>} - результат запроса
	 */
	async addToCart(body) {
		const { data, error } = await ajax.post(`${this.#url}/order/food/add`, body);

		if (data) {
			return data.sum;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.CART_UPDATE,
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});

		return false;
	}

	/**
	 * Метод для добавления отзывы
	 * @param {number} id - id
	 * @param {object} body - объект
	 * @returns {Promise<boolean>} - результат запроса
	 */
	async sendFeedback(id, body) {
		const { data, error } = await ajax.post(`${this.#url}/restaurants/${id}/comment`, body);

		if (data && !error) {
			Notification.open({
				duration: 3,
				title: 'Отзыв оставлен',
				description: 'Спасибо за уделенное время!',
				type: 'success',
			});

			return data;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.CART_UPDATE,
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});
	}

	/**
	 * Метод для удаления блюда из корзины
	 * @param {number} foodId - id блюда
	 * @returns {Promise<boolean>} - результат запроса
	 */
	async removeFromCart(foodId) {
		const { data, error } = await ajax.delete(`${this.#url}/order/food/delete/${foodId}`);

		if (data && !error) {
			return data.sum || 0;
		}

		return false;
	}

	/**
	 * Метод для обновления количества блюд в корзине
	 * @param {object} body - объект
	 * @param {object} body.food_id - id блюдп
	 * @param {object} body.count - количество
	 * @returns {Promise<boolean>} - результат запроса
	 */
	async updateCartCount(body) {
		const { data, error } = await ajax.put(`${this.#url}/order/food/update_count`, body);

		if (data) {
			return data.sum;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.CART_UPDATE,
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});

		return false;
	}

	/**
	 * Метод для очистки корзины
	 * @returns {Promise<boolean>} - результат запроса
	 */
	async clearCart() {
		const { data, error } = await ajax.delete(`${this.#url}/order/clean`);

		if (data) {
			return true;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.CART_UPDATE,
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});

		return false;
	}

	/**
	 * Метод для оформления заказа
	 * @returns {Promise<boolean>} - результат запроса
	 */
	async checkout() {
		const { data, error } = await ajax.put(`${this.#url}/order/pay`);

		if (data && !error && !data.detail) {
			Notification.open({
				duration: 6,
				title: SUCCESS_MESSAGES.checkout.title,
				description: SUCCESS_MESSAGES.checkout.description,
				type: 'success',
			});

			return true;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.CHECKOUT,
			description: error || data.detail || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});

		return false;
	}

	/**
	 * Метод для получения отзывов
	 * @param {number} id - id ресторана
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getReviewsInfo(id, callback) {
		let data = await ajax.get(`${this.#url}/restaurants/${id}/comments`);

		callback(data);
	}

	/**
	 * Загружает данные о категориях и передаёт их в callback-функцию.
	 * @param {Function} callback - функция-коллбэк, вызываемая после выполенения запроса.
	 */
	async getCategories(callback) {
		const data = await ajax.get(`${this.#url}/category`);
		callback(data);
	}

	/**
	 * Функция для получения вопросов
	 * @param {void} callback - коллбэк
	 * @param {string} url - адрес страницы, с которой идет запрос
	 */
	async getCSATQuestions(callback, url) {
		const data = await ajax.get(`${this.#url}/quiz/questions?url=${url}`);

		callback(data);
	}

	/**
	 * Функция для отправки формы
	 * @param {void} callback - коллбэк
	 * @param {object} body - body
	 */
	async sendCSATQuestions(callback, body) {
		const { data, error } = await ajax.post(`${this.#url}/quiz/question/rating`, body);

		if (!error) {
			Notification.open({
				duration: 3,
				title: SUCCESS_MESSAGES.csat.title,
				description: SUCCESS_MESSAGES.csat.description,
				type: 'success',
			});

			callback(data);
			return;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.CSAT,
			description: error || data.detail || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});
	}

	/**
	 * Метод для получения статистики ответов.
	 * @param {Function} callback -Результат запроса
	 */
	async getCSATAnswers(callback) {
		const data = await ajax.get(`${this.#url}/quiz/stats`);

		callback(data);
	}
}

export default new Api();
