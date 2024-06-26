import api from '../../modules/api';
import { router } from '../../modules/router';
import { localStorageHelper, setCookieIfNotExist } from '../../utils';
import Button from '../Button/Button';
import Header from '../Header/Header';
import template from './AddressSagests.hbs';
import Dropdown from './Dropdown/Dropdown';
import './AddressSagests.scss';
import Profile from '../../pages/Profile';
import urls from '../../routes/urls.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Саджесты для адреса
 */
class AddressSagests {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {void} params.closeModal - метод для закрытия модалки
	 * @param {void} params.goToPoint - переход по точке
	 * @param {boolean} params.isUserAddress - чей адрес: юзера или заказов
	 * @param {string} params.userAddress - адрес юзера
	 */
	constructor(parent, { closeModal, goToPoint, isUserAddress = false, userAddress = '' }) {
		this.#parent = parent;
		this.closeModal = closeModal;
		this.address = '';
		this.goToPoint = goToPoint;
		this.user = '';
		this.isUserAddress = isUserAddress;
		this.userAddress = userAddress;
	}

	/**
	 * Перерисовать хедер
	 */
	rerenderHeader() {
		const header = document.querySelector('.header');
		header.remove();
		const newHeader = new Header({ navigate: router.navigate.bind(router) });
		newHeader.render();
	}

	/**
	 * Отобразить измение адреса в хэдере
	 */
	handleAddressChange() {
		localStorage.setItem('user-address', JSON.stringify({ value: this.address }));

		this.rerenderHeader();
	}

	handleUserAddressChange() {
		if (window.location.pathname === urls.profile) {
			const content = document.querySelector('.content');
			const profile = new Profile(content);
			profile.getUserAddress();
		}

		this.rerenderHeader();
	}

	/**
	 * Добавить адрес
	 */
	async setAddress() {
		const searchInput = this.#parent.querySelector('#address-search-input');

		if (!this.isUserAddress) {
			setCookieIfNotExist('unauth_id', uuidv4());
		}

		this.address = searchInput.value.split(' · ')[1] || searchInput.value;

		await api.updateAddressSagests(
			{ address: this.address },
			this.isUserAddress ? this.handleUserAddressChange.bind(this) : this.handleAddressChange.bind(this),
			{ user_address: this.isUserAddress },
		);

		if (!this.isUserAddress) {
			const cartAddress = document.querySelector('#main-address');
			const cartContainer = document.querySelector('#main-address-container');

			if (cartAddress) {
				cartAddress.value = this.address;
				const holder = cartContainer.querySelector('.input__label-holder');
				holder.style.width = 20 * 8 + 'px';
			}
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
		const dropdown = this.#parent.querySelector('.address-sagests__dropdown-container');
		dropdown.innerHTML = '';

		const searchContainer = this.#parent.querySelector('.address-sagests__search-container');
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

				if (window.innerWidth > 480) {
					api.geoCoder(street || address, this.goToPoint);
				}
			},
		});

		dropdownElement.render();
	}

	/**
	 * Получение саджестов
	 * @param {*} text - вводимый текст
	 */
	async getData(text) {
		await api.getSagests(text, this.renderItems.bind(this));
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML());

		const sagestsContainer = document.querySelector('.address-sagests');
		const searchContainer = sagestsContainer.querySelector('.address-sagests__search-container');

		const input = searchContainer.querySelector('input');

		const submitButton = new Button(searchContainer, {
			id: 'address-search-button',
			content: 'Сохранить',
			withLoader: true,
			onClick: async () => {
				const loaderBlock = searchContainer.querySelector('.btn__loader');
				loaderBlock.classList.add('btn__loader--loading');

				const data = await this.setAddress();

				if (data) this.closeModal();
			},
			disabled: input.value ? false : true,
		});

		submitButton.render();

		const dropdown = sagestsContainer.querySelector('.address-sagests__dropdown-container');

		const user = localStorageHelper.getItem('user-info');
		const address = localStorageHelper.getItem('user-address')?.value;
		this.user = user;

		if (this.isUserAddress) {
			input.value = this.userAddress || '';
		} else {
			input.value = address || '';
		}

		let stopTyping;

		const clearIcon = searchContainer.querySelector('.address-sagests__clear-icon');

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
			dropdown.classList.remove('dropdown-open');
			this.open = false;
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

export default AddressSagests;
