import Button from '../../../../components/Button';
import Input from '../../../../components/Input/Input';
import SlickSlider from '../../../../components/SlickSlider/SlickSlider';
import { FIELDS_ADRESS_FORM } from '../../../../constants';
import { validateApartNumber, validateEntranceNumber, validateFloorNumber } from '../../../../helpers/validation';
import api from '../../../../modules/api';
import { router } from '../../../../modules/router';
import urls from '../../../../routes/urls';
import { localStorageHelper } from '../../../../utils';
import Coupon from '../Coupon/Coupon';
import template from './PayForm.hbs';
import './PayForm.scss';

/**
 * Форма оплаты
 */
class PayForm {
	#parent;

	/**
	 * Создает экземпляр
	 * @param {HTMLDivElement} parent - родительский элемент
	 * @param {object} data - информация о корзине
	 */
	constructor(parent, data) {
		const extraAddressParts = data?.extra_address?.split(', ');

		this.#parent = parent;
		this.data = data;
		this.main = data?.address || '';
		this.apart = extraAddressParts?.[0] || '';
		this.entrance = extraAddressParts?.[1] || '';
		this.floor = extraAddressParts?.[2] || '';
		this.user = '';
	}

	/**
	 *
	 */
	async handleSubmit() {
		const loaderBlock = this.#parent.querySelector('.btn__loader');
		loaderBlock.classList.add('btn__loader--loading');

		const mainInput = this.#parent.querySelector('#main-address');

		const data = await api.updateAddress({
			address: mainInput.value || this.main,
			extra_address: `${this.apart}, ${this.entrance}, ${this.floor}`,
		});

		const user = localStorageHelper.getItem('user-info');

		if (!user) {
			router.navigate(urls.signIn);
			return;
		}

		if (data) {
			const res = await api.checkout();

			if (!res) {
				return;
			}

			const cart = document.getElementById('cart-button');
			const sum = cart.querySelector('span');

			sum.innerHTML = '';
			cart.className = 'btn btn--secondary size-xs';

			router.navigate(urls.restaurants);
		}
	}

	/**
	 * Получение информации о корзине
	 */
	async getData() {
		await api.getCartInfo((data) => {
			this.data = data;
		});
	}

	/**
	 * Рендер страницы
	 */
	async render() {
		const user = localStorageHelper.getItem('user-info');
		this.user = user;
		const address = localStorageHelper.getItem('user-address').value;
		this.main = address || user?.address;

		this.#parent.insertAdjacentHTML('beforeend', template(this.data));
		const form = this.#parent.querySelector('.pay-form');
		const addressBlock = form.querySelector('.pay-form__inputs');

		FIELDS_ADRESS_FORM.forEach((field) => {
			const inputContainer = document.createElement('div');
			inputContainer.classList.add('pay-form__input-container');
			addressBlock.appendChild(inputContainer);

			new Input(inputContainer, {
				id: field.id,
				placeholder: field.placeholder,
				style: field.style,
				value: field.name === 'main' ? this.main : this[field.name],
				onChange: (event) => {
					this[field.name] = event.target.value;
				},
				buttonOnClick: async () => {
					const data = await api.sendPromcode({ code: this[field.name] });

					if (data.code_id) {
						await this.getData();
						const form = this.#parent.querySelector('.pay-form');
						form.remove();
						this.render();
					}
				},
				button: field.name === 'promocode' ? 'Применить' : '',
			}).render();

			if (field.id !== 'main-address') {
				const errorMessage = document.createElement('div');
				errorMessage.classList.add('error-message__pay-form');
				errorMessage.id = `${field.name}-error`;
				inputContainer.appendChild(errorMessage);
			}
		});

		const mainInput = this.#parent.querySelector('#main-address-container');

		mainInput.onclick = () => {
			router.navigate(urls.address);
		};

		const promo = this.#parent.querySelector('.pay-form__promo');

		new Input(promo, {
			id: 'payform-promocode',
			placeholder: 'Введите промокод',
			value: this['promocode'],
			onChange: (event) => {
				this['promocode'] = event.target.value;
			},
			buttonOnClick: async () => {
				const data = await api.sendPromcode({ code: this['promocode'] });

				if (data?.code_id) {
					await this.getData();
					const form = this.#parent.querySelector('.pay-form');
					form.remove();
					this.render();

					const cart = document.getElementById('cart-button');
					const sumBlock = cart.querySelector('span');
					sumBlock.innerText = `${this.data.new_sum} ₽`;
				}
			},
			button: 'Применить',
		}).render();

		const checkoutButtonBlock = this.#parent.querySelector('.pay-form__button');

		const checkoutButton = new Button(checkoutButtonBlock, {
			id: 'pay-form-button',
			content: 'Заказать',
			disabled: !this.data?.sum || !this.entrance || !this.floor || !this.apart,
			withLoader: true,
			onClick: () => {
				this.handleSubmit();
			},
		});

		checkoutButton.render();
		const submit = this.#parent.querySelector('#pay-form-button');

		const apartInput = document.getElementById('apart-address');
		const apartInputdErrorContainer = this.#parent.querySelector('#apart-error');
		apartInput.addEventListener('input', () => {
			const isApartValid = validateApartNumber(apartInput.value, apartInputdErrorContainer);
			this.isApartValid = isApartValid;
			submit.disabled = !this.data?.sum || !this.isApartValid || !this.isEntranceValid || !this.isFloorValid;
		});

		const entranceInput = document.getElementById('entrance-address');
		const entranceInputErrorContainer = this.#parent.querySelector('#entrance-error');
		entranceInput.addEventListener('input', () => {
			const isEntranceValid = validateEntranceNumber(entranceInput.value, entranceInputErrorContainer);
			this.isEntranceValid = isEntranceValid;
			submit.disabled = !this.data?.sum || !this.isApartValid || !this.isEntranceValid || !this.isFloorValid;
		});

		const floorInput = document.getElementById('floor-address');
		const floorInputErrorContainer = this.#parent.querySelector('#floor-error');
		floorInput.addEventListener('input', () => {
			const isFloorValid = validateFloorNumber(floorInput.value, floorInputErrorContainer);
			this.isFloorValid = isFloorValid;
			submit.disabled = !this.data?.sum || !this.isApartValid || !this.isEntranceValid || !this.isFloorValid;
		});
	}
}

export default PayForm;
