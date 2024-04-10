import Notification from '../components/Notification/Notification';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, YANDEX_API_GEOCODER, YANDEX_API_SUJESTS } from '../constants';
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
	 * Метод для получения списка ресторанов
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getRestaurants(callback) {
		const data = await ajax.get(`${this.#url}/restaurants`);

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
	 * Метод для изменения информации пользователя
	 * @param {object} body - объект, посылаемый в запросе
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async updateUserData(body, callback) {
		const { data, error } = await ajax.put(`${this.#url}/user`, body, { formData: true });

		if (data && !error && !data.detail) {
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
			duration: 3,
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
	async getSujests(text, callback) {
		const { results } = await ajax.get(
			`https://suggest-maps.yandex.ru/v1/suggest?text=${text}&bbox=37.39,55.57~37.84,55.9&strict_bounds=1&apikey=${YANDEX_API_SUJESTS}&lang=ru`,
		);

		callback(results);
	}

	/**
	 * Метод для получения координат объекта
	 * @param {object} address - адрес, по которому находятся координаты
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async geoCoder(address, callback) {
		const { response } = await ajax.get(
			`https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_API_GEOCODER}&geocode=${address}&format=json&&bbox=37.39,55.57~37.84,55.92&rspn=1`,
		);

		const [lon, lat] = response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');

		callback([Number(lon), Number(lat)]);
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

		if (data && !error && !data.detail) {
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
	 *  Метод для обновления адреса
	 * @param {object} body - объект
	 * @param {object} body.address - основной
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 * @returns {Promise<object>} - результат запроса
	 */
	async updateAddressSujests(body, callback = () => {}) {
		const { data, error } = await ajax.put(`${this.#url}/user/address`, body);

		if (data && !error && !data.detail) {
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
	 * @param {number} foodId - id блюда
	 * @returns {Promise<boolean>} - результат запроса
	 */
	async addToCart(foodId) {
		const { data, error } = await ajax.post(`${this.#url}/order/food/add/${foodId}`);

		if (data) {
			return data.sum;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.CART_UPDATE,
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});

		return 0;
	}

	/**
	 * Метод для удаления блюда из корзины
	 * @param {number} foodId - id блюда
	 * @returns {Promise<boolean>} - результат запроса
	 */
	async removeFromCart(foodId) {
		const { data, error } = await ajax.delete(`${this.#url}/order/food/delete/${foodId}`);

		if (data) {
			return data.sum;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.CART_UPDATE,
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});

		return 0;
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

		return 0;
	}

	/**
	 * Метод для оформления заказа
	 * @returns {boolean} - результат запроса
	 */
	async checkout() {
		const { data, error } = await ajax.put(`${this.#url}/order/pay`);

		if (data && !error) {
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
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});

		return false;
	}
}

export default new Api();
