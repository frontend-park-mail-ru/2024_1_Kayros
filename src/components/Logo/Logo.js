import template from './Logo.hbs';
import './Logo.scss';

/**
 * Логотип
 */
class Logo {
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

export default Logo;
