import urls from '../../routes/urls';
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
		new Modal({ content: template(), url: urls.address, initiatorId: 'address' }).render();

		const modalContent = document.getElementById('modal-content');

		const addressInput = new Input(modalContent.querySelector('#search-container'), {
			id: 'address-search',
			placeholder: 'Введите улицу или дом',
			type: 'text',
			button: 'Сохранить',
		});

		addressInput.render();
	}
}

export default AddressForm;
