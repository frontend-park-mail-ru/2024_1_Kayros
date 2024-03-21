import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import template from './AddressForm.hbs';
import './AddressForm.scss';

/**
 * Форма добавления адреса
 */
class AddressForm {
	/**
	 * Конструктор класса
	 */
	constructor() {}

	/**
	 * Рендеринг компонента
	 */
	render() {
		const modalContent = document.getElementById('modal-content');
		const currentForm = document.getElementById('find-address');

		if (!currentForm) {
			modalContent.insertAdjacentHTML('beforeend', template());

			const addressInput = new Input(modalContent.querySelector('#search-container'), {
				id: 'address-search',
				placeholder: 'Введите улицу или дом',
				type: 'text',
				button: 'Сохранить',
			});

			addressInput.render();
		}

		new Modal({ initiatorId: 'address' }).render();
	}
}

export default AddressForm;
