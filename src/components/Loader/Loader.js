import template from './Loader.hbs';
import './Loader.scss';

/**
 * Лоадер
 */
class Loader {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {Object} params - параметры компонента
	 * @param {'s' | 'm' | 'l' | 'xl'} params.size - размер лоадера
	 */
	constructor(parent, { size = 's' }) {
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
