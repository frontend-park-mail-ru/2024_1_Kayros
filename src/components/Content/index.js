import template from './Content.hbs';
import './styles.scss';

/**
 * Контент
 */
class Content {
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
		this.parent.insertAdjacentHTML('beforeend', template());
	}
}

export default Content;
