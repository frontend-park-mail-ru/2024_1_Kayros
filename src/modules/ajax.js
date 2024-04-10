import Notification from '../components/Notification/Notification';
import { ERROR_MESSAGES } from '../constants';

/**
 * Класс для выполнения асинхронных запросов
 */
class Ajax {
	/**
	 * GET запрос
	 * @param {string} url - адрес сервера для отправки запроса
	 * @param {object} params - параметры
	 * @param {boolean} params.showNotifyError - показывать ошибку
	 * @returns {object} - полученные данные в виде json объекта
	 */
	async get(url, { showNotifyError = true } = {}) {
		let data, responseError, result;

		try {
			const response = await fetch(url);

			result = await response.text();

			if (response.ok) {
				data = JSON.parse(result);
			} else {
				responseError = JSON.parse(result).detail;
			}
		} catch {
			responseError = result;
		}

		if (responseError && showNotifyError) {
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
		let data, responseError, result;

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(body),
			});

			result = await response.text();

			if (response.ok) {
				data = JSON.parse(result);
			} else {
				responseError = JSON.parse(result).detail;
			}
		} catch {
			responseError = result;
		}

		const loaderButton = document.querySelector('#btn-loader');
		loaderButton?.classList.remove('loading');

		return { data, error: responseError };
	}

	/**
	 * PUT запрос
	 * @param {string} url - адрес сервера для отправки запроса
	 * @param {void} body - объект, посылаемый в запросе
	 * @returns {object} - объект, содержащий полученные данные и ошибку, если произошла
	 */
	async put(url, body) {
		let data, responseError, result;

		try {
			const response = await fetch(url, {
				method: 'PUT',
				body,
			});

			result = await response.text();

			if (response.ok) {
				data = JSON.parse(result);
			} else {
				responseError = JSON.parse(result).detail;
			}
		} catch {
			responseError = result;
		}

		const loaderButton = document.querySelector('#btn-loader');
		loaderButton?.classList.remove('loading');

		return { data, error: responseError };
	}

	/**
	 * DELETE запрос
	 * @param {string} url - адрес сервера для отправки запроса
	 * @param {void} body - объект, посылаемый в запросе
	 * @returns {object} - объект, содержащий полученные данные и ошибку, если произошла
	 */
	async delete(url, body) {
		let data, responseError, result;

		try {
			const response = await fetch(url, {
				method: 'DELETE',
				body: JSON.stringify(body),
			});

			result = await response.text();

			if (response.ok) {
				data = JSON.parse(result);
			} else {
				responseError = JSON.parse(result).detail;
			}
		} catch {
			responseError = result;
		}

		const loaderButton = document.querySelector('#btn-loader');
		loaderButton?.classList.remove('loading');

		return { data, error: responseError };
	}
}

export default new Ajax();
