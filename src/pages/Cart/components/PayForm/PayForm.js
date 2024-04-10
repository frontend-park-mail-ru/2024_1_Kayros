import Button from '../../../../components/Button';
import Input from '../../../../components/Input/Input';
import { FIELDS_ADRESS_FORM } from '../../../../constants';
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
	}

	/**
	 * Рендер страницы
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template(this.data));

		const form = this.#parent.querySelector('.pay-form');
		const checkoutButton = new Button(form, { id: 'pay-form-button', content: 'Оплатить' });
		checkoutButton.render();

		const addressBlock = form.querySelector('.pay-form__inputs');

		FIELDS_ADRESS_FORM.forEach((field) => {
			new Input(addressBlock, {
				id: field.id,
				placeholder: field.placeholder,
				style: field.style,
				value: field.id === 'main-address' ? this.data?.address : '',
			}).render();
		});
	}
}

export default PayForm;
