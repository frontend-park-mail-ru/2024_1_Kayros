import cartIcon from '../../assets/cart.svg';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import { localStorageHelper } from '../../utils';
import Button from '../Button';
import Input from '../Input';
import Logo from '../Logo/Logo';
import Profile from '../Profile';
import template from './Header.hbs';
import './Header.scss';

/**
 * Шапка
 */
class Header {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.parent = parent;
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
	 * Получение данных пользователя
	 */
	async userData() {
		await api.getUserInfo(this.handleUserData);
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		this.parent.insertAdjacentHTML('afterbegin', template());

		const logoBlock = document.getElementById('logoContainer');
		const logo = new Logo(logoBlock);
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

		const address = document.getElementById('address');
		address.innerHTML = user ? 'Тверская, д. 21' : '';

		if (user?.cart && user.cart.total > 0) {
			const cartBlock = document.getElementById('cart');
			const cartButton = new Button(cartBlock, {
				id: 'cart-button',
				content: `${user.cart.total} ₽`,
				icon: cartIcon,
			});

			cartButton.render();
		}

		const profileBlock = document.getElementById('profile-block');

		if (user) {
			const profile = new Profile(profileBlock, { user });
			profile.render();
		} else {
			const loginButton = new Button(profileBlock, {
				id: 'header-login-button',
				content: 'Войти',
				onClick: () => router.navigate(urls.signIn),
			});

			loginButton.render();
		}

		const headerElement = document.getElementById('header');

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
