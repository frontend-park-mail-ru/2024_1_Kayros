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
		let data, responseError;

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(body),
			});

			const result = await response.text();

			if (response.ok) {
				data = result;
			} else {
				responseError = await response.text();
			}
		} catch (error) {
			responseError = error;
		}

		const loaderButton = document.querySelector('#btn-loader');
		loaderButton?.classList.remove('loading');

		return { data, error: responseError };
	}
}

export default new Ajax();
