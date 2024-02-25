import template from './Button.hbs';
import './styles.scss';

/**
 * Кнопка
 */
class Button {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {string} content - текст внутри кнопки
	 * @param {'primary' | 'secondary'} type - тип кнопки
	 * @param {Function} onClick - событие при клике
	 */
	constructor(parent, type, content, onClick) {
		this.parent = parent;
		this.content = content;
		this.type = type;
		this.onClick = onClick;
	}

	getHTML() {
		return template({ content: this.content, type: 'btn-' + this.type });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const customButtons = this.parent.getElementsByClassName('btn-custom');

		customButtons[customButtons.length - 1].onclick = this.onClick;
	}
}

export default Button;
