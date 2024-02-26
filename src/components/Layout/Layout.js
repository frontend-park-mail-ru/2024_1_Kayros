import Content from '../Content';
import Header from '../Header';
import template from './Layout.hbs';
import './Layout.scss';

/**
 * Макет
 */
class Layout {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.parent = parent;
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template());

		const layout = document.getElementById('layout');

		const header = new Header(layout);
		header.render();

		const content = new Content(layout);
		content.render();
	}
}

export default Layout;
