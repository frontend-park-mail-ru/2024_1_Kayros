import template from './SignIn.hbs';
import './SignIn.scss';

/**
 * Страница входа.
 */
class SignIn {
	/**
	 * Создает экземпляр страницы.
	 * @param {Element} parent Элемент DOM, в который будет рендериться страница.
	 */
	constructor(parent) {
		/**
		 * Родительский элемент для страницы.
		 * @type {Element}
		 */
		this.parent = parent;
	}
	/**
	 * Рендер страницы.
	 */
	render() {
		/**
		 * HTML-контент, полученный из шаблона Handlebars.
		 * @type {string}
		 */
		const html = template();
		this.parent.insertAdjacentHTML('beforeend', html);
	}
}

export default SignIn;
