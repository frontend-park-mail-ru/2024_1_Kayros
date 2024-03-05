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

		// const layout = document.getElementById('layout');
		//
		// let content;
		//
		// if ([urls.signIn, urls.signUp].includes(window.location.pathname)) {
		// 	content = new Content(layout, {withoutPadding: true});
		// } else {
		// 	const header = new Header(layout);
		// 	header.render();
		//
		// 	content = new Content(layout);
		// }
		//
		// content.render();
	}
}

export default Layout;
