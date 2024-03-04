import template from './Button.hbs';
import './Button.scss';

/**
 * Кнопка
 */
class Button {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {Object} params - параметры кнопки
	 * @param {string} params.id - идентификатор элемента
	 * @param {string} params.content - текст внутри кнопки
	 * @param {'primary' | 'secondary' | 'clear'} params.style - стиль кнопки
	 * @param {'submit' | 'button'} params.type - тип элемента
	 * @param {boolean} params.disabled - событие при клике
	 * @param {Function} params.onClick - событие при клике
	 * @param {string | undefined} params.icon - иконка
	 */
	constructor(parent, { id, content = '', type = 'button', disabled = false, onClick, icon, style = 'primary' }) {
		this.parent = parent;
		this.content = content;
		this.type = type;
		this.onClick = onClick;
		this.disabled = disabled;
		this.icon = icon;
		this.style = style;
		this.id = id;
	}

	/**
	 * Получение html компонента
	 */
	getHTML() {
		return template({
			id: this.id,
			content: this.content,
			class: 'btn-' + this.style,
			icon: this.icon,
			type: this.type,
			attribute: this.disabled ? 'disabled' : '',
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const currentButton = this.parent.querySelector(`#${this.id}`);

		currentButton.onclick = this.onClick;
	}
}

export default Button;
