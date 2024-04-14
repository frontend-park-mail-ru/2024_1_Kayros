import api from '../../modules/api';
import { router } from '../../modules/router';
import { localStorageHelper } from '../../utils';
import Button from '../Button/Button';
import Header from '../Header/Header';
import template from './AddressSujests.hbs';
import Dropdown from './Dropdown/Dropdown';
import './AddressSujests.scss';

/**
 * Саджесты для адреса
 */
class AddressSujests {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {void} params.closeModal - метод для закрытия модалки
	 * @param {void} params.goToPoint - переход по точке
	 */
	constructor(parent, { closeModal, goToPoint }) {
		this.#parent = parent;
		this.closeModal = closeModal;
		this.address = '';
		this.goToPoint = goToPoint;
	}

	/**
	 * Отобразить измение адреса в хэдере
	 */
	handleAddressChange() {
		const header = document.getElementById('header');
		header.remove();
		const newHeader = new Header({ navigate: router.navigate.bind(router) });
		newHeader.render();
	}

	/**
	 * Добавить адрес
	 */
	async setAddress() {
		await api.updateAddressSujests({ address: this.address }, this.handleAddressChange);
		const cartAddress = document.querySelector('#main-address');

		if (cartAddress) {
			cartAddress.value = this.address;
		}

		this.closeModal();
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		return template({ value: this.address });
	}

	/**
	 * Отрисовка саджестов
	 * @param {object} items - саджесты
	 */
	renderItems(items) {
		const dropdown = this.#parent.querySelector('.dropdown-container');
		dropdown.innerHTML = '';

		const searchContainer = this.#parent.querySelector('.search-container');
		const input = searchContainer.querySelector('input');

		if (!items) {
			const dropdownElement = new Dropdown(dropdown);
			dropdownElement.render();
			return;
		}

		const dropdownElement = new Dropdown(dropdown, {
			items,
			onClick: (id) => {
				const currentItem = items.find((item, i) => {
					return i === Number(id);
				});

				const address = currentItem.title?.text + ', ' + currentItem.subtitle?.text;

				const street = currentItem.subtitle?.text.split(' · ')[1];

				const button = this.#parent.querySelector('#address-search-button');
				button.disabled = false;

				input.value = address;
				input.blur();
				this.address = street || currentItem.title?.text;

				api.geoCoder(street || address, this.goToPoint);
			},
		});

		dropdownElement.render();
	}

	/**
	 * Получение саджестов
	 * @param {*} text - вводимый текст
	 */
	async getData(text) {
		await api.getSujests(text, this.renderItems.bind(this));
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML());

		const sujestsContainer = document.getElementById('address-sujests');
		const searchContainer = sujestsContainer.querySelector('.search-container');

		const input = searchContainer.querySelector('input');

		const searchButton = new Button(searchContainer, {
			id: 'address-search-button',
			content: 'Сохранить',
			withLoader: true,
			onClick: async () => {
				const loaderBlock = searchContainer.querySelector('#btn-loader');
				loaderBlock.classList.add('loading');

				const data = await this.setAddress();

				if (data) this.closeModal();
			},
			disabled: input.value ? false : true,
		});

		searchButton.render();

		const dropdown = sujestsContainer.querySelector('.dropdown-container');

		const user = localStorageHelper.getItem('user-info');

		if (user?.address) {
			input.value = user.address || '';
		}

		let stopTyping;

		const clearIcon = searchContainer.querySelector('#clear-icon');

		clearIcon.onclick = (event) => {
			event.stopPropagation();
			input.value = '';

			const button = this.#parent.querySelector('#address-search-button');
			button.disabled = true;

			input.focus();
		};

		input.onblur = () => {
			dropdown.classList.remove('dropdown-open');
			this.open = false;
		};

		input.onfocus = () => {
			if (input.value) {
				this.open = true;
				this.getData(input.value);
				dropdown.classList.add('dropdown-open');
			}
		};

		input.onclick = (event) => {
			event.stopPropagation();
		};

		dropdown.onmousedown = (event) => {
			event.preventDefault();
		};

		dropdown.onclick = (event) => {
			event.stopPropagation();
		};

		window.onclick = () => {
			dropdown.classList.remove('dropdown-open');
			this.open = false;
			input.blur();
		};

		input.oninput = (event) => {
			clearTimeout(stopTyping);

			stopTyping = setTimeout(() => {
				if (!this.open && event.target.value) {
					this.open = true;
					dropdown.classList.add('dropdown-open');
				}

				if (this.open && !event.target.value) {
					this.open = false;
					dropdown.classList.remove('dropdown-open');
				}

				if (event.target.value) {
					this.getData(event.target.value);
				}
			}, 200);
		};
	}
}

export default AddressSujests;
