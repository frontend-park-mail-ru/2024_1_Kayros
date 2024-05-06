import api from '../../modules/api';
import CounterButton from '../CounterButton';
import template from './DishCard.hbs';
import './DishCard.scss';

/**
 * Карточка блюда из корзины
 */
class DishCard {
	#parent;

	/**
	 * Создает экземпляр
	 * @param {HTMLDivElement} parent - родительский элемент
	 * @param {object} data - информация о еде
	 * @param {object} params - параметры
	 * @param {boolean} params.addCounter - карточка с счетчиком
	 */
	constructor(parent, data, { addCounter = true } = {}) {
		this.#parent = parent;
		this.data = data;
		this.addCounter = addCounter;
	}

	/**
	 * Рендер страницы
	 */
	render() {
		this.#parent.insertAdjacentHTML(
			'beforeend',
			template({ counter: this.addCounter, class: this.addCounter ? '' : 'dish-card--complete', ...this.data }),
		);

		if (!this.addCounter) {
			return;
		}

		const card = this.#parent.querySelector(`#food-${this.data.id}`);

		const counterBlock = card.querySelector('.dish-card__counter-block');
		const counter = new CounterButton(counterBlock, {
			id: `dish-card__counter-${this.data.id}`,
			initCount: this.data.count,
			maxCount: 99,
			productId: this.data.id,
			withAddButton: false,
			addCount: async (id) => {
				const sum = await api.addToCart(id);

				if (!sum && sum !== 0) {
					return;
				}

				const cart = document.getElementById('cart-button');
				const formSum = document.querySelector('#pay-form-sum');
				const sumBlock = cart.querySelector('span');

				if (!sum) cart.remove();

				sumBlock.innerHTML = sum ? `${sum} ₽` : '';
				formSum.innerHTML = `${sum || 0} ₽`;

				return sum;
			},
			removeCount: async (id) => {
				const sum = await api.removeFromCart(id);

				if (!sum && sum !== 0) {
					return;
				}

				const submit = document.getElementById('pay-form-button');

				const cart = document.getElementById('cart-button');
				if (!cart) return;

				const formSum = document.querySelector('#pay-form-sum');

				formSum.innerHTML = `${sum || 0} ₽`;

				if (!sum) cart.className = 'btn btn--secondary size-xs';

				const cards = document.getElementsByClassName('dish-card');

				const element = this.#parent.querySelector(`#food-${this.data.id}`);
				element?.remove();

				if (cards.length === 0) {
					submit.disabled = true;

					const dishes = document.querySelector('.dishes');
					dishes.innerHTML = 'Корзина пуста';
				}

				return sum;
			},
			updateCount: async ({ id, count }) => {
				const sum = await api.updateCartCount({ food_id: id, count });

				if (!sum && sum !== 0) {
					return;
				}

				const cart = document.getElementById('cart-button');
				const formSum = document.querySelector('#pay-form-sum');
				const sumBlock = cart.querySelector('span');

				sumBlock.innerHTML = sum ? `${sum} ₽` : '';
				formSum.innerHTML = `${sum || 0} ₽`;

				if (!sum) cart.remove();

				return sum;
			},
		});

		counter.render();
	}
}

export default DishCard;
