import template from './Content.hbs';
import './Content.scss';

/**
 * Контент
 */
class Content {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent, { withoutPadding = false } = {}) {
		this.parent = parent;
		this.withoutPadding = withoutPadding;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template());
		const content = document.getElementById('content');

		if (this.withoutPadding) {
			content.style.padding = '0';
		}
	}
}

export default Content;
