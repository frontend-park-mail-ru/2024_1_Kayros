import Button from '../../../../components/Button';
import CounterButton from '../../../../components/CounterButton';
import Modal from '../../../../components/Modal/Modal';
import api from '../../../../modules/api';
import { router } from '../../../../modules/router';
import urls from '../../../../routes/urls';
import { localStorageHelper } from '../../../../utils';
import clearCartModalTemplate from './ClearCartModal.hbs';
import template from './FoodCard.hbs';
import authModalTemplate from './NeedAuthModal.hbs';
import './FoodCard.scss';

/**
 * Карточка блюда
 */
class FoodCard {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} data - информация о еде
	 * @param {number} count - количество блюд в корзине
	 * @param {object} cart - информация о корзине
	 */
	constructor(parent, data, count, cart) {
		this.parent = parent;
		this.data = data;
		this.added = false;
		this.count = count;
		this.cart = cart;
	}

	/**
	 * Открытие модалки с возможностью очистки корзины
	 */
	async openClearCartModal() {
		return new Promise((resolve, reject) => {
			const modal = new Modal({
				content: clearCartModalTemplate(),
				className: 'food-card-modal',
				closeButton: false,
				closeOnClick: false,
			});

			modal.render();

			const modalContent = document.querySelector('.food-card-modal');

			const authButton = new Button(modalContent, {
				id: 'food-modal-accept-button',
				content: 'Продолжить',
				onClick: async () => {
					modal.close();
					const result = await api.clearCart();

					this.cart.restaurant_id = 0;

					if (result) {
						resolve(true);
					} else {
						reject();
					}
				},
			});

			authButton.render();

			const backButton = new Button(modalContent, {
				id: 'food-modal-back-button',
				content: 'Отменить',
				onClick: () => {
					modal.close();
					reject();
				},
			});

			backButton.render();
		});
	}

	/**
	 * Открытие модалки, если пользователь не авторизован
	 */
	openAuthModal() {
		const modal = new Modal({ content: authModalTemplate(), className: 'food-card-modal', closeButton: false });
		modal.render();

		const modalContent = document.querySelector('.food-card-modal');

		const authButton = new Button(modalContent, {
			id: 'food-modal-accept-button',
			content: 'Войти',
			onClick: () => {
				modal.close();
				router.navigate(urls.signIn);
			},
		});

		authButton.render();

		const backButton = new Button(modalContent, {
			id: 'food-modal-back-button',
			content: 'Отменить',
			onClick: () => modal.close(),
		});

		backButton.render();
	}

	/**
	 * Добавление блюда в корзину
	 * @param {number} id - id блюда
	 * @returns {number} результат
	 */
	async addFood(id) {
		const cart = document.getElementById('cart-button');
		if (!cart) return;

		const res = await api.addToCart(id);

		const sum = cart.querySelector('span');

		if (res === 0) {
			cart.className = 'btn btn--secondary';
			sum.innerHTML = '';
		} else {
			cart.className = 'btn btn--primary';
			sum.innerHTML = res ? `${res} ₽` : '';
		}

		return res;
	}

	/**
	 * Удаление блюда из корзины
	 * @param {number} id - id блюда
	 * @returns {number} результат
	 */
	async removeCount(id) {
		const res = await api.removeFromCart(id);

		const cart = document.getElementById('cart-button');
		if (!cart) return;

		const sum = cart.querySelector('span');

		if (!res) {
			cart.className = 'btn btn--secondary';
		} else {
			cart.className = 'btn btn--primary';
			sum.innerHTML = `${res || 0} ₽`;
		}

		return res;
	}

	/**
	 * Обновление количества блюд в корзине
	 * @param {object} params - параметры
	 * @param {number} params.id - id блюда
	 * @param {number} params.count - новое количество
	 * @returns {number} результат
	 */
	async updateCartCount({ id, count }) {
		const res = await api.updateCartCount({ food_id: id, count });

		const cart = document.getElementById('cart-button');
		if (!cart) return;

		const sum = cart.querySelector('span');

		if (!res) {
			cart.className = 'btn btn--secondary size-xs';
		} else {
			cart.className = 'btn btn--primary size-xs';
			sum.innerHTML = `${res || 0} ₽`;
		}

		return res;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template(this.data));

		const food = document.getElementById(`food-${this.data.id}`);

		const action = food.querySelector('.food-card__action');

		const counterButton = new CounterButton(action, {
			id: `food-button-${this.data.id}`,
			productId: this.data.id,
			initCount: this.count,
			addCount: async (id) => {
				const user = localStorageHelper.getItem('user-info');

				if (!user) {
					this.openAuthModal();
					return;
				}

				if (!user.address) {
					router.navigate(urls.address);
					return;
				}

				if (this.cart?.restaurant_id > 0 && this.data.restaurant !== this.cart?.restaurant_id) {
					try {
						const res = await this.openClearCartModal(id);

						if (!res) {
							return;
						}
					} catch {
						return;
					}
				}

				return this.addFood(id);
			},
			removeCount: (id) => {
				const user = localStorageHelper.getItem('user-info');

				if (!user) {
					this.openAuthModal();
					return;
				}

				if (!user.address) {
					router.navigate(urls.address);
					return;
				}

				return this.removeCount(id);
			},
			updateCount: (data) => {
				const user = localStorageHelper.getItem('user-info');

				if (!user) {
					this.openAuthModal();
					return;
				}

				if (!user.address) {
					router.navigate(urls.address);
					return;
				}

				return this.updateCartCount(data);
			},
		});

		counterButton.render();
	}
}

export default FoodCard;
