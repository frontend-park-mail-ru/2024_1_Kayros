import api from '../../modules/api';
import urls from '../../routes/urls';
import { localStorageHelper } from '../../utils';
import Button from '../Button';
import Dropdown from '../Dropdown';
import Input from '../Input';
import Logo from '../Logo';
import Profile from '../Profile';
import template from './Header.hbs';
import './Header.scss';

/**
 * Шапка
 */
class Header {
	#parent;
	#navigate;

	/**
	 * Конструктор класса
	 * @param {object} params - параметры
	 * @param {void} params.navigate - функция навигации по страницам
	 */
	constructor({ navigate }) {
		this.#navigate = navigate;
		this.#parent = document.getElementById('layout');
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
		if (!data || data.sum === 0) {
			return;
		}

		const cartBlock = document.getElementById('cart');
		const cartButton = new Button(cartBlock, {
			id: 'cart-button',
			content: `${data?.sum} ₽`,
			icon: 'cart',
			onClick: () => {
				this.#navigate(urls.cart);
			},
		});

		cartButton.render();
	}

	/**
	 * Получение данных пользователя
	 */
	async userData() {
		await api.getUserInfo(this.handleUserData);
		await api.getCartInfo(this.handleCartData);
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		this.#parent.insertAdjacentHTML('afterbegin', template());

		const logoBlock = document.getElementById('logo-container');
		const logo = new Logo(logoBlock, { onClick: () => this.#navigate(urls.restaurants) });
		logo.render();

		const searchBlock = document.getElementById('search-input');
		const searchInput = new Input(searchBlock, {
			id: 'restaurants-search',
			placeholder: 'Рестораны, еда',
			button: 'Найти',
		});

		searchInput.render();

		await this.userData();
		const user = localStorageHelper.getItem('user-info');

		const addressBlock = document.getElementById('address');
		const addressButton = new Button(addressBlock, {
			id: 'address-button',
			onClick: () => {
				this.#navigate(urls.address);
			},
			content: user?.address || 'Укажите адрес доставки',
			icon: user?.address ? '' : 'address',
			style: user?.address ? 'secondary' : 'primary',
		});

		addressButton.render();

		const profileBlock = document.getElementById('profile-block');

		if (user) {
			const profile = new Profile(profileBlock, { user });
			profile.render();
		} else {
			const loginButton = new Button(profileBlock, {
				id: 'header-login-button',
				content: 'Войти',
				onClick: () => this.#navigate(urls.signIn),
			});

			loginButton.render();
		}

		const headerElement = document.getElementById('header');

		const profile = document.getElementById('profile');

		if (profile) {
			const dropdown = new Dropdown(profile, {
				id: 'dropdown-profile',
				navigate: this.#navigate,
				onExit: () => {
					headerElement.remove();
					this.render();

					this.#navigate(urls.restaurants);
				},
			});

			dropdown.render();
		}

		window.addEventListener('scroll', () => {
			if (window.scrollY > 20) {
				headerElement.className = 'sticky';
			} else {
				headerElement.className = '';
			}
		});
	}
}

export default Header;
