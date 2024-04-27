import template from './Slider.hbs';
import './Slider.scss';

/**
 * Лоадер
 */
class Slider {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {object} params.items - children
	 */
	constructor(parent, { items }) {
		this.parent = parent;
		this.items = items;
		this.active = 0;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template({ items: this.items }));
	}
}

export default Slider;
