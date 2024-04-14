import api from '../../../../modules/api';
import DishCard from '../DishCard/DishCard';
import template from './Dishes.hbs';
import './Dishes.scss';

/**
 * Выбранные блюда в корзине
 */
class Dishes {
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
	async render() {
		if (!this.data?.length) {
			this.#parent.insertAdjacentHTML('beforeend', template());
			return;
		}

		await api.getRestaurantInfo(this.data[0]?.restaurant_id, (data) => {
			this.restaurant = data;
		});

		this.#parent.insertAdjacentHTML('beforeend', template({ restaurantName: this.restaurant?.name }));

		const foodList = this.#parent.querySelector('.dishes');

		this.data?.forEach((item) => {
			const foodCard = new DishCard(foodList, item);
			foodCard.render();
		});
	}
}

export default Dishes;
