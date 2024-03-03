import template from './NotFound.hbs';
import './NotFound.scss';

/**
 * Класс спользуется для отображения сообщения об отсутствии страницы или ресурса.
 */
class NotFound {
	/**
	 * Создает экземпляр страницы NotFound.
	 * @param {Element} parent Элемент DOM, в который будет рендериться страница "Не найдено".
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

export default NotFound;
