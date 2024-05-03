import Button from '../../components/Button';
import DishCard from '../../components/DishCard';
import Stepper from '../../components/Stepper/Stepper';
import { ORDER_STATUSES } from '../../constants';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import template from './Order.hbs';
import './Order.scss';

const STEPS = ['Создан', 'Готовится', 'В пути', 'Доставлен'];

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
		this.fetchInterval = '';
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

		const statusBar = new Stepper(statusBarContainer, {
			steps: STEPS,
			active: STEPS.findIndex((val) => val === this.order.status) + 1,
		});

		statusBar.render();

		const foods = this.#parent.querySelector('.order__food');
		this.order.food.forEach((dish) => {
			const dishCard = new DishCard(foods, dish, { addCounter: false });
			dishCard.render();
		});

		if (statusBar.active === STEPS.length) {
			return;
		}

		this.fetchInterval = setInterval(() => {
			api.getOrderInfo(this.id, (data) => {
				if (
					statusBar.active === STEPS.length ||
					window.location.pathname !== urls.order.replace(':id', this.order.id)
				) {
					clearInterval(this.fetchInterval);
					return;
				}

				const status = this.#parent.querySelector('.order__status-name');
				status.innerHTML = ORDER_STATUSES[data.status];
				statusBar.active = STEPS.findIndex((val) => val === ORDER_STATUSES[data.status]) + 1;
				statusBar.rerender();
			});
		}, 3000);
	}
}

export default Order;
