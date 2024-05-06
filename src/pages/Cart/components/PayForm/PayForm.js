import Button from '../../../../components/Button';
import Input from '../../../../components/Input/Input';
import { FIELDS_ADRESS_FORM } from '../../../../constants';
import { validateApartNumber, validateEntranceNumber, validateFloorNumber } from '../../../../helpers/validation';
import api from '../../../../modules/api';
import { router } from '../../../../modules/router';
import urls from '../../../../routes/urls';
import { localStorageHelper } from '../../../../utils';
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
	 * Рендер страницы
	 */
	async render() {
		const user = localStorageHelper.getItem('user-info');
		this.user = user;
		const address = localStorageHelper.getItem('user-address').value;
		this.main = address;

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
				disabled: field.name === 'main',
			}).render();

			if (field.id !== 'main-address') {
				const errorMessage = document.createElement('div');
				errorMessage.classList.add('error-message');
				errorMessage.id = `${field.name}-error`;
				inputContainer.appendChild(errorMessage);
			}
		});

		const mainInput = this.#parent.querySelector('#main-address-container');

		mainInput.onclick = () => {
			router.navigate(urls.address);
		};

		const checkoutButtonBlock = this.#parent.querySelector('.pay-form__button');

		const checkoutButton = new Button(checkoutButtonBlock, {
			id: 'pay-form-button',
			content: 'Оплатить',
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
