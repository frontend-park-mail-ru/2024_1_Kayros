import cartIcon from '../../assets/cart.svg';
import Button from '../Button';
import Input from '../Input';
import Profile from '../Profile';
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

		const searchBlock = document.getElementById('searchInput');
		const searchInput = new Input(searchBlock, { placeholder: 'Рестораны, еда', button: 'Найти' });
		searchInput.render();

		if (user.cart.total > 0) {
			const cartBlock = document.getElementById('cart');
			const cartButton = new Button(cartBlock, { content: `${user.cart.total} ₽`, icon: cartIcon });
			cartButton.render();
		}

		const profileBlock = document.getElementById('profileBlock');

		if (user) {
			const profile = new Profile(profileBlock);
			profile.render();
		} else {
			const loginButton = new Button(profileBlock, { content: 'Войти' });
			loginButton.render();
		}
	}
}

export default Header;
