import { router } from '../../modules/router';
import urls from '../../routes/urls';
import template from './Logo.hbs';
import './Logo.scss';

/**
 * Логотип
 */
class Logo {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.parent = parent;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template());

		const logoBlock = document.getElementById('logo');

		/**
		 * Обработка нажатия на лого
		 */
		logoBlock.addEventListener('click', () => {
			router.navigate(urls.restaurants);
		});
	}
}

export default Logo;
