import Button from '../../../../components/Button';
import Input from '../../../../components/Input/Input';
import { FIELDS_ADRESS_FORM } from '../../../../constants';
import api from '../../../../modules/api';
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
		this.#parent = parent;
		this.data = data;
		this.main = data.address || '';
		this.apart = data.extra_address.split(', ')[0] || '';
		this.entrance = data.extra_address.split(', ')[1] || '';
		this.floor = data.extra_address.split(', ')[2] || '';
	}

	/**
	 *
	 */
	async handleSubmit() {
		const loaderBlock = this.#parent.querySelector('#btn-loader');
		loaderBlock.classList.add('loading');

		const data = await api.updateAddress({
			address: this.main,
			extra_address: `${this.apart}, ${this.entrance}, ${this.floor}`,
		});

		if (data) {
			api.checkout();
		}
	}

	/**
	 * Рендер страницы
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template(this.data));
		const form = this.#parent.querySelector('.pay-form');
		const addressBlock = form.querySelector('.pay-form__inputs');

		FIELDS_ADRESS_FORM.forEach((field) => {
			new Input(addressBlock, {
				id: field.id,
				placeholder: field.placeholder,
				style: field.style,
				value: this[field.name],
				onChange: (event) => {
					this[field.name] = event.target.value;
				},
			}).render();
		});

		const checkoutButton = new Button(form, {
			id: 'pay-form-button',
			content: 'Оплатить',
			disabled: this.main && this.data.sum !== 0 ? false : true,
			withLoader: true,
			onClick: () => {
				this.handleSubmit();
			},
		});

		checkoutButton.render();
	}
}

export default PayForm;
