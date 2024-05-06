import api from '../../modules/api';
import urls from '../../routes/urls';
import { localStorageHelper } from '../../utils';
import AddressSagests from '../AddressSagests';
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
	 * Получение местоположения пользователя
	 * @param {void} goToPoint - функция для перехода по точке
	 * @param {void} getAddressName - функция для получения адреса по точке
	 */
	getLocation(goToPoint, getAddressName) {
		if (!navigator.geolocation) {
			return;
		}

		navigator.geolocation.getCurrentPosition((position) => {
			goToPoint([position.coords.longitude, position.coords.latitude]);
			getAddressName();
		});
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		const user = localStorageHelper.getItem('user-info');

		const modal = new Modal({
			content: template(),
			className: 'address-modal',
			url: urls.address,
			initiatorId: 'address-button',
		});

		modal.render();

		const modalContent = document.getElementById('modal-content');

		const mapContainer = modalContent.querySelector('.find-address__map-container');
		const map = new Map(mapContainer, { fullPage: false, startX: 6000, startY: 6500 });
		map.render();

		if (window.innerWidth > 480) {
			if (user?.address) {
				api.geoCoder(user.address, map.goToPoint.bind(map));
			} else {
				this.getLocation(map.goToPoint.bind(map), map.getAddressName.bind(map));
			}
		}

		const sagestsElement = new AddressSagests(modalContent.querySelector('.find-address__sagests-container'), {
			closeModal: () => {
				modal.close();
			},
			goToPoint: (coords) => {
				map.goToPoint(coords);
			},
		});

		sagestsElement.render();
	}
}

export default AddressForm;
