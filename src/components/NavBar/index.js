import template from './NavBar.hbs';
import './styles.scss';

const links = [
	{ name: 'Рестораны', active: true },
	{ name: 'Еда', active: false },
];

/**
 * Навигационная панель
 */
class NavBar {
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
		return template({ links });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());
	}
}

export default NavBar;
