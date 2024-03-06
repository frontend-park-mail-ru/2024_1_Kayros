import NotificationApi from '../components/Notification/Notification';

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
			NotificationApi.open({ duration: 3, title: 'Ошибка сервера', description: error.detail || error.message });
			callback();
		}

		const loader = document.querySelector('.loader');
		loader?.remove();
	}

	/**
	 *
	 * @param {string} url - адрес сервера для отправки запроса
	 * @param {void} body - объект, посылаемый в запросе
	 */
	async post(url, body) {
		let data, responseError;

		try {
			const response = await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			data = await response.text();
			if (!response.ok) responseError = data;
		} catch (error) {
			responseError = error;
		}

		return { data, error: responseError };
	}
}

export default new Ajax();
