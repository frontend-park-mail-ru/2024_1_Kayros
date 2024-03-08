import Button from '../Button';
import template from './Input.hbs';
import './Input.scss';

/**
 * Инпут
 */
class Input {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры инпута
	 * @param {number} params.id - идентификатор элемента
	 * @param {string} params.placeholder - текстовая подсказка внутри поля
	 * @param {string} params.type - тип инпута
	 * @param {string | undefined} params.button - название кнопки
	 */
	constructor(parent, { id, placeholder, type = 'text', button }) {
		this.parent = parent;
		this.placeholder = placeholder;
		this.button = button;
		this.type = type;
		this.id = id;
		this.isVisible = false;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLDivElement} - html
	 */
	getHTML() {
		return template({
			placeholder: this.placeholder,
			button: this.button,
			type: this.type,
			isPassword: this.type === 'password',
			id: this.id,
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		if (this.button) {
			const buttonBlock = document.getElementById('search-button');
			const searchButton = new Button(buttonBlock, { id: 'header-search-button', content: 'Найти' });
			searchButton.render();
		}

		if (this.type !== 'password') return;

		const inputContainer = document.getElementById(`${this.id}-container`);

		const eyeButton = inputContainer.querySelector('#btn-eye');
		const password = inputContainer.getElementsByTagName('input')[0];

		eyeButton.addEventListener('click', () => {
			this.isVisible = !this.isVisible;

			if (this.isVisible) {
				eyeButton.className = 'visible';
				password.type = 'text';
			} else {
				eyeButton.className = 'hidden';
				password.type = 'password';
			}
		});
	}
}

export default Input;
