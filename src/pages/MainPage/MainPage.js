import template from './MainPage.hbs';
import './styles.scss';

/**
 * Главная страница (например)
 */
class MainPage {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.parent = parent;
	}

	/**
	 * Получение html страницы
	 */
	getHTML() {
		return template({ content: 'MainPageExample' });
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.parent.innerHTML = '';
		const html = this.getHTML();
		this.parent.insertAdjacentHTML('beforeend', html);
	}
}

export default MainPage;
