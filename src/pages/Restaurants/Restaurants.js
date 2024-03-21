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
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
	}

	/**
	 * Отрисовка карточек ресторанов
	 * @param {Array} items - массив ресторанов
	 */
	renderData(items) {
		const restaurants = document.getElementById('restaurants');

		if (!items) {
			restaurants.innerText = 'Нет доступных ресторанов';
			return;
		}

		items.forEach((item) => {
			const restaurantCard = new RestaurantCard(restaurants, item);
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
		this.#parent.insertAdjacentHTML('beforeend', template());

		const currentHeader = document.getElementById('header');

		if (!currentHeader) {
			const header = new Header();
			header.render();
		}

		const restaurants = document.getElementById('restaurants');
		const loader = new Loader(restaurants, { id: 'content-loader', size: 'xl' });
		loader.render();

		this.getData();
	}
}

export default Restaurants;
