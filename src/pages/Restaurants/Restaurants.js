import Loader from '../../components/Loader';
import api from '../../modules/api';
import template from './Restaurants.hbs';
import RestaurantCard from './components/RestaurantCard';
import './Restaurants.scss';

/**
 * Страница со списком ресторанов
 */
class Restaurants {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.parent = parent;
	}

	/**
	 * Отрисовка карточек ресторанов
	 * @param {Array} items - массив ресторанов
	 */
	renderData(items) {
		const restaurantsElement = document.getElementById('restaurants');
		restaurantsElement?.remove();

		this.parent.insertAdjacentHTML('beforeend', template());

		const newRestaurants = document.getElementById('restaurants');

		if (!items) {
			newRestaurants.innerText = 'Нет доступных ресторанов';
			return;
		}

		items.forEach((item) => {
			const restaurantCard = new RestaurantCard(newRestaurants, item);
			restaurantCard.render();
		});
	}

	/**
	 * Получение данных о ресторанах
	 */
	getData() {
		api.getRestaurants(this.renderData.bind(this));
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		const restaurantsElement = document.getElementById('restaurants');

		if (!restaurantsElement) {
			this.parent.insertAdjacentHTML('beforeend', template());
		}

		const restaurants = document.getElementById('restaurants');
		const loader = new Loader(restaurants, { id: 'content-loader', size: 'xl' });
		loader.render();

		this.getData();
	}
}

export default Restaurants;
