import template from './Restaurant.hbs';
import './Restaurant.scss';

/**
 * Страница ресторана
 */
class Restaurant {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {number} params.id - идентификатор ресторана
	 */
	constructor(parent, { id }) {
		this.#parent = parent;
		this.id = id;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		return template({
			id: this.id,
		});
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML());
	}
}

export default Restaurant;
