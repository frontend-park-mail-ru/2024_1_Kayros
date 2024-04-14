import Button from '../../../../components/Button';
import CounterButton from '../../../../components/CounterButton';
import Modal from '../../../../components/Modal/Modal';
import api from '../../../../modules/api';
import { router } from '../../../../modules/router';
import urls from '../../../../routes/urls';
import { localStorageHelper } from '../../../../utils';
import template from './FoodCard.hbs';
import modalTemplate from './NeedAuthModal.hbs';
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
	 */
	constructor(parent, data, count) {
		this.parent = parent;
		this.data = data;
		this.added = false;
		this.count = count;
	}

	/**
	 * Открытие модалки, если пользователь не авторизован
	 */
	openModal() {
		const modal = new Modal({ content: modalTemplate(), className: 'food-card-modal', closeButton: false });
		modal.render();

		const modalContent = document.querySelector('.no-auth');

		const authButton = new Button(modalContent, {
			id: 'no-auth-go-button',
			content: 'Войти',
			onClick: () => {
				modal.close();
				router.navigate(urls.signIn);
			},
		});

		authButton.render();

		const backButton = new Button(modalContent, {
			id: 'no-auth-back-button',
			icon: 'back-arrow-full',
			content: 'Назад',
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
		const res = await api.addToCart(id);

		const cart = document.getElementById('cart-button');
		const sum = cart.querySelector('span');

		if (res === 0) {
			cart.className = 'btn btn-secondary';
			sum.innerHTML = '';
		} else {
			cart.className = 'btn btn-primary';
			sum.innerHTML = `${res || 0} ₽`;
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
		const sum = cart.querySelector('span');

		if (res === 0) {
			cart.className = 'btn btn-secondary';
			sum.innerHTML = '';
		} else {
			cart.className = 'btn btn-primary';
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
		const sum = cart.querySelector('span');

		if (res === 0) {
			cart.className = 'btn btn-secondary';
			sum.innerHTML = '';
		} else {
			cart.className = 'btn btn-primary';
			sum.innerHTML = `${res || 0} ₽`;
		}

		return res;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		const user = localStorageHelper.getItem('user-info');

		this.parent.insertAdjacentHTML('beforeend', template(this.data));

		const food = document.getElementById(`food-${this.data.id}`);

		const action = food.querySelector('#food-action');

		const counterButton = new CounterButton(action, {
			id: `food-button-${this.data.id}`,
			productId: this.data.id,
			initCount: this.count,
			addCount: user ? this.addFood : this.openModal,
			removeCount: user ? this.removeCount : this.openModal,
			updateCount: user ? this.updateCartCount : this.openModal,
		});

		counterButton.render();
	}
}

export default FoodCard;
