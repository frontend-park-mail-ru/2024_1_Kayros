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
		this.#parent.insertAdjacentHTML('beforeend', template(this.info));

		const order = document.querySelector(`#order-panel-${this.info.id}`);
		const buttonContainer = order.querySelector('.order-panel__button');
		const button = new Button(buttonContainer, { id: 'order-status-button', icon: 'right-arrow-full', style: 'clear' });
		button.render();
	}
}

export default OrderStatusPanel;
