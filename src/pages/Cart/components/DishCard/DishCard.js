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
				return res;
			},
			removeCount: async (id) => {
				const res = await api.removeFromCart(id);
				const submit = document.getElementsByClassName('pay-form-button');

				const cards = document.getElementsByClassName('dish-card');

				if (cards.length === 1) {
					submit.disabled = true;
				}

				const element = this.#parent.querySelector(`#food-${this.data.id}`);
				element.remove();
				return res;
			},
			updateCount: async ({ id, count }) => {
				const res = await api.updateCartCount({ food_id: id, count });
				return res;
			},
		});

		counter.render();
	}
}

export default DishCard;
