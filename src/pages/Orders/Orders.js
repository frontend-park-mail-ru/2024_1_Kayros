import Button from '../../components/Button';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import template from './Orders.hbs';
import './Orders.scss';

/**
 * Класс спользуется для отображения сообщения об отсутствии страницы или ресурса.
 */
class Orders {
	#parent;

	/**
	 * Создает экземпляр страницы NotFound.
	 * @param {HTMLDivElement} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
	}

	/**
	 * Получение данных о ресторанах
	 */
	async getData() {
		await api.getCSATAnswers((data) => {
			this.data = data;
		});
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

export default Orders;
