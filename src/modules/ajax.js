import { ERROR_MESSAGES } from '../constants';

/**
 * Класс для выполнения асинхронных запросов
 */
class Ajax {
	/**
	 * GET запрос
	 * @param {string} url - адрес сервера для отправки запроса
	 * @returns {object} - полученные данные в виде json объекта
	 */
	async get(url) {
		let data, responseError;

		try {
			const response = await fetch(url);
			data = await response.json();
		} catch (error) {
			responseError = error;
		}

		if (responseError) {
			Notification.open({ duration: 3, title: ERROR_MESSAGES.SERVER_RESPONSE, description: responseError });
		}

		const loader = document.querySelector('.loader');
		loader?.remove();

		return data;
	}

	/**
	 * POST запрос
	 * @param {string} url - адрес сервера для отправки запроса
	 * @param {void} body - объект, посылаемый в запросе
	 * @returns {object} - объект, содержащий полученные данные и ошибку, если произошла
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
				responseError = result;
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
