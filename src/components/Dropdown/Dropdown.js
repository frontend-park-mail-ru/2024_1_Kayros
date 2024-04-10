import api from '../../modules/api';
import urls from '../../routes/urls';
import template from './Dropdown.hbs';
import './Dropdown.scss';
import { OPEN_PROFILE_SLIDE_OPTIONS, CLOSE_PROFILE_SLIDE_OPTIONS } from './constants';

const dropdownItems = [
	{ id: 'profile-link', name: 'Профиль', exit: false },
	{ id: 'exit-link', name: 'Выйти', exit: true },
];

/**
 * Раскрывающееся окошко
 */
class Dropdown {
	#parent;
	#id;
	#onExit;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры
	 * @param {number} params.id - идентификатор
	 * @param {void} params.navigate - функция навигации по страницам
	 * @param {void} params.onExit - функция, выполняемая при выходе пользователя
	 */
	constructor(parent, { id = 'dropdown', navigate, onExit }) {
		this.#parent = parent;
		this.#id = id;
		this.#onExit = onExit;
		this.navigate = navigate;
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

		element.className = 'dropdown dropdown-open';

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

		element.className = 'dropdown';

		this.isOpen = false;
		this.#parent.animate(...CLOSE_PROFILE_SLIDE_OPTIONS);
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} - html компонента
	 */
	getHTML() {
		return template({
			open: this.isOpen ? 'dropdown-open' : '',
			id: this.#id,
			items: dropdownItems,
		});
	}

	/**
	 * Обработка кнопки для выхода из аккаунта
	 */
	handleExit() {
		localStorage.removeItem('user-info');

		const dropdown = document.getElementById(this.#id);
		this.close(dropdown);

		this.#onExit();
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML());

		const dropdown = document.getElementById(this.#id);

		const links = dropdown.querySelector('#items');

		const profileButton = links.querySelector('#profile-link');

		profileButton.onclick = (event) => {
			event.stopPropagation();

			this.navigate(urls.profile);
			this.close(dropdown);
		};

		const exitButton = links.querySelector('#exit-link');

		exitButton.onclick = (event) => {
			event.stopPropagation();

			api.signout(this.handleExit.bind(this));
			this.close(dropdown);
		};

		this.#parent.addEventListener('click', (event) => {
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
