import Button from '../Button/Button';
import template from './CounterButton.hbs';
import './CounterButton.scss';

/**
 * Кнопка счетчик
 */
class CounterButton {
	parent;
	#id;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметр компонента
	 * @param {number} params.id - id элемента
	 * @param {number} params.productId - id продукта
	 * @param {boolean} params.withAddButton - отображать кнопку добавления
	 * @param {number} params.initCount - начальное количество
	 * @param {void} params.addCount - добавление 1
	 * @param {void} params.removeCount - удаление 1
	 * @param {void} params.updateCount - обновление счета
	 * @param {void} params.prevCount - обновление счета
	 */
	constructor(
		parent,
		{
			id,
			productId,
			initCount,
			withAddButton = true,
			addCount = () => {},
			removeCount = () => {},
			updateCount = () => {},
			prevCount = () => true,
		},
	) {
		this.parent = parent;
		this.#id = id;
		this.count = initCount;
		this.isNull = true;
		this.addCount = addCount;
		this.removeCount = removeCount;
		this.updateCount = updateCount;
		this.productId = productId;
		this.frontCount = initCount;
		this.timer;
		this.withAddButton = withAddButton;
		this.prevCount = prevCount;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		return template({
			id: this.#id,
			count: this.frontCount,
		});
	}

	/**
	 * Функция для отрисовки нужной кнопки
	 */
	rerenderCounter() {
		const currentButton = document.getElementById(this.#id);

		const addButton = new Button(this.parent, {
			id: this.#id,
			content: 'Добавить',
			onClick: () => {
				const isContinue = this.prevCount();

				if (!isContinue) {
					return;
				}

				this.frontCount++;

				this.rerenderCounter();

				if (this.timer) {
					clearTimeout(this.timer);
				}

				this.timer = setTimeout(() => this.setCountState(), 300);
			},
		});

		if (this.frontCount === 0) {
			this.isNull = true;

			if (this.withAddButton) {
				currentButton?.remove();
				addButton.render();
			}
		}

		if (this.frontCount > 0) {
			this.isNull = false;
			currentButton?.remove();
			this.renderCounter();
		}
	}

	/**
	 * Изменение состояния кнопки добавления
	 * @param {boolean} init - стартовый рендер
	 */
	async setCountState(init = false) {
		const countEl = this.parent.querySelector('span');

		let res;

		if (this.count === 0 && !init && this.frontCount > 0) {
			res = await this.addCount({ food_id: this.productId, count: this.frontCount });
		}

		if (this.count > 0 && this.frontCount > 0 && !init) {
			res = await this.updateCount({ id: this.productId, count: this.frontCount });
		}

		if (this.frontCount === 0 && !init) {
			res = await this.removeCount(this.productId);
		}

		if (!res && res !== 0) {
			const countDifference = Math.abs(this.frontCount - this.count);

			if (this.frontCount > this.count) {
				this.frontCount -= countDifference;
			} else {
				this.frontCount += countDifference;
			}
		}

		this.count = this.frontCount;

		countEl.innerHTML = this.count;

		this.rerenderCounter();
	}

	/**
	 * Рендеринг счетчика
	 */
	renderCounter() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const addButton = this.parent.querySelector('.counter-button__plus');

		addButton.onclick = () => {
			const isContinue = this.prevCount();

			if (!isContinue) {
				return;
			}

			this.frontCount++;

			if (this.timer) {
				clearTimeout(this.timer);
			}

			this.rerenderCounter();

			this.timer = setTimeout(() => this.setCountState(), 300);
		};

		const removeButton = this.parent.querySelector('.counter-button__minus');

		removeButton.onclick = () => {
			const isContinue = this.prevCount();

			if (!isContinue) {
				return;
			}

			this.frontCount--;

			if (this.timer) {
				clearTimeout(this.timer);
			}

			this.rerenderCounter();

			this.timer = setTimeout(() => this.setCountState(), 300);
		};
	}

	/**
	 * Рендер компонента в зависимости от количества
	 */
	render() {
		this.rerenderCounter();
	}
}

export default CounterButton;
