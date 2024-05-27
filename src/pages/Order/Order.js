import Button from '../../components/Button';
import DishCard from '../../components/DishCard';
import Input from '../../components/Input/Input';
import Modal from '../../components/Modal/Modal';
import Stepper from '../../components/Stepper/Stepper';
import { ORDER_STATUSES } from '../../constants';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import feedbackTemplate from './FeedBack.hbs';
import template from './Order.hbs';
import './FeedBack.scss';
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
	 * @param {string} params.className - className заказа
	 */
	constructor(parent, { id, className = '' }) {
		this.#parent = parent;
		this.id = id;
		this.order = {};
		this.fetchInterval = '';
		this.rating = 0;
		this.text = '';
		this.className = className;
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
	 *
	 * @param {string} timestamp - строка
	 * @returns {string} - отформатированная строка
	 */
	formatDate(timestamp) {
		const timeDate = new Date(timestamp);

		const date = timeDate.toLocaleDateString('ru-RU');
		const time = timeDate.toLocaleTimeString('ru-RU').split(':').slice(0, 2).join(':');

		return `${date} в ${time}`;
	}

	/**
	 *
	 */
	renderFeedback() {
		const modal = new Modal({
			content: feedbackTemplate(),
			className: 'feedback-modal',
			initiatorId: 'order-review-button',
		});

		modal.render();

		const feedBack = document.querySelector('.feedback');
		const feedBackComment = feedBack.querySelector('.feedback__comment');
		const feedBackStars = feedBack.querySelector('.feedback__rating');

		for (let i = 0; i < 5; i++) {
			const button = new Button(feedBackStars, {
				id: 'feedback-star-button',
				icon: 'rating-icon-default',
				style: 'clear',
			});

			button.render();
		}

		const stars = feedBackStars.querySelectorAll('.feedback-star-button-img');
		const buttons = feedBackStars.querySelectorAll('#feedback-star-button');

		buttons.forEach((star, i) => {
			star.onmouseover = () => {
				for (let j = 0; j <= i; j++) {
					stars[j].src = 'assets/rating-icon.svg';
				}

				for (let j = i + 1; j < 5; j++) {
					stars[j].src = 'assets/rating-icon-default.svg';
				}
			};

			star.onmouseleave = () => {
				for (let j = 0; j < this.rating; j++) {
					stars[j].src = 'assets/rating-icon.svg';
				}

				for (let j = this.rating; j <= i; j++) {
					stars[j].src = 'assets/rating-icon-default.svg';
				}
			};

			star.onclick = () => {
				this.rating = i + 1;

				for (let j = 0; j < this.rating; j++) {
					stars[j].src = 'assets/rating-icon.svg';
				}

				for (let j = this.rating; j < 5; j++) {
					stars[j].src = 'assets/rating-icon-default.svg';
				}
			};
		});

		const textarea = new Input(feedBackComment, {
			id: 'feedback-comment-area',
			placeholder: 'Комментарий',
			onChange: (event) => {
				this.text = event.target.value;
			},
			textarea: true,
		});

		textarea.render();

		const submitButton = new Button(feedBack, {
			id: 'feedback-submit-button',
			content: 'Отправить',
			onClick: () => {
				api.sendFeedback(this.order.restaurant_id, { order_id: Number(this.id), text: this.text, rating: this.rating });
				const reviewButton = document.querySelector('#order-review-button');
				reviewButton.style.display = 'none';
				modal.close();
			},
		});

		submitButton.render();
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		await this.getData();

		if (!this.order || !this.order.id) {
			this.#parent.insertAdjacentHTML('beforeend', template());
			return;
		}

		if (this.order.created_at) {
			this.order.created_at = `Создан ${this.formatDate(this.order.created_at)}`;
		} else {
			this.order.created_at = 'Ожидание ответа от ресторана ...';
		}

		this.order.status = ORDER_STATUSES[this.order.status];

		this.#parent.insertAdjacentHTML('beforeend', template({ ...this.order, className: this.className }));

		if (!this.order.commented) {
			const reviewContainer = this.#parent.querySelector('.order__review');
			const reviewButton = new Button(reviewContainer, {
				id: 'order-review-button',
				content: 'Оставить отзыв',
				size: 's',
				onClick: () => {
					this.renderFeedback();
				},
			});

			reviewButton.render();
		}

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

				if (data.created_at) {
					const date = this.#parent.querySelector('.order__create-time');
					date.innerHTML = `Создан ${this.formatDate(data.created_at)}`;
				}

				status.innerHTML = ORDER_STATUSES[data.status];

				statusBar.active = STEPS.findIndex((val) => val === ORDER_STATUSES[data.status]) + 1;
				statusBar.rerender();
			});
		}, 5000);
	}
}

export default Order;
