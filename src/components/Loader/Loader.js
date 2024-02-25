import template from './Loader.hbs';
import './Loader.scss';

/**
 * Логотип
 */
class Loader {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {Object} params - параметры
	 * @param {'s' | 'm' | 'l' | 'xl'} params.size - размер
	 */
	constructor(parent, { size }) {
		this.parent = parent;
		this.size = size;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template({ class: 'loader-' + this.size }));
	}
}

export default Loader;
