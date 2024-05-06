import Header from '../../components/Header';
import Input from '../../components/Input/index.js';
import Loader from '../../components/Loader';
import api from '../../modules/api';
import { router } from '../../modules/router.js';
import urls from '../../routes/urls.js';
import SearchRestaurantCard from '../Restaurants/components/RestaurantCard';
import template from './Search.hbs';
import './Search.scss';

/**
 * Страница со списком ресторанов
 */
class Search {
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
		const searchRestaurants = document.querySelector('.search-restaurants__cards');

		if (!items || !items.length) {
			searchRestaurants.innerText = 'Ничего не найдено';
			return;
		}

		items.forEach((item) => {
			const restaurantCard = new SearchRestaurantCard(searchRestaurants, item);
			restaurantCard.render();
		});
	}

	/**
	 * Получение данных о ресторанах
	 */
	getData() {
		api.getSearchRestaurants(this.renderData.bind(this));
	}

	/**
	 *
	 */
	clickOnSearch() {
		if (!this.searchValue) {
			return;
		}

		const searchParams = { search: this.searchValue };

		router.navigate(urls.search, { searchParams });
	}

	/**
	 *
	 */
	changeSearchInputValue() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const searchBlock = document.getElementById('restaurants-search-input');
		const searchValue = urlSearchParams.get('search') || '';

		this.searchValue = searchValue;

		if (!searchBlock) {
			return;
		}

		if (window.location.pathname === urls.search) {
			searchBlock.value = searchValue;
		} else {
			searchBlock.value = '';
		}
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

		if (window.innerWidth < 900) {
			const urlSearchParams = new URLSearchParams(window.location.search);
			const searchValue = urlSearchParams.get('search') || '';

			this.searchValue = searchValue;

			const restaurantsContainer = document.querySelector('.search-restaurants');

			const searchInput = new Input(restaurantsContainer, {
				button: 'Найти',
				value: searchValue,
				id: 'restaurants-search-input',
				position: 'afterbegin',
				placeholder: 'Ресторан, категория',
				onChange: (event) => {
					this.searchValue = event.target.value;
				},
				buttonOnClick: this.clickOnSearch.bind(this),
			});

			searchInput.render();

			window.addEventListener('popstate', this.changeSearchInputValue.bind(this));
		}

		const searchRestaurants = document.querySelector('.search-restaurants__cards');
		const loader = new Loader(searchRestaurants, { id: 'content-loader', size: 'xl' });
		loader.render();

		this.getData();
	}
}

export default Search;
