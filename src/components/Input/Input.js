import Button from '../Button';
import template from './Input.hbs';
import './Input.scss';

/**
 * Инпут
 */
class Input {
	#parent;
	#placeholder;
	#button;
	#type;
	#isVisible;
	#id;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры инпута
	 * @param {number} params.id - идентификатор элемента
	 * @param {string} params.placeholder - текстовая подсказка внутри поля
	 * @param {string} params.type - тип инпута
	 * @param {string | undefined} params.button - название кнопки
	 * @param {'standart' | 'dynamic'} params.style - стиль
	 * @param {string} params.value - начальное значение
	 * @param {void} params.onChange - обработчик события
	 */
	constructor(parent, { id, placeholder, type = 'text', button, style = 'standart', value = '', onChange = '' }) {
		this.#parent = parent;
		this.#placeholder = placeholder;
		this.#button = button;
		this.#type = type;
		this.#id = id;
		this.#isVisible = false;
		this.style = style;
		this.value = value;
		this.onChange = onChange;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLDivElement} - html
	 */
	getHTML() {
		return template({
			placeholder: this.#placeholder,
			button: this.#button,
			type: this.#type,
			isPassword: this.#type === 'password',
			id: this.#id,
			dynamic: this.style === 'dynamic',
			value: this.value,
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML());

		if (this.#button) {
			const buttonBlock = this.#parent.querySelector('.input__search-button');
			const searchButton = new Button(buttonBlock, { id: `${this.#id}-search-button`, content: this.#button });
			searchButton.render();
		}

		const inputContainer = document.getElementById(`${this.#id}-container`);

		const input = inputContainer.querySelector('input');

		input.oninput = this.onChange;

		if (this.#type !== 'password') return;

		inputContainer.classList.add('password-input');
		const eyeButton = inputContainer.querySelector('.input__btn-eye');
		const password = inputContainer.getElementsByTagName('input')[0];

		eyeButton.addEventListener('click', () => {
			this.#isVisible = !this.#isVisible;

			if (this.#isVisible) {
				eyeButton.classList.remove('hidden');
				eyeButton.classList.add('visible');
				password.type = 'text';
			} else {
				eyeButton.classList.remove('visible');
				eyeButton.classList.add('hidden');
				password.type = 'password';
			}
		});
	}
}

export default Input;
