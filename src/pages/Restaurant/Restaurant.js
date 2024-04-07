import api from '../../modules/api';
import template from './Restaurant.hbs';
import './Restaurant.scss';
import Banner from './components/Banner/Banner';
import CategoryFood from './components/CategoryFood/CategoryFood';
import Sidebar from './components/SideBar/Sidebar';

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
		this.activeCategory = 0;
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
	 * Обновление активной категории
	 * @param {number} id - id новой категории
	 */
	setActiveCategory(id) {
		const activeItem = document.querySelector(`#item-${id}`);

		const items = document.querySelectorAll('.category-item');

		items.forEach((item) => {
			item.classList.remove('category-active');
		});

		activeItem.classList.add('category-active');
		this.activeCategory = id;
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

		const sidebarContainer = document.getElementById('restaurant-sidebar');
		const sidebar = new Sidebar(sidebarContainer, {
			categories: data.categories,
			setActiveCategory: this.setActiveCategory.bind(this),
			activeCategory: this.activeCategory,
		});

		sidebar.render();

		const bannerContainer = document.getElementById('restaurant-banner-container');
		const banner = new Banner(bannerContainer, data);
		banner.render();

		const foodList = document.getElementById('restaurant-food');
		data.categories.forEach((category) => {
			const categoryBlock = new CategoryFood(foodList, {
				data: category,
				setActiveCategory: this.setActiveCategory.bind(this),
				activeCategory: this.activeCategory,
			});

			categoryBlock.render();
		});

		const categories = document.querySelectorAll('.category-title');

		const observerCallback = (entries) => {
			entries.forEach((entry) => {
				const id = entry.target.id.split('-')[1];

				if (entry.isIntersecting && this.activeCategory !== Number(id)) {
					this.setActiveCategory(id);
				}
			});
		};

		const categoriesObserver = new IntersectionObserver(observerCallback, {
			rootMargin: '-100px 0px -400px 0px',
			threshold: 0,
		});

		categories.forEach((category) => categoriesObserver.observe(category));
	}

	/**
	 * Получение информации о ресторане
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
