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
		return template({ address: 'ул.Тверская, д.2' });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const headerContent = document.getElementById('headerContent');

		const searchInput = new Input(headerContent, 'afterbegin', 'Рестораны, еда', false, 'Найти');
		searchInput.render();
	}
}

export default Header;
