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
			content: `${data?.sum || 0} ₽`,
			icon: 'cart',
			style: data?.sum === 0 ? 'secondary' : 'primary',
			onClick: () => this.navigate(urls.cart),
		});

		cartButton.render();
	}

	/**
	 * Получение данных пользователя
	 */
	async userData() {
		await api.getUserInfo(this.handleUserData);
		api.getCartInfo(this.handleCartData.bind(this));
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		this.#parent.insertAdjacentHTML('afterbegin', template());

		const logoBlock = document.querySelector('.logo');
		const logo = new Logo(logoBlock, { onClick: () => this.navigate(urls.restaurants) });
		logo.render();

		const searchBlock = this.#parent.querySelector('.header__search-input');
		const searchInput = new Input(searchBlock, {
			id: 'restaurants-search',
			placeholder: 'Рестораны, еда',
			button: 'Найти',
		});

		searchInput.render();

		await this.userData();
		const user = localStorageHelper.getItem('user-info');

		const addressBlock = document.querySelector('.header__address');
		const addressButton = new Button(addressBlock, {
			id: 'address-button',
			onClick: () => {
				this.navigate(urls.address);
			},
			content: user?.address || 'Укажите адрес доставки',
			icon: user?.address ? '' : 'address',
			style: user?.address ? 'secondary' : 'primary',
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

		const profile = document.getElementById('profile');

		if (profile) {
			const profileDropdown = new ProfileDropdown(profile, {
				id: 'profile-dropdown-profile',
				navigate: this.navigate,
				onExit: () => {
					headerElement.remove();
					this.render();

					this.navigate(urls.restaurants);
				},
			});

			profileDropdown.render();
		}

		window.addEventListener('scroll', () => {
			if (window.scrollY > 20) {
				headerElement.classList.add('sticky');
			} else {
				headerElement.classList.remove('sticky');
			}
		});
	}
}

export default Header;
