import Layout from '../../components/Layout';
import Restaurants from '../../components/Restaurants';
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

		const restaurants = new Restaurants();
		restaurants.render();
	}
}

export default MainPage;
