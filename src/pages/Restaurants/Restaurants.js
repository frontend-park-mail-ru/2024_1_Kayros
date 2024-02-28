import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import RESTAURANTS_MOCK from '../../mocks/restaurants';
import template from './Restaurants.hbs';
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
	 * Рендеринг страницы
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template());

		const restaurantsElement = document.getElementById('restaurants');

		const restaurants = RESTAURANTS_MOCK;

		restaurants.forEach((restaurant) => {
			const restaurantCard = new RestaurantCard(restaurantsElement, {
				image: restaurant.image,
				title: restaurant.name,
				subtitle: restaurant.description,
				rating: restaurant.rating,
			});

			restaurantCard.render();
		});
	}
}

export default Restaurants;
