import { ORDER_STATUSES } from '../../constants';
import { router } from '../../modules/router';
import Button from '../Button';
import template from './OrderStatusPanel.hbs';
import './OrderStatusPanel.scss';

/**
 * Панель со статусом заказа
 */
class OrderStatusPanel {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} info - информация о заказе
	 */
	constructor(parent, info) {
		this.#parent = parent;
		this.info = info;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.info.status = ORDER_STATUSES[this.info.status];

		this.#parent.insertAdjacentHTML('beforeend', template(this.info));

		const order = document.querySelector(`#order-panel-${this.info.id}`);
		const buttonContainer = order.querySelector('.order-panel__button');
		const button = new Button(buttonContainer, {
			id: 'order-status-button',
			icon: 'right-arrow-full',
			style: 'clear',
			onClick: () => {
				router.navigate(`orders/${this.info.id}`, { pageTitle: `Заказ №${this.info.id}` });
			},
		});

		button.render();
	}
}

export default OrderStatusPanel;
