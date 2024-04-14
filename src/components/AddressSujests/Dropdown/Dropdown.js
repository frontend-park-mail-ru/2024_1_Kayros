import Button from '../../Button/Button';
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

		const itemElements = this.#parent.getElementsByClassName('dropdown__item');

		Array.from(itemElements).forEach((item) => {
			item.onmousedown = () => {
				this.onClick(item.id);
			};
		});

		if (!this.items) {
			const notFound = this.#parent.querySelector('.dropdown__address-not-found');
			const button = new Button(notFound, {
				content: 'Предложить адрес',
				style: 'secondary',
				icon: 'add-icon',
			});

			button.render();
		}
	}
}

export default Dropdown;
