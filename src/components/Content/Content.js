import api from '../../modules/api';
import urls from '../../routes/urls';
import OrderStatusPanel from '../OrderStatusPanel/OrderStatusPanel';
import SlickSlider from '../SlickSlider/SlickSlider';
import template from './Content.hbs';
import './Content.scss';

/**
 * Контент
 */
class Content {
	#parent;
	#withoutPadding;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {boolean} params.withoutPadding - отключить отступы
	 */
	constructor(parent, { withoutPadding = false } = {}) {
		this.#parent = parent;
		this.#withoutPadding = withoutPadding;
		this.dragTime = 0;
		this.indentLeft = 0;
	}

	/**
	 * Отрисовка статусов заказов
	 * @param {Array} items - массив заказов
	 */
	renderOrders(items) {
		const content = document.querySelector('.content');

		const slickSlider = new SlickSlider(content);
		slickSlider.render();

		const slickTrack = content.querySelector('.slick-track');

		if (!items) {
			return;
		}

		items.forEach((item) => {
			const orderPanel = new OrderStatusPanel(slickTrack, item);
			orderPanel.render();
		});
	}

	/**
	 *
	 */
	async getOrdersData() {
		await api.getOrdersData(this.renderOrders.bind(this));
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		this.#parent.insertAdjacentHTML('beforeend', template());
		const content = document.querySelector('.content');

		if (this.#withoutPadding) {
			content.classList.add('content--no-padding');
		}

		if (window.location.pathname.includes(urls.restaurants)) {
			await this.getOrdersData(content);
		}
	}
}

export default Content;
