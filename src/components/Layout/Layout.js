import template from './Layout.hbs';
import './Layout.scss';

/**
 * Макет
 */
class Layout {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template());
	}
}

export default Layout;
