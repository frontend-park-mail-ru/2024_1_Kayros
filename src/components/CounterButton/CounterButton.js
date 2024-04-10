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
	 * @param {number} params.productId - id продукта
	 * @param {number} params.initCount - начальное количество
	 * @param {void} params.addCount - добавление 1
	 * @param {void} params.removeCount - удаление 1
	 * @param {void} params.updateCount - обновление счета
	 */
	constructor(parent, { id, productId, initCount, addCount, removeCount, updateCount }) {
		this.#parent = parent;
		this.#id = id;
		this.count = initCount;
		this.isNull = true;
		this.addCount = addCount;
		this.removeCount = removeCount;
		this.updateCount = updateCount;
		this.productId = productId;
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
	 * @param {boolean} init - стартовый рендер
	 */
	async setCountState(count, init) {
		const countEl = this.#parent.querySelector('span');

		let res = 0;

		if (this.count === 0 && !init) {
			res = await this.addCount(this.productId);
		}

		if (this.count > 0 && count !== 0 && !init) {
			res = await this.updateCount({ id: this.productId, count: count });
		}

		if (count === 0 && !init) {
			res = await this.removeCount(this.productId);
		}

		const currentButton = document.getElementById(this.#id);

		const addButton = new Button(this.#parent, {
			id: this.#id,
			content: 'Добавить',
			onClick: () => {
				this.setCountState(this.count + 1);
			},
		});

		if (res) {
			this.count = count;
			countEl.innerHTML = this.count;
		}

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

		const addButton = this.#parent.querySelector('#plus-button');

		addButton.onclick = () => {
			this.setCountState(this.count + 1);
		};

		const removeButton = this.#parent.querySelector('#minus-button');

		removeButton.onclick = () => {
			this.setCountState(this.count - 1);
		};
	}

	/**
	 * Рендер компонента в зависимости от количества
	 */
	render() {
		this.setCountState(this.count, true);
	}
}

export default CounterButton;
