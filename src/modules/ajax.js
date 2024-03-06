/**
 * Класс для выполнения асинхронных запросов
 */
class Ajax {
	/**
	 *
	 * @param {string} url - адрес сервера для отправки запроса
	 * @param {void} callback - функция-коллбэк для обработки результатов запроса
	 */
	async get(url) {
		let data, responseError;

		try {
			const response = await fetch(url);
			data = await response.json();
		} catch (error) {
			responseError = error;
		}

		const loader = document.querySelector('.loader');
		loader?.remove();

		return { data, error: responseError };
	}

	/**
	 *
	 * @param {string} url - адрес сервера для отправки запроса
	 * @param {void} body - объект, посылаемый в запросе
	 */
	async post(url, body) {
		let result, responseError;

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

			result = await response.text();
			if (!response.ok) responseError = result;
		} catch (error) {
			responseError = error;
		}

		return { data: result, error: responseError };
	}
}

export default new Ajax();
