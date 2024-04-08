import Loader from '../Loader';
import template from './Button.hbs';
import './Button.scss';

/**
 * Кнопка
 */
class Button {
	#parent;
	#content;
	#type;
	#onClick;
	#disabled;
	#icon;
	#withLoader;
	#style;
	#id;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры кнопки
	 * @param {string} params.id - идентификатор элемента
	 * @param {string} params.content - текст внутри кнопки
	 * @param {'primary' | 'secondary' | 'clear'} params.style - стиль кнопки
	 * @param {'submit' | 'button'} params.type - тип элемента
	 * @param {boolean} params.disabled - блокировка кнопки
	 * @param {boolean} params.withLoader - лоадер
	 * @param {Function} params.onClick - событие при клике
	 * @param {string | undefined} params.icon - иконка
	 * @param {'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend'} params.position - позиция в предке
	 */
	constructor(
		parent,
		{
			id,
			content = '',
			type = 'button',
			disabled = false,
			onClick,
			icon,
			style = 'primary',
			withLoader = false,
			position = 'beforeend',
		},
	) {
		this.#parent = parent;
		this.#content = content;
		this.#type = type;
		this.#onClick = onClick;
		this.#disabled = disabled;
		this.#icon = icon;
		this.#withLoader = withLoader;
		this.#style = style;
		this.#id = id;
		this.position = position;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		return template({
			id: this.#id,
			content: this.#content,
			class: 'btn-' + this.#style,
			icon: this.#icon,
			loader: this.#withLoader,
			type: this.#type,
			attribute: this.#disabled ? 'disabled' : '',
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML(this.position, this.getHTML());

		const currentButton = this.#parent.querySelector(`#${this.#id}`);

		currentButton.onclick = this.#onClick;

		if (this.#withLoader) {
			const loaderBlock = currentButton.querySelector('#btn-loader');
			const loader = new Loader(loaderBlock, { size: 's', style: 'secondary' });
			loader.render();
		}
	}
}

export default Button;
