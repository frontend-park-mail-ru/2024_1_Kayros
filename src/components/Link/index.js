import template from './Link.hbs';

/**
 * Компонент ссылка
 */
class Link {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.parent = parent;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent?.insertAdjacentHTML('afterbegin', template());
	}
}

export default Link;
