import { Notification } from 'resto-ui';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Input from '../../components/Input/Input';
import Loader from '../../components/Loader';
import OrderStatusPanel from '../../components/OrderStatusPanel';
import SlickSlider from '../../components/SlickSlider';
import { ORDER_STATUSES } from '../../constants';
import api from '../../modules/api';
import urls from '../../routes/urls';
import { localStorageHelper } from '../../utils';
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
		this.fetchInterval = '';
	}

	/**
	 * Отрисовка карточек ресторанов
	 * @param {Array} items - массив ресторанов
	 */
	renderData(items) {
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
		const restaurantsContainer = document.querySelector('.restaurants');

		if (!restaurantsContainer) {
			return;
		}

		const ordersContainer = document.querySelector('.orders-slider');

		if (!items) {
			ordersContainer.innerHTML = '';
			return;
		}

		const currentSLider = ordersContainer.querySelector('.slick-track');

		if (currentSLider) {
			items.forEach((item) => {
				const orderPanel = currentSLider.querySelector(`#order-panel-${item.id}`);
				const statusContainer = orderPanel.querySelector('.order-panel__status');

				const currentStatus = statusContainer.innerText;

				if (currentStatus !== ORDER_STATUSES[item.status]) {
					statusContainer.innerText = ORDER_STATUSES[item.status];

					Notification.open({
						duration: 4,
						title: `Заказ №${item.id}`,
						description: ORDER_STATUSES[item.status],
						type: 'success',
					});
				}
			});

			return;
		}

		const slickSlider = new SlickSlider(ordersContainer);
		slickSlider.render();

		const slickTrack = ordersContainer.querySelector('.slick-track');

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
	 *
	 */
	async initCategories() {
		api.getCategories((categories) => {
			const categoryBar = document.querySelector('.category-bar');
			categories.forEach((category) => {
				const categoryDiv = document.createElement('div');
				categoryDiv.className = `category category${category.id}`;
				categoryBar.appendChild(categoryDiv);
				this.createButton(categoryDiv, `category${category.id}-button`, category.name, category.id);
			});
		});
	}

	/**
	 * Создаёт кнопку и добавляет её в указанный контейнер.
	 * @param {HTMLElement} container - Контейнер, куда будет добавлена кнопка.
	 * @param {string} id - id кнопки
	 * @param {string} label - Текст
	 * @param {string} categoryId - id Категории ресторана
	 * @param {string} style - Стиль
	 */
	createButton(container, id, label, categoryId, style = '') {
		const button = new Button(container, {
			id: id,
			onClick: () => {
				this.updateButtonStyles(id);
				this.filterRestaurantsByCategory(categoryId);
			},
			content: label,
			icon: '',
			style: style,
			additionalClass: 'category-button',
		});

		button.render();
	}
	/**
	 * @param {string} categoryId - id Категории ресторана
	 */
	filterRestaurantsByCategory(categoryId) {
		api.getRestaurants(this.renderData.bind(this), categoryId);
	}

	/**
	 * Обновляет стили кнопок
	 * @param {string} activeButtonId - Идентификатор кнопки, которую следует выделить как активную.
	 */
	updateButtonStyles(activeButtonId) {
		const buttons = document.querySelectorAll('.category-button');
		buttons.forEach((button) => {
			if (button.id === activeButtonId) {
				button.classList.add('btn--primary');
				button.classList.remove('btn--secondary');
			} else {
				button.classList.add('btn--secondary');
				button.classList.remove('btn--primary');
			}
		});
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
		await this.initCategories();

		const allCategoriesButton = document.querySelector('.all-categories-button');		
		const button = new Button(allCategoriesButton, {
			id: 'all-categories-button',
			onClick: () => {
				this.updateButtonStyles('all-categories-button');
			},
			content: 'Все',
			additionalClass: 'category-button',
		});

		button.render();

		if (allCategoriesButton) {
			allCategoriesButton.addEventListener('click', () => {
				api.getRestaurants(this.renderData.bind(this));
			});
		}

		if (window.innerWidth < 900) {
			const restaurantsContainer = document.querySelector('.restaurants');
			const search = new Input(restaurantsContainer, {
				id: 'restaurants-search-input',
				position: 'afterbegin',
				placeholder: 'Ресторан, категория',
			});

			search.render();
		}

		const restaurants = document.querySelector('.restaurants__cards');
		const loader = new Loader(restaurants, { id: 'content-loader', size: 'xl' });
		loader.render();

		this.getData();

		this.fetchInterval = setInterval(() => {
			const user = localStorageHelper.getItem('user-info');

			if (window.location.pathname !== urls.restaurants || !user) {
				clearInterval(this.fetchInterval);
				return;
			}

			api.getOrdersData(this.renderOrders.bind(this));
		}, 5000);
	}
}

export default Restaurants;
