import api from '../../modules/api';
import { router } from '../../modules/router';
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
	 */
	constructor(parent, { closeModal }) {
		this.#parent = parent;
		this.closeModal = closeModal;
		this.address = '';
	}

	/**
	 * Отобразить измение адреса в хэдере
	 */
	handleAddressChange() {
		const header = document.getElementById('header');
		header.remove();
		const newHeader = new Header({ navigate: router.navigate });
		newHeader.render();
	}

	/**
	 * Добавить адрес
	 */
	async setAddress() {
		await api.saveAddress(this.address, this.handleAddressChange);
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

				input.value = currentItem.title.text;
				input.blur();
				this.address = currentItem.title.text;
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

		const searchButton = new Button(searchContainer, {
			id: 'address-search-button',
			content: 'Сохранить',
			withLoader: true,
			onClick: async () => {
				const loaderBlock = searchContainer.querySelector('#btn-loader');
				loaderBlock.classList.add('loading');

				await this.setAddress();
				this.closeModal();
			},
		});

		searchButton.render();

		const input = searchContainer.querySelector('input');
		const dropdown = sujestsContainer.querySelector('.dropdown-container');

		let stopTyping;

		const clearIcon = searchContainer.querySelector('#clear-icon');

		clearIcon.onclick = () => {
			input.value = '';
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
