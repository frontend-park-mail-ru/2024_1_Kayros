import api from '../../modules/api';
import template from './Restaurant.hbs';
import './Restaurant.scss';
import Banner from './components/Banner/Banner';
import FoodCard from './components/FoodCard/FoodCard';

/**
 * Страница ресторана
 */
class Restaurant {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {number} params.id - идентификатор ресторана
	 */
	constructor(parent, { id }) {
		this.#parent = parent;
		this.id = id;
	}

	/**
	 * Получение html компонента
	 * @param {object} data - информация о ресторане
	 * @returns {HTMLElement} html
	 */
	getHTML(data) {
		return template(data);
	}

	/**
	 * Отрисовка данных ресторана
	 * @param {object} data - информация о ресторане
	 */
	renderData(data) {
		const restaurant = document.getElementById('restaurant-container');

		if (!data) {
			restaurant.innerText = 'Ресторан не найден';
			return;
		}

		this.#parent.innerHTML = this.getHTML(data);

		const bannerContainer = document.getElementById('restaurant-banner-container');
		const banner = new Banner(bannerContainer, data);
		banner.render();

		const foodList = document.getElementById('restaurant-food');
		data.food.forEach((item) => {
			const foodCard = new FoodCard(foodList, item);
			foodCard.render();
		});
	}

	/**
	 *
	 */
	getData() {
		api.getRestaurantInfo(this.id, this.renderData.bind(this));
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.#parent.innerHTML = template();

		this.getData();
	}
}

export default Restaurant;
