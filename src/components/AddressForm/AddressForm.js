import urls from '../../routes/urls';
import AddressSujests from '../AddressSujests/AddressSujests';
import Map from '../Map';
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
		const modal = new Modal({ content: template(), url: urls.address, initiatorId: 'address' });
		modal.render();

		const modalContent = document.getElementById('modal-content');

		const mapContainer = modalContent.querySelector('#address-map-container');
		const map = new Map(mapContainer, { fullPage: false });
		map.render();

		const sujestsElement = new AddressSujests(modalContent.querySelector('#sujests-container'), {
			closeModal: () => {
				map.open = false;
				modal.close();
			},
		});

		sujestsElement.render();
	}
}

export default AddressForm;
