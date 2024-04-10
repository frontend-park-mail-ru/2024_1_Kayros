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
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template());

		const foodList = this.#parent.querySelector('.dishes');

		this.data?.forEach((item) => {
			const foodCard = new DishCard(foodList, item);
			foodCard.render();
		});
	}
}

export default Dishes;
