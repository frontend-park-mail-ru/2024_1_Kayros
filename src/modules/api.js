import Notification from '../components/Notification/Notification';
import userInfo from '../mocks/userInfo';
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
		this.url = 'http://localhost:8000/';

		if (process.env.NODE_ENV === 'development') this.url = '/api';
	}

	/**
	 * Метод для получения списка ресторанов
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	getRestaurants(callback) {
		return ajax.get(`${this.url}/restaurants`, callback);
	}

	/**
	 * Метод для авторизации пользователя
	 * @param {Object} body - объект, посылаемый в запросе
	 * @param {string} body.email - почта пользователя
	 * @param {string} body.password - пароль пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async login(body, callback) {
		const { data, error } = await ajax.post(`${this.url}/user/login`, body, callback);

		if (error) {
			Notification.open({
				duration: 3,
				title: 'Не удалось войти',
				description: error.detail || error.message || 'Неверный пароль или почта!',
				type: 'error',
			});

			// TODO: убрать коллбэк после интерагции
			callback(userInfo);
		} else {
			Notification.open({ duration: 3, title: 'Успешный вход', description: 'С возвращением!', type: 'success' });
			callback(data);
		}
	}

	/**
	 * Метод для регистрации пользователя
	 * @param {Object} body - объект, посылаемый в запросе
	 * @param {string} body.email - почта пользователя
	 * @param {string} body.password - пароль пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async signup(body, callback) {
		const { data, error } = await ajax.post(`${this.url}/user`, body, callback);

		if (error) {
			Notification.open({
				duration: 3,
				title: 'Не удалось создать аккаунт',
				description: error.detail || error.message || 'Ошибка сервера',
				type: 'error',
			});

			// TODO: убрать коллбэк после интерагции
			callback(userInfo);
		} else {
			Notification.open({ duration: 3, title: 'Аккаунт создан', description: 'Добро пожаловать!', type: 'success' });
			callback(data);
		}
	}
}

export default new Api();
