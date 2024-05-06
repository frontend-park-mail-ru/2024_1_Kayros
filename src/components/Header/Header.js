import api from '../../modules/api';
import urls from '../../routes/urls';
import { localStorageHelper } from '../../utils';
import Button from '../Button';
import Input from '../Input';
import Logo from '../Logo';
import Profile from '../Profile';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import template from './Header.hbs';
import './Header.scss';
import {router} from "../../modules/router.js";

/**
 * Шапка
 */
class Header {
	#parent;

	/**
	 * Конструктор класса
	 * @param {object} params - параметры
	 * @param {void} params.navigate - функция навигации по страницам
	 */
	constructor({ navigate }) {
		this.navigate = navigate;
		this.#parent = document.querySelector('.layout');
	}

	/**
	 * Обработка полученных данных
	 * @param {object} data - информация о пользователе
	 */
	handleUserData(data) {
		if (!data) {
			localStorage.removeItem('user-info');
			return;
		}

		localStorage.setItem('user-info', JSON.stringify(data));
	}

	/**
	 * Обработка полученных данных
	 * @param {object} data - информация о корзине
	 */
	handleCartData(data) {
		const cartBlock = document.querySelector('.header__cart');
		const cartButton = new Button(cartBlock, {
			id: 'cart-button',
			content: data?.sum ? `${data.sum} ₽` : ' ',
			icon: 'cart',
			style: !data?.sum ? 'secondary' : 'primary',
			onClick: () => this.navigate(urls.cart),
		});

		cartButton.render();
	}

	changeSearchInputValue() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const searchBlock = document.getElementById('restaurants-search');
		const searchValue = urlSearchParams.get('search') || '';

		this.searchValue = searchValue;

		if (window.location.pathname === urls.search) {
			searchBlock.value = searchValue;
		} else {
			searchBlock.value = '';
		}
	}

	/**
	 * Получение данных пользователя
	 */
	async userData() {
		await api.getUserInfo(this.handleUserData);

		await api.getUserAddress(({ address } = {}) => {
			localStorage.setItem('user-address', JSON.stringify({ value: address }));
		});

		api.getCartInfo(this.handleCartData.bind(this));
	}

	clickOnSearch() {
		if (!this.searchValue) {
			return;
		}

		const searchParams = {search: this.searchValue};

		router.navigate(urls.search, {searchParams});
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		this.#parent.insertAdjacentHTML('afterbegin', template());
		const logoBlock = document.querySelector('.header__logo-container');

		if (window.innerWidth > 480) {
			const logo = new Logo(logoBlock, { onClick: () => this.navigate(urls.restaurants) });
			logo.render();
		} else {
			const backButton = new Button(logoBlock, {
				id: 'header-back-button',
				icon: 'favicon',
				style: 'clear',
				replace: true,
				onClick: () => {
					this.navigate(urls.restaurants);
				},
			});

			backButton.render();
		}

		const urlSearchParams = new URLSearchParams(window.location.search);
		const searchValue = urlSearchParams.get('search') || '';

		this.searchValue = searchValue

		const searchBlock = this.#parent.querySelector('.header__search-input');
		const searchInput = new Input(searchBlock, {
			id: 'restaurants-search',
			placeholder: 'Рестораны, категория',
			button: 'Найти',
			value: searchValue,
			onChange: (event) => {
				this.searchValue = event.target.value;

			},
			buttonOnClick: this.clickOnSearch.bind(this),
		});

		window.addEventListener('popstate', this.changeSearchInputValue.bind(this));

		searchInput.render();

		await this.userData();

		const user = localStorageHelper.getItem('user-info');
		const address = localStorageHelper.getItem('user-address').value;

		const addressBlock = document.querySelector('.header__address');
		const addressButton = new Button(addressBlock, {
			id: 'address-button',
			onClick: () => {
				this.navigate(urls.address);
			},
			content: address || 'Укажите адрес доставки',
			icon: address ? '' : 'address',
			style: address ? 'secondary' : 'primary',
		});

		addressButton.render();

		const profileBlock = document.querySelector('.header__profile-block');

		if (user) {
			const profile = new Profile(profileBlock, { user });
			profile.render();
		} else {
			const loginButton = new Button(profileBlock, {
				id: 'header-login-button',
				content: 'Войти',
				onClick: () => this.navigate(urls.signIn),
			});

			loginButton.render();
		}

		const headerElement = document.querySelector('.header');

		if (window.innerWidth < 480) {
			headerElement.style.position = 'fixed';
			headerElement.style.borderBottom = '1px solid #e3e3e3';
		}

		const profile = document.querySelector('.header__profile');

		if (profile) {
			const profileDropdown = new ProfileDropdown(profile, {
				id: 'profile-dropdown-profile',
				navigate: this.navigate,
				onExit: () => {
					headerElement.remove();
					this.render();

					if (window.location.pathname !== urls.restaurants) {
						this.navigate(urls.restaurants);
					}
				},
			});

			profileDropdown.render();
		}

		if (window.innerWidth > 480) {
			window.addEventListener('scroll', () => {
				if (window.scrollY > 20) {
					headerElement.classList.add('sticky');
				} else {
					headerElement.classList.remove('sticky');
				}
			});
		}
	}
}

export default Header;
