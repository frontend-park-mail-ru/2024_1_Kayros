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
	 * @param {Object} params - параметры
	 * @param {number} id - идентификатор
	 */
	constructor(parent, { id = 'dropdown' }) {
		this.parent = parent;
		this.isOpen = false;
		this.id = id;
	}

	open(element) {
		if (this.isOpen) return;

		element.className = 'dropdown dropdown-open';
		this.isOpen = true;
		this.parent.animate(...OPEN_PROFILE_SLIDE_OPTIONS);
	}

	close(element) {
		if (!this.isOpen) return;

		element.className = 'dropdown';
		this.isOpen = false;
		this.parent.animate(...CLOSE_PROFILE_SLIDE_OPTIONS);
	}

	/**
	 * Получение html компонента
	 */
	getHTML() {
		return template({
			open: this.isOpen ? 'dropdown-open' : '',
			id: this.id,
			items: dropdownItems,
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const dropdown = document.getElementById(this.id);

		dropdown.addEventListener('click', (event) => {
			event.stopPropagation();
		});

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
