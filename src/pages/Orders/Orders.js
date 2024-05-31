import Button from '../../components/Button';
import { ORDER_STATUSES } from '../../constants/index.js';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import Order from '../Order/index.js';
import template from './Orders.hbs';
import './Orders.scss';

/**
 * Класс используется для отображения списка заказов.
 */
class Orders {
	#parent;
	#activeOrderId;

	/**
	 * Создает экземпляр страницы Orders.
	 * @param {HTMLDivElement} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
		this.#activeOrderId = null;
	}

	/**
	 * Создает блок с заказом на странице Orders.
	 * @param {number} id - id заказа
	 */
	renderOrder(id) {
		const orderContainer = this.#parent.querySelector('.order-wrapper');

		orderContainer.innerHTML = '';

		new Order(orderContainer, { id, className: 'order-in-orders' }).render();

		if (this.#activeOrderId !== null) {
			document.querySelector(`#order-${this.#activeOrderId}`).classList.remove('order-card--active');
		}

		this.#activeOrderId = id;
		document.querySelector(`#order-${id}`).classList.add('order-card--active');
	}

	/**
	 * Рендер страницы.
	 */
	async render() {
		const data = await api.getUserOrdersArchive();

		// Форматирование данных
		const formattedData =
			data?.map((order) => ({
				...order,
				status: ORDER_STATUSES[order.status],
				status_class: order.status,
				formattedTime: this.formatDate(order.time),
			})) || [];

		const html = template({ data: formattedData });
		this.#parent.innerHTML = html;

		// Создание кнопок для каждой карточки заказа
		formattedData.forEach((order) => {
			new Button(document.querySelector(`#view-order-${order.id}`), {
				id: `view-order-button-${order.id}`,
				icon: 'right-arrow-full',
				style: 'clear-back-mobile',
				content: '',
				onClick: () => {
					if (window.innerWidth > 900) {
						this.renderOrder(order.id);
					} else {
						router.navigate(`${urls.orders}/${order.id}`);
					}
				},
			}).render();
		});

		if (window.innerWidth > 900 && formattedData.length > 0) {
			this.renderOrder(formattedData[0]?.id);
		}
	}

	/**
	 * Преобразует статус заказа в CSS-класс.
	 * @param {string} status - Статус заказа.
	 * @returns {string} CSS-класс для статуса заказа.
	 */
	getStatusClass(status) {
		switch (status.toLowerCase()) {
		case 'delivered':
			return 'delivered';
		case 'cooking':
			return 'cooking';
		case 'on the way':
			return 'on-the-way';
		default:
			return '';
		}
	}

	/**
	 * Форматирует дату в строку формата 'день.месяц.год'.
	 * @param {string} dateString - Дата в виде строки.
	 * @returns {string} Отформатированная дата.
	 */
	formatDate(dateString) {
		const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
		return new Date(dateString).toLocaleDateString('ru-RU', options);
	}
}

export default Orders;
