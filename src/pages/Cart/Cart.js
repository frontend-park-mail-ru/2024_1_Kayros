import Button from '../../components/Button/Button';
import api from '../../modules/api';
import { router } from '../../modules/router';
import template from './Cart.hbs';
import Dishes from './components/Dishes/Dishes';
import PayForm from './components/PayForm/PayForm';
import './Cart.scss';

/**
 * Страница корзины
 */
class Cart {
	#parent;

	/**
	 * Создает экземпляр
	 * @param {HTMLDivElement} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
	}

	/**
	 * Отрисовка данных корзины
	 * @param {object} data - информация о ресторане
	 */
	renderData(data) {
		const dishesBlock = this.#parent.querySelector('.cart__dishes');
		const backButtonBlock = this.#parent.querySelector('.cart__back-button');

		const backButton = new Button(backButtonBlock, {
			id: 'back-button',
			icon: 'back-arrow-full',
			content: 'Назад',
			position: 'afterbegin',
			onClick: () => router.back(),
		});

		backButton.render();

		const dishesListing = new Dishes(dishesBlock, data?.food);
		dishesListing.render();

		const payForm = this.#parent.querySelector('.cart__pay-form');
		const form = new PayForm(payForm, data);
		form.render();
	}

	/**
	 * Получение информации о корзине
	 */
	getData() {
		api.getCartInfo(this.renderData.bind(this));
	}

	/**
	 * Рендер страницы
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template());

		this.getData();
	}
}

export default Cart;
