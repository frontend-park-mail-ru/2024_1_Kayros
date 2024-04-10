import CounterButton from '../../../../components/CounterButton';
import api from '../../../../modules/api';
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
	 */
	constructor(parent, data) {
		this.#parent = parent;
		this.data = data;
	}

	/**
	 * Рендер страницы
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template(this.data));

		const card = this.#parent.querySelector(`#food-${this.data.id}`);

		const counterBlock = card.querySelector('.dish-card__counter-block');
		const counter = new CounterButton(counterBlock, {
			id: `dish-card__counter-${this.data.id}`,
			initCount: this.data.count,
			productId: this.data.id,
			addCount: async (id) => {
				const res = await api.addToCart(id);

				const cart = document.getElementById('cart-button');
				const formSum = document.querySelector('#pay-form-sum');
				const sum = cart.querySelector('span');

				sum.innerHTML = `${res || 0} ₽`;
				formSum.innerHTML = `${res || 0} ₽`;

				return res;
			},
			removeCount: async (id) => {
				const sum = await api.removeFromCart(id);
				const submit = document.getElementById('pay-form-button');

				const cart = document.getElementById('cart-button');
				const formSum = document.querySelector('#pay-form-sum');
				const sumBlock = cart.querySelector('span');

				formSum.innerHTML = `${sum || 0} ₽`;
				sumBlock.innerHTML = `${sum || 0} ₽`;

				const cards = document.getElementsByClassName('dish-card');

				if (cards.length === 1) {
					submit.disabled = true;
				}

				const element = this.#parent.querySelector(`#food-${this.data.id}`);
				element.remove();
				return sum;
			},
			updateCount: async ({ id, count }) => {
				const sum = await api.updateCartCount({ food_id: id, count });

				const cart = document.getElementById('cart-button');
				const formSum = document.querySelector('#pay-form-sum');
				const sumBlock = cart.querySelector('span');

				sumBlock.innerHTML = `${sum || 0} ₽`;
				formSum.innerHTML = `${sum || 0} ₽`;

				return sum;
			},
		});

		counter.render();
	}
}

export default DishCard;
