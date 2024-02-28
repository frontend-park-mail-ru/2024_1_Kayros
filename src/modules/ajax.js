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
		const request = new Request(url, {
			method: 'GET',
		});

		await fetch(request)
			.then((res) => res.json())
			.then((data) => callback(JSON.parse(data)))
			.catch(() => callback(RESTAURANTS_MOCK));
	}
}

export default new Ajax();
