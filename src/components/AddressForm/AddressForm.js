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
	coords;

	/**
	 * Конструктор класса
	 */
	constructor() {}

	/**
	 * Рендеринг компонента
	 */
	render() {
		const modal = new Modal({
			content: template(),
			className: 'address-modal',
			url: urls.address,
			initiatorId: 'address-button',
		});

		modal.render();

		const modalContent = document.getElementById('modal-content');

		const mapContainer = modalContent.querySelector('.find-address__map-container');
		const map = new Map(mapContainer, { fullPage: false });
		map.render();

		const sujestsElement = new AddressSujests(modalContent.querySelector('.find-address__sujests-container'), {
			closeModal: () => {
				modal.close();
			},
			goToPoint: (coords) => {
				map.goToPoint(coords);
			},
		});

		sujestsElement.render();
	}
}

export default AddressForm;
