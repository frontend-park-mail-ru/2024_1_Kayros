import cartIcon from '../../assets/cart.svg';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
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
	 * Получение html компонента
	 */
	getHTML(user) {
		return template({ user: { address: user ? 'ул.Тверская, д.2' : '' } });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		let user = JSON.parse(localStorage.getItem('user-info'));

		this.parent.insertAdjacentHTML('afterbegin', this.getHTML(user));

		const logoBlock = document.getElementById('logoContainer');
		const logo = new Logo(logoBlock);
		logo.render();

		const searchBlock = document.getElementById('searchInput');
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
				content: '300 ₽',
				icon: cartIcon,
			});

			cartButton.render();
		}

		const profileBlock = document.getElementById('profile-block');

		if (user) {
			const profile = new Profile(profileBlock);
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
			if (window.scrollY > 26) {
				headerElement.className = 'sticky';
			} else {
				headerElement.className = '';
			}
		});
	}
}

export default Header;
