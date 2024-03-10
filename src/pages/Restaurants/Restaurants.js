import Header from '../../components/Header';
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

		if (!items) {
			restaurantsElement.innerText = 'Нет доступных ресторанов';
			return;
		}

		items.forEach((item) => {
			const restaurantCard = new RestaurantCard(restaurantsElement, item);
			restaurantCard.render();
		});
	}

	/**
	 * Получение данных о ресторанах
	 */
	getData() {
		api.getRestaurants(this.renderData);
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template());

		const currentHeader = document.getElementById('header');

		if (!currentHeader) {
			const header = new Header();
			header.render();
		}

		const restaurants = document.getElementById('restaurants');
		const loader = new Loader(restaurants, { size: 'xl' });
		loader.render();

		this.getData();
	}
}

export default Restaurants;
