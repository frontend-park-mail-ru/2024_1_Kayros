import template from './Loader.hbs';
import './Loader.scss';

/**
 * Лоадер
 */
class Loader {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {number} params.id - id элемента
	 * @param {'s' | 'm' | 'l' | 'xl'} params.size - размер лоадера
	 * @param {'primary' | 'secondary'} params.style - размер лоадера
	 */
	constructor(parent, { id = '', size = 's', style = 'primary' }) {
		this.id = id;
		this.parent = parent;
		this.size = size;
		this.style = style;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML(
			'beforeend',
			template({ id: this.id, class: `loader-${this.size}`, style: `loader-${this.style}` }),
		);
	}
}

export default Loader;
