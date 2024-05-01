import BackButton from '../../components/BackButton';
import Stepper from '../../components/Stepper/Stepper';
import api from '../../modules/api';
import { router } from '../../modules/router';
import template from './Order.hbs';
import './Order.scss';

/**
 * Страница заказа
 */
class Order {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры
	 * @param {number} params.id - id заказа
	 */
	constructor(parent, { id }) {
		this.#parent = parent;
		this.id = id;
		this.order = {};
	}

	/**
	 * Получение информации о ресторане
	 */
	async getData() {
		await api.getOrderInfo(this.id, (data) => {
			this.order = data;
		});
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		await this.getData();

		this.#parent.insertAdjacentHTML('beforeend', template(this.order));

		const buttonContainer = this.#parent.querySelector('.order__button-container');
		const backButton = new BackButton(buttonContainer, {
			id: 'order-back-button',
			icon: 'back-arrow-full',
			content: 'Вернуться',
			onClick: () => router.back(),
		});

		backButton.render();

		const statusBarContainer = this.#parent.querySelector('.order__status-bar');

		const statusBar = new Stepper(statusBarContainer, { steps: ['Создан', 'Собирается', 'В пути', 'Получен'] });
		statusBar.render();
	}
}

export default Order;
