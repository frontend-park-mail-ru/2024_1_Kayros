import Notification from '../components/Notification/Notification';
import { ErrorMessages, SuccessMessages } from '../constants';
import ajax from './ajax';

/**
 * Класс, содержащий запросы
 */
class Api {
	/**
	 * Конструктор класса
	 */
	constructor() {
		// TODO: поменять на домен бэка, когда появится, и добавить прокси для девелоп разработки
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
	 * @param {Object} body - объект, посылаемый в запросе
	 * @param {string} body.email - почта пользователя
	 * @param {string} body.password - пароль пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async login(body, callback) {
		const { data, error } = await ajax.post(`${this.url}/signin`, body);

		if (data && !error) {
			Notification.open({
				duration: 3,
				title: SuccessMessages.login.title,
				description: SuccessMessages.login.description,
				type: 'success',
			});

			callback(data);
			return;
		}

		Notification.open({
			duration: 3,
			title: ErrorMessages.LOGIN,
			description: error || ErrorMessages.SERVER_RESPONSE,
			type: 'error',
		});
	}

	/**
	 * Метод для регистрации пользователя
	 * @param {Object} body - объект, посылаемый в запросе
	 * @param {string} body.email - почта пользователя
	 * @param {string} body.password - пароль пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async signup(body, callback) {
		const { data, error } = await ajax.post(`${this.url}/signup`, body);

		if (data && !error) {
			Notification.open({
				duration: 3,
				title: SuccessMessages.signup.title,
				description: SuccessMessages.signup.description,
				type: 'success',
			});

			callback(data);
			return;
		}

		Notification.open({
			duration: 3,
			title: ErrorMessages.SIGNUP,
			description: error || ErrorMessages.SERVER_RESPONSE,
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
				title: ErrorMessages.SIGNOUT,
				description: error || ErrorMessages.SERVER_RESPONSE,
				type: 'error',
			});

			return;
		}

		Notification.open({
			duration: 3,
			title: SuccessMessages.signout.title,
			description: SuccessMessages.signout.description,
			type: 'success',
		});

		callback();
	}
}

export default new Api();
