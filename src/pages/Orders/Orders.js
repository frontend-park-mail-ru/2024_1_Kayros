import Button from '../../components/Button';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import template from './Orders.hbs';
import './Orders.scss';

/**
 * Класс используется для отображения списка заказов.
 */
class Orders {
	#parent;

	/**
	 * Создает экземпляр страницы Orders.
	 * @param {HTMLDivElement} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
	}

	/**
	 * Рендер страницы.
	 */
	async render() {
		const data = await new Promise((resolve) => {
			api.getUserOrdersArchive(resolve);
		});

		// Форматирование данных
		const formattedData = data.map(order => ({
			...order,
			status_class: this.getStatusClass(order.status),
			formattedTime: this.formatDate(order.time)
		}));

		const html = template({ data: formattedData });
		this.#parent.innerHTML = html;
        
		// Создание кнопок для каждой карточки заказа
		formattedData.forEach(order => {
			new Button(document.querySelector(`#view-order-${order.id}`), {
				id: `view-order-button-${order.id}`,
				icon: 'right-arrow-full',
				style: 'clear-back-mobile',
				content: '',
				onClick: () => {
					router.navigate(`${urls.orders}/${order.id}`);
				},
			}).render();
		});

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
		case 'created':
			return 'created';
		case 'cooking':
			return 'cooking';
		case 'on the way':
			return'on-the-way';
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
