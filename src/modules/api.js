import Notification from '../components/Notification/Notification';
import restaurants from '../mocks/restaurants';
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
	async getRestaurants(callback) {
		const { data, error } = await ajax.get(`${this.url}/restaurants`);

		if (error) {
			Notification.open({ duration: 3, title: 'Ошибка сервера', description: error });

			// TODO: убрать коллбэк после интерагции
			callback(restaurants);
			return;
		}

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

		if (error) {
			Notification.open({
				duration: 3,
				title: 'Не удалось войти',
				description: error || 'Неверный пароль или почта!',
				type: 'error',
			});

			// TODO: убрать коллбэк после интерагции (таймаут для проверки лоадера)
			setTimeout(() => callback(userInfo), 2000);
			return;
		}

		Notification.open({ duration: 3, title: 'Успешный вход', description: 'С возвращением!', type: 'success' });
		callback(data);
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

		if (error) {
			Notification.open({
				duration: 3,
				title: 'Не удалось создать аккаунт',
				description: error || 'Ошибка сервера',
				type: 'error',
			});

			// TODO: убрать коллбэк после интерагции
			callback(userInfo);
		} else {
			Notification.open({ duration: 3, title: 'Аккаунт создан', description: 'Добро пожаловать!', type: 'success' });
			callback(data);
		}
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
				description: error || 'Ошибка сервера',
				type: 'error',
			});

			// TODO: убрать коллбэк после интерагции
			callback();
		} else {
			Notification.open({ duration: 3, title: 'Успешный выход', description: 'До встречи!', type: 'success' });
			callback();
		}
	}
}

export default new Api();
