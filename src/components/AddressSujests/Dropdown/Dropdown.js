import template from './Dropdown.hbs';
import './Dropdown.scss';

/**
 * Дропдаун
 */
class Dropdown {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {object} params.items - элементы дропдауна
	 * @param {void} params.onClick - клик на элемента
	 */
	constructor(parent, { items = '', onClick = '' } = {}) {
		this.items = items;
		this.#parent = parent;
		this.onClick = onClick;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		return template({ items: this.items });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML());

		const itemElements = this.#parent.getElementsByClassName('dropdown-item');

		Array.from(itemElements).forEach((item) => {
			item.onmousedown = () => {
				this.onClick(item.id);
			};
		});
	}
}

export default Dropdown;
