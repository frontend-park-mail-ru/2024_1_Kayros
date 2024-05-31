import Button from '../../components/Button';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import template from './Statistic.hbs';
import './Statistic.scss';

/**
 * Класс спользуется для отображения сообщения об отсутствии страницы или ресурса.
 */
class Statistic {
	#parent;

	/**
	 * Создает экземпляр страницы NotFound.
	 * @param {HTMLDivElement} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
		this.data = {};
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
	async render() {
		await this.getData();

		const html = template({ data: this.data });
		this.#parent.insertAdjacentHTML('beforeend', html);
		new Button(document.querySelector('.statistic__return-button'), {
			id: 'return-to-home',
			content: 'Вернуться на главную',
			onClick: () => {
				router.navigate(urls.restaurants);
			},
		}).render();
	}
}

export default Statistic;
