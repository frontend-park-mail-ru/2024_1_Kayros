import CounterButton from '../../../../components/CounterButton';
import api from '../../../../modules/api';
import template from './FoodCard.hbs';
import './FoodCard.scss';

/**
 * Карточка блюда
 */
class FoodCard {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} data - информация о еде
	 * @param {number} count - количество блюд в корзине
	 */
	constructor(parent, data, count) {
		this.parent = parent;
		this.data = data;
		this.added = false;
		this.count = count;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template(this.data));

		const food = document.getElementById(`food-${this.data.id}`);
		const action = food.querySelector('#food-action');
		const counterButton = new CounterButton(action, {
			id: `food-button-${this.data.id}`,
			productId: this.data.id,
			initCount: this.count,
			addCount: async (id) => {
				const res = await api.addToCart(id);

				const cart = document.getElementById('cart-button');
				const sum = cart.querySelector('span');

				if (res === 0) {
					cart.className = 'btn btn-secondary';
					sum.innerHTML = '';
				} else {
					cart.className = 'btn btn-primary';
					sum.innerHTML = `${res || 0} ₽`;
				}

				return res;
			},
			removeCount: async (id) => {
				const res = await api.removeFromCart(id);

				const cart = document.getElementById('cart-button');
				const sum = cart.querySelector('span');

				if (res === 0) {
					cart.className = 'btn btn-secondary';
					sum.innerHTML = '';
				} else {
					cart.className = 'btn btn-primary';
					sum.innerHTML = `${res || 0} ₽`;
				}

				return res;
			},
			updateCount: async ({ id, count }) => {
				const res = await api.updateCartCount({ food_id: id, count });

				const cart = document.getElementById('cart-button');
				const sum = cart.querySelector('span');

				if (res === 0) {
					cart.className = 'btn btn-secondary';
					sum.innerHTML = '';
				} else {
					cart.className = 'btn btn-primary';
					sum.innerHTML = `${res || 0} ₽`;
				}

				return res;
			},
		});

		counterButton.render();
	}
}

export default FoodCard;
