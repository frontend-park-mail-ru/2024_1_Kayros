import cartIcon from '../../assets/cart.svg';
import Button from '../Button';
import Input from '../Input';
import template from './Header.hbs';
import './Header.scss';

const user = {
	name: 'Роман',
	cart: {
		total: 300,
	},
};

//const user = undefined;

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
	getHTML() {
		return template({ address: 'ул.Тверская, д.2', user: { name: user?.name } });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const headerContent = document.getElementById('headerContent');
		const searchInput = new Input(headerContent, 'afterbegin', 'Рестораны, еда', false, 'Найти');
		searchInput.render();

		if (user.cart.total > 0) {
			const cartBlock = document.getElementById('cart');
			const cartButton = new Button(cartBlock, { content: `${user.cart.total} ₽`, icon: cartIcon });
			cartButton.render();
		}

		if (user) return;

		const profileBlock = document.getElementById('profile');
		const loginButton = new Button(profileBlock, { content: 'Войти', onClick: () => alert('Login') });
		loginButton.render();
	}
}

export default Header;
