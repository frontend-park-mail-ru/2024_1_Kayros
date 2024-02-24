import Layout from '../../components/Layout';
import template from './MainPage.hbs';
import './styles.scss';

/**
 * Главная страница
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
	 * Рендеринг страницы
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template());

		const main = document.getElementById('main');

		const layout = new Layout(main);
		layout.render();
	}
}

export default MainPage;
