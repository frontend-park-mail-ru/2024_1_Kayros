import Header from '../../components/Header';
import api from '../../modules/api';
import Button from '../Button/Button';
import template from './Dropdown.hbs';
import './Dropdown.scss';
import { OPEN_PROFILE_SLIDE_OPTIONS, CLOSE_PROFILE_SLIDE_OPTIONS } from './constants';

const dropdownItems = [{ name: 'Выйти', exit: true }];

/**
 * Раскрывающееся окошко
 */
class Dropdown {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры
	 * @param {number} params.id - идентификатор
	 */
	constructor(parent, { id = 'dropdown' }) {
		this.parent = parent;
		this.isOpen = false;
		this.id = id;
	}

	/**
	 * Метод для открытия дропдауна
	 * @param {HTMLDivElement} element - дропдаун
	 */
	open(element) {
		if (this.isOpen) return;

		const name = document.getElementById('name');
		name.style.opacity = 1;
		name.style.pointerEvents = 'all';

		element.className = 'dropdown dropdown-open';

		this.isOpen = true;
		this.parent.animate(...OPEN_PROFILE_SLIDE_OPTIONS);
	}

	/**
	 * Метод для закрытия дропдауна
	 * @param {HTMLDivElement} element - дропдаун
	 */
	close(element) {
		if (!this.isOpen) return;

		const name = document.getElementById('name');
		name.style.opacity = 0;
		name.style.pointerEvents = 'none';

		element.className = 'dropdown';

		this.isOpen = false;
		this.parent.animate(...CLOSE_PROFILE_SLIDE_OPTIONS);
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} - html компонента
	 */
	getHTML() {
		return template({
			open: this.isOpen ? 'dropdown-open' : '',
			id: this.id,
			items: dropdownItems,
		});
	}

	/**
	 * Обработка кнопки для выхода из аккаунта
	 */
	handleExit() {
		localStorage.removeItem('user-info');

		const dropdown = document.getElementById(this.id);
		this.close(dropdown);

		const header = document.getElementById('header');
		header.remove();
		const newHeader = new Header(document.getElementById('layout'));
		newHeader.render();
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const dropdown = document.getElementById(this.id);

		const link = dropdown.querySelector('.dropdown-item');

		const exitButton = new Button(link, {
			id: 'exit-button',
			content: 'Выйти',
			style: 'clear',
			onClick: () => api.signout(this.handleExit.bind(this)),
		});

		exitButton.render();

		this.parent.addEventListener('click', (event) => {
			event.stopPropagation();

			this.open(dropdown);
		});

		window.addEventListener('click', () => {
			this.close(dropdown);
		});

		const closeOnEsc = (event) => {
			if (event.key === 'Escape') {
				this.close(dropdown);
			}
		};

		window.addEventListener('keydown', closeOnEsc);
	}
}

export default Dropdown;
