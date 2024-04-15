import template from './Banner.hbs';
import './Banner.scss';

/**
 * Баннер на странице ресторана
 */
class Banner {
	#parent;
	#data;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} data - информация о ресторане
	 */
	constructor(parent, data) {
		this.#parent = parent;
		this.#data = data;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template(this.#data));
	}
}

export default Banner;
