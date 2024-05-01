import Button from '../../components/Button';
import DishCard from '../../components/DishCard';
import Stepper from '../../components/Stepper/Stepper';
import { ORDER_STATUSES } from '../../constants';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
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

		this.order.status = ORDER_STATUSES[this.order.status];

		this.#parent.insertAdjacentHTML('beforeend', template(this.order));

		const buttonContainer = this.#parent.querySelector('.order__button-container');
		const backButton = new Button(buttonContainer, {
			id: 'order-back-button',
			icon: 'back-arrow-full',
			content: 'Все рестораны',
			onClick: () => router.navigate(urls.restaurants),
		});

		backButton.render();

		const statusBarContainer = this.#parent.querySelector('.order__status-bar');

		const statusBar = new Stepper(statusBarContainer, { steps: ['Создан', 'Собирается', 'В пути', 'Получен'] });
		statusBar.render();

		const foods = this.#parent.querySelector('.order__food');
		this.order.food.forEach((dish) => {
			const dishCard = new DishCard(foods, dish, { addCounter: false });
			dishCard.render();
		});
	}
}

export default Order;
