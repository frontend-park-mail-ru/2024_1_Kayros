import Loader from '../../components/Loader';
import ajax from '../../modules/ajax';
import urls from '../../modules/urls';
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
	 */
	renderData(items) {
		const restaurantsElement = document.getElementById('restaurants');

		const loader = restaurantsElement.querySelector('.loader');
		loader?.remove();

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
		ajax.get(urls.getRestaurants(), (data) => {
			this.renderData(data);
		});
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template());

		const restaurants = document.getElementById('restaurants');
		const loader = new Loader(restaurants, { size: 'xl' });
		loader.render();

		this.getData();
	}
}

export default Restaurants;
