import cartIcon from '../../assets/cart.svg';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import { localStorageHelper } from '../../utils';
import Button from '../Button';
import Dropdown from '../Dropdown/Dropdown';
import Input from '../Input';
import Logo from '../Logo';
import Profile from '../Profile';
import template from './Header.hbs';
import './Header.scss';

/**
 * Шапка
 */
class Header {
	/**
	 * Конструктор класса
	 */
	constructor() {
		this.parent = document.getElementById('layout');
	}

	/**
	 * Получение html компонента
	 * @param {object} user - информация о пользователе
	 * @returns {HTMLDivElement} - html
	 */
	getHTML(user) {
		return template({ user: { address: user ? 'ул.Тверская, д.2' : '' } });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		const user = localStorageHelper.getItem('user-info');

		this.parent.insertAdjacentHTML('afterbegin', this.getHTML(user));

		const logoBlock = document.getElementById('logo-container');
		const logo = new Logo(logoBlock);
		logo.render();

		const searchBlock = document.getElementById('search-input');
		const searchInput = new Input(searchBlock, {
			id: 'restaurants-search',
			placeholder: 'Рестораны, еда',
			button: 'Найти',
		});

		searchInput.render();

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

		const profile = document.getElementById('profile');

		if (profile) {
			const dropdown = new Dropdown(profile, {
				id: 'dropdown-profile',
				onExit: () => {
					headerElement.remove();
					this.render();
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
