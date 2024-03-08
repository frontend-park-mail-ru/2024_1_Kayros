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
				body: JSON.stringify(body),
			});

			const res = await response.text();

			if (response.ok) {
				result = res;
			} else {
				responseError = res;
			}
		} catch (error) {
			responseError = error;
		}

		const loaderButton = document.querySelector('#btn-loader');
		loaderButton?.classList.remove('loading');

		return { data: result, error: responseError };
	}
}

export default new Ajax();
