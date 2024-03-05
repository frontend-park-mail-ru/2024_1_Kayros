import NotificationApi from '../components/Notification/Notification';
import RESTAURANTS_MOCK from '../mocks/restaurants';

/**
 * Класс для выполнения асинхронных запросов
 */
class Ajax {
	/**
	 *
	 * @param {string} url - адрес сервера для отправки запроса
	 * @param {void} callback - функция-коллбэк для обработки результатов запроса
	 */
	async get(url, callback) {
		try {
			const response = await fetch(url);
			const result = await response.json();
			callback(result);
		} catch (error) {
			NotificationApi.open({ duration: 3, title: 'Ошибка сервера', description: error.message });
			callback(RESTAURANTS_MOCK);
		}
	}
}

export default new Ajax();
