import Button from '../Button/Button';
import template from './CounterButton.hbs';
import './CounterButton.scss';

/**
 * Кнопка счетчик
 */
class CounterButton {
	#parent;
	#id;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметр компонента
	 * @param {number} params.id - id элемента
	 * @param {number} params.initCount - начальное количество
	 */
	constructor(parent, { id, initCount }) {
		this.#parent = parent;
		this.#id = id;
		this.count = initCount;
		this.isNull = true;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		return template({
			id: this.#id,
			count: this.count,
		});
	}

	/**
	 * Изменение состояния кнопки добавления
	 * @param {number} count - количество блюд
	 */
	setCountState(count) {
		this.count = count;

		const currentButton = document.getElementById(this.#id);

		const addButton = new Button(this.#parent, {
			id: this.#id,
			content: 'Добавить',
			onClick: () => {
				this.count++;
				this.setCountState(this.count);
			},
		});

		if (this.count === 0) {
			this.isNull = true;
			currentButton?.remove();
			addButton.render();
		}

		if (this.count > 0 && this.isNull) {
			this.isNull = false;
			currentButton?.remove();
			this.renderCounter();
		}
	}

	/**
	 * Рендеринг счетчика
	 */
	renderCounter() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML());

		const count = this.#parent.querySelector('span');

		const addButton = this.#parent.querySelector('#plus-button');

		addButton.onclick = () => {
			this.count++;
			count.innerHTML = this.count;
			this.setCountState(this.count);
		};

		const removeButton = this.#parent.querySelector('#minus-button');

		removeButton.onclick = () => {
			this.count--;
			count.innerHTML = this.count;
			this.setCountState(this.count);
		};
	}

	/**
	 * Рендер компонента в зависимости от количества
	 */
	render() {
		this.setCountState(this.count);
	}
}

export default CounterButton;
