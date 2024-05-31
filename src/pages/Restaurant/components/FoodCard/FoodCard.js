import Button from '../../../../components/Button';
import CounterButton from '../../../../components/CounterButton';
import Modal from '../../../../components/Modal/Modal';
import api from '../../../../modules/api';
import { router } from '../../../../modules/router';
import urls from '../../../../routes/urls';
import { localStorageHelper, setCookieIfNotExist } from '../../../../utils';
import clearCartModalTemplate from './ClearCartModal.hbs';
import template from './FoodCard.hbs';
import authModalTemplate from './NeedAuthModal.hbs';
import { v4 as uuidv4 } from 'uuid';
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
		this.address = '';
	}

	/**
	 * Проверка и установка токена для неавторизованного пользователя
	 */
	checkUserToken() {
		const user = localStorageHelper.getItem('user-info');

		if (user) {
			return;
		}

		setCookieIfNotExist('unauth_id', uuidv4());
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
	openAddressModal() {
		const modal = new Modal({ content: authModalTemplate(), className: 'food-card-modal', closeButton: false });
		modal.render();

		const modalContent = document.querySelector('.food-card-modal');

		const authButton = new Button(modalContent, {
			id: 'food-modal-accept-button',
			content: 'Указать адрес',
			onClick: () => {
				modal.close();
				setTimeout(() => {
					router.navigate(urls.address);
				}, 100);
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
		this.checkUserToken();

		const cart = document.getElementById('cart-button');
		if (!cart) return;

		const res = await api.addToCart(id);

		const sum = cart.querySelector('span');

		if (!res) {
			cart.className = 'btn btn--secondary size-xs';
			sum.innerHTML = '';
		} else {
			cart.className = 'btn btn--primary size-xs';
			sum.innerHTML = res ? `${res} ₽` : '';
		}

		this.checkCartDataAndRenderButton();
		return res;
	}

	/**
	 * Удаление блюда из корзины
	 * @param {number} id - id блюда
	 * @returns {number} результат
	 */
	async removeCount(id) {
		this.checkUserToken();

		const res = await api.removeFromCart(id);

		const cart = document.getElementById('cart-button');
		if (!cart) return;

		const sum = cart.querySelector('span');

		if (!res) {
			cart.className = 'btn btn--secondary size-xs';
		} else {
			cart.className = 'btn btn--primary size-xs';
			sum.innerHTML = `${res || 0} ₽`;
		}

		this.checkCartDataAndRenderButton();
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
		this.checkUserToken();

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

		this.checkCartDataAndRenderButton();
		return res;
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		this.parent.insertAdjacentHTML('beforeend', template(this.data));

		const food = document.getElementById(`food-${this.data.id}`);

		const action = food.querySelector('.food-card__action');

		const counterButton = new CounterButton(action, {
			id: `food-button-${this.data.id}`,
			productId: this.data.id,
			initCount: this.count,
			maxCount: 99,
			prevCount: () => {
				const address = localStorageHelper.getItem('user-address').value;
				const user = localStorageHelper.getItem('user-info');

				if ((address === '' || !address) && !user?.address) {
					this.openAddressModal();
					return;
				}

				return true;
			},
			addCount: async (id) => {
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
				return this.removeCount(id);
			},
			updateCount: (data) => {
				return this.updateCartCount(data);
			},
		});

		counterButton.render();
	}

	/**
	 * Проверка данных корзины и отрисовка иконки корзины
	 */
	checkCartDataAndRenderButton() {
		api.getCartInfo((cartData) => {
			if (cartData) {
				this.renderCartIcon();
			} else {
				this.removeCartIcon();
			}
		});
	}

	/**
	 *
	 */
	renderCartIcon() {
		const cartBlockMobile = document.querySelector('.cart__mobile');
		let existingButton = document.getElementById('cart-button2');

		if (!existingButton) {
			const cartButtonMobile = new Button(cartBlockMobile, {
				id: 'cart-button2',
				content: '',
				icon: 'cart',
				style: 'primary',
				onClick: () => router.navigate(urls.cart),
			});

			cartButtonMobile.render();
		}
	}

	/**
	 *
	 */
	removeCartIcon() {
		const existingButton = document.getElementById('cart-button2');

		if (existingButton) {
			existingButton.remove();
		}
	}
}

export default FoodCard;
