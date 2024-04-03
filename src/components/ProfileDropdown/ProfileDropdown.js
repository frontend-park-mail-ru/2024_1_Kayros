import api from '../../modules/api';
import Button from '../Button/Button';
import template from './ProfileDropdown.hbs';
import './ProfileDropdown.scss';
import { OPEN_PROFILE_SLIDE_OPTIONS, CLOSE_PROFILE_SLIDE_OPTIONS } from './constants';

const dropdownItems = [{ name: 'Выйти', exit: true }];

/**
 * Раскрывающееся окошко
 */
class ProfileDropdown {
	#parent;
	#id;
	#onExit;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры
	 * @param {number} params.id - идентификатор
	 * @param {void} params.onExit - функция, выполняемая при выходе пользователя
	 */
	constructor(parent, { id = 'profile-dropdown', onExit }) {
		this.#parent = parent;
		this.#id = id;
		this.#onExit = onExit;
		this.isOpen = false;
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

		element.className = 'profile-dropdown profile-dropdown-open';

		this.isOpen = true;
		this.#parent.animate(...OPEN_PROFILE_SLIDE_OPTIONS);
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

		element.className = 'profile-dropdown';

		this.isOpen = false;
		this.#parent.animate(...CLOSE_PROFILE_SLIDE_OPTIONS);
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} - html компонента
	 */
	getHTML() {
		return template({
			open: this.isOpen ? 'profile-dropdown-open' : '',
			id: this.#id,
			items: dropdownItems,
		});
	}

	/**
	 * Обработка кнопки для выхода из аккаунта
	 */
	handleExit() {
		localStorage.removeItem('user-info');

		const profileDropdown = document.getElementById(this.#id);
		this.close(profileDropdown);

		this.#onExit();
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML());

		const profileDropdown = document.getElementById(this.#id);

		const link = profileDropdown.querySelector('.profile-dropdown-item');

		const exitButton = new Button(link, {
			id: 'exit-button',
			content: 'Выйти',
			style: 'clear',
			onClick: () => api.signout(this.handleExit.bind(this)),
		});

		exitButton.render();

		this.#parent.addEventListener('click', (event) => {
			event.stopPropagation();

			this.open(profileDropdown);
		});

		window.addEventListener('click', () => {
			this.close(profileDropdown);
		});

		const closeOnEsc = (event) => {
			if (event.key === 'Escape') {
				this.close(profileDropdown);
			}
		};

		window.addEventListener('keydown', closeOnEsc);
	}
}

export default ProfileDropdown;
