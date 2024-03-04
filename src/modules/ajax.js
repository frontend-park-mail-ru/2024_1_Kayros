import notificationApi from '../components/Notification/Notification';
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
			console.error(error);
			callback(RESTAURANTS_MOCK);

			notificationApi.open({ duration: 2, title: 'Ошибка сервера', description: error });
		}
	}
}

export default new Ajax();
