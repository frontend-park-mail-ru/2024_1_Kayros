import Header from '../../components/Header';
import Loader from '../../components/Loader';
import OrderStatusPanel from '../../components/OrderStatusPanel';
import SlickSlider from '../../components/SlickSlider';
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
		const restaurantsContainer = document.querySelector('.restaurants');
		const title = document.createElement('div');
		title.className = 'restaurants__title';
		title.innerText = 'Рестораны';
		restaurantsContainer.insertAdjacentElement('afterbegin', title);

		const restaurants = document.querySelector('.restaurants__cards');

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
	 * Отрисовка статусов заказов
	 * @param {Array} items - массив заказов
	 */
	renderOrders(items) {
		const content = document.querySelector('.content');

		const slickSlider = new SlickSlider(content);
		slickSlider.render();

		const slickTrack = content.querySelector('.slick-track');

		if (!items) {
			return;
		}

		items.forEach((item) => {
			const orderPanel = new OrderStatusPanel(slickTrack, item);
			orderPanel.render();
		});
	}

	/**
	 *
	 */
	async getOrdersData() {
		await api.getOrdersData(this.renderOrders.bind(this));
	}

	/**
	 * Рендеринг страницы
	 */
	async render() {
		this.#parent.insertAdjacentHTML('beforeend', template());

		const currentHeader = document.querySelector('.header');

		if (!currentHeader) {
			const header = new Header();
			header.render();
		}

		const content = document.querySelector('.content');

		await this.getOrdersData(content);

		const restaurants = document.querySelector('.restaurants__cards');
		const loader = new Loader(restaurants, { id: 'content-loader', size: 'xl' });
		loader.render();

		this.getData();
	}
}

export default Restaurants;
