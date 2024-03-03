/**
 * @todo Переделать на выложенный сервак
 */

/**
 * Класс, содержащий адреса для выполнения запросов
 */
class Urls {
	/**
	 * Конструктор класса
	 */
	constructor() {
		// TODO: поменять на домен бэка, когда появится, и добавить прокси для девелоп разработки
		this.url = 'https://localhost:8000/api';
	}

	/**
	 * Адрес для получения списка ресторанов
	 * @returns {string}
	 */
	getRestaurants() {
		return `${this.url}/restaurants`;
	}
}

export default new Urls();
