import { router } from '../../modules/router';
import urls from '../../routes/urls';
import Button from '../Button';
import template from './Layout.hbs';
import './Layout.scss';

/**
 * Макет
 */
class Layout {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template());

		const formButton = new Button(this.#parent, {
			id: 'csat-form-button',
			content: 'Пройдите опрос',
			onClick: () => {
				router.navigate(urls.csatForm);
			},
		});

		formButton.render();
	}
}

export default Layout;
