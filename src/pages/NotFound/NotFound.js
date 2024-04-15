import Button from '../../components/Button';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import template from './NotFound.hbs';
import './NotFound.scss';

/**
 * Класс спользуется для отображения сообщения об отсутствии страницы или ресурса.
 */
class NotFound {
	#parent;

	/**
	 * Создает экземпляр страницы NotFound.
	 * @param {HTMLDivElement} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
	}
	/**
	 * Рендер страницы.
	 */
	render() {
		const html = template();
		this.#parent.insertAdjacentHTML('beforeend', html);
		new Button(document.querySelector('.not-found__return-button'), {
			id: 'return-to-home',
			content: 'Вернуться на главную',
			onClick: () => {
				router.navigate(urls.restaurants);
			},
		}).render();
	}
}

export default NotFound;
