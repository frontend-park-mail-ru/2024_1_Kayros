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
		this.url = 'http://localhost:8000/api';

		if (process.env.NODE_ENV === 'development') this.url = '/api';
	}

	/**
	 * Метод для получения списка ресторанов
	 * @returns {string}
	 */
	getRestaurants(callback) {
		return ajax.get(`${this.url}/restaurants`, callback);
	}
}

export default new Api();
