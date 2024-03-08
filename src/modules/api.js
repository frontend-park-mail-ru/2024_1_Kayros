import Notification from '../components/Notification/Notification';
import { SERVER_RESPONSE_ERROR } from '../constants';
import ajax from './ajax';

/**
 * Класс, содержащий запросы
 */
class Api {
	/**
	 * Конструктор класса
	 */
	constructor() {
		this.url = '/api';
	}

	/**
	 * Метод для получения списка ресторанов
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getRestaurants(callback) {
		const data = await ajax.get(`${this.url}/restaurants`);

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
		const { data, error } = await ajax.post(`${this.url}/signin`, body);

		if (data && !error) {
			Notification.open({ duration: 3, title: 'Успешный вход', description: 'С возвращением!', type: 'success' });
			callback(data);
			return;
		}

		Notification.open({
			duration: 3,
			title: 'Не удалось войти',
			description: error || SERVER_RESPONSE_ERROR,
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
		const { data, error } = await ajax.post(`${this.url}/signup`, body);

		if (data && !error) {
			Notification.open({ duration: 3, title: 'Аккаунт создан', description: 'Добро пожаловать!', type: 'success' });
			callback(data);
			return;
		}

		Notification.open({
			duration: 3,
			title: 'Не удалось создать аккаунт',
			description: error || SERVER_RESPONSE_ERROR,
			type: 'error',
		});
	}

	/**
	 * Метод для выхода пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async signout(callback) {
		const { error } = await ajax.post(`${this.url}/signout`);

		if (error) {
			Notification.open({
				duration: 3,
				title: 'Не удалось выйти из аккаунта',
				description: error || SERVER_RESPONSE_ERROR,
				type: 'error',
			});

			return;
		}

		Notification.open({ duration: 3, title: 'Успешный выход', description: 'До встречи!', type: 'success' });
		callback();
	}
}

export default new Api();
