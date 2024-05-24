import Button from '../../components/Button/Button';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import mobileTemplate from './MobileRestaurant.hbs';
import template from './Restaurant.hbs';
import Banner from './components/Banner/Banner';
import CategoryFood from './components/CategoryFood/CategoryFood';
import Sidebar from './components/SideBar/Sidebar';
import './Restaurant.scss';
import './MobileRestaurant.scss';

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
		this.isMobile = window.innerWidth < 480;
	}

	/**
	 * Получение html компонента
	 * @param {object} data - информация о ресторане
	 * @returns {HTMLElement} html
	 */
	getHTML(data) {
		if (this.isMobile) {
			return mobileTemplate(data);
		} else {
			return template(data);
		}
	}

	/**
	 * Обновление активной категории
	 * @param {number} id - id новой категории
	 */
	setActiveCategory(id) {
		let activeItem = null;

		if (this.isMobile) {
			activeItem = document.querySelector(`#mobile-category-${id}`);
		} else {
			activeItem = document.querySelector(`#item-${id}`);
		}

		let items = [];

		if (this.isMobile) {
			items = document.querySelectorAll('.mobile-category-link');
		} else {
			items = document.querySelectorAll('.restaurant-categories__item');
		}

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
		const restaurant = document.querySelector('.restaurant__container');

		if (!data) {
			restaurant.innerText = 'Ресторан не найден';
			return;
		}

		document.title = `Resto - ${data.name}`;

		this.#parent.innerHTML = this.getHTML(data);

		const sidebarContainer = document.querySelector('.restaurant__sidebar');
		const sidebar = new Sidebar(sidebarContainer, {
			categories: data.categories,
			setActiveCategory: this.setActiveCategory.bind(this),
			activeCategory: this.activeCategory,
		});

		sidebar.render();

		const bannerContainer = document.querySelector('.restaurant__banner-container');
		const banner = new Banner(bannerContainer, data);
		banner.render();

		const foodList = document.querySelector('.restaurant__food');
		data.categories.forEach((category) => {
			const categoryBlock = new CategoryFood(foodList, {
				data: category,
				setActiveCategory: this.setActiveCategory.bind(this),
				activeCategory: this.activeCategory,
				cart: this.cart,
			});

			categoryBlock.render();
		});

		const categories = document.querySelectorAll('.category__title');

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
	 *
	 * @param {*} data - data
	 * @returns {*} return
	 */
	async renderMobile(data) {
		const restaurant = document.querySelector('.restaurant-mobile');

		if (!data) {
			restaurant.innerText = 'Ресторан не найден';
			return;
		}

		document.title = `Resto - ${data.name}`;

		this.#parent.innerHTML = this.getHTML(data);

		const bannerContainer = document.querySelector('.restaurant-mobile__banner');
		const banner = new Banner(bannerContainer, data);
		banner.render();

		const sliderContainer = document.querySelector('.restaurant-mobile__slider');

		data.categories.forEach((category) => {
			const link = new Button(sliderContainer, {
				id: `mobile-category-${category.id}`,
				content: category.name,
				style: 'clear',
				additionalClass: 'mobile-category-link',
				onClick: () => {
					const categoryItem = document.getElementById(`category-${category.id}`);
					var categoryPosition = categoryItem.getBoundingClientRect().top;
					var offsetPosition = categoryPosition + window.scrollY - 120;

					window.scrollTo({
						top: offsetPosition,
						behavior: 'smooth',
					});
				},
			});

			link.render();
		});

		const foodList = document.querySelector('.restaurant-mobile__food');
		data.categories.forEach((category) => {
			const categoryBlock = new CategoryFood(foodList, {
				data: category,
				activeCategory: this.activeCategory,
				cart: this.cart,
			});

			categoryBlock.render();
		});

		const categories = document.querySelectorAll('.category__title');

		const observerCallback = (entries) => {
			entries.forEach((entry) => {
				const id = entry.target.id.split('-')[1];

				if (entry.isIntersecting && this.activeCategory !== Number(id)) {
					this.setActiveCategory(id);
				}
			});
		};

		const categoriesObserver = new IntersectionObserver(observerCallback, {
			rootMargin: '-100px 0px -600px 0px',
			threshold: 0,
		});

		categories.forEach((category) => categoriesObserver.observe(category));
		
		await this.checkCartDataAndRenderButton();
	}

	/**
	 *
	 */
	checkCartDataAndRenderButton() {
		api.getCartInfo((cartData) => {
			if (cartData) {
				this.renderCartIcon();
			} else {
				this.removeCartIcon();
			}	
		});
	}
	/**
	 * Получение информации о ресторане
	 */
	async getData() {
		await api.getCartInfo((data) => {
			this.cart = data;
		});

		api.getRestaurantInfo(this.id, this.isMobile ? this.renderMobile.bind(this) : this.renderData.bind(this));
	}

	/**
	 *
	 */
	renderCartIcon() {
		const cartBlockMobile = document.querySelector('.cart__mobile');
		let existingButton = document.getElementById('cart-button2');

		if (!existingButton) {
			const cartButtonMobile = new Button(cartBlockMobile, {
				id: 'cart-button2',
				content: '',
				icon: 'cart',
				style: 'primary',
				onClick: () => router.navigate(urls.cart),
			});

			cartButtonMobile.render();
		}
	}
	
	/**
	 *
	 */
	removeCartIcon() {
		const existingButton = document.getElementById('cart-button2');

		if (existingButton) {
			existingButton.remove();
		}
	}

	/**
	 * Рендеринг страницы
	 */
	async render() {
		if (this.isMobile) {
			const content = document.querySelector('.content');
			content.classList.add('content--no-padding');

			this.#parent.insertAdjacentHTML('beforeend', mobileTemplate());
		} else {
			this.#parent.insertAdjacentHTML('beforeend', template());
		}

		await this.getData();
	}
}

export default Restaurant;	
