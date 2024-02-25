import CartButton from '../CartButton';
import Input from '../Input';
import template from './Header.hbs';
import './styles.scss';

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
		return template({ address: 'ул.Тверская, д.2', userName: 'Роман' });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const headerContent = document.getElementById('headerContent');

		const searchInput = new Input(headerContent, 'afterbegin', 'Рестораны, еда', false, 'Найти');
		searchInput.render();

		const addressBlock = document.getElementById('address');

		const cartButton = new CartButton(addressBlock, 300);
		cartButton.render();
	}
}

export default Header;
