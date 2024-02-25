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
	 * @param {string} params.content - текст внутри кнопки
	 * @param {'primary' | 'secondary'} params.type - тип кнопки
	 * @param {boolean} params.disabled - событие при клике
	 * @param {Function} params.onClick - событие при клике
	 * @param {string} params.icon - иконка
	 */
	constructor(parent, { content = '', type = 'primary', disabled = false, onClick, icon }) {
		this.parent = parent;
		this.content = content;
		this.type = type;
		this.onClick = onClick;
		this.disabled = disabled;
		this.icon = icon;
		this.id = this.getUID();
	}

	/**
	 * Создание уникального идентификатора по родительскому id
	 * @returns уникальный идентификатор для кнопки
	 */
	getUID() {
		const currentButtons = this.parent.getElementsByClassName('btn');
		let maxID = 0;

		[...currentButtons].forEach((btn) => {
			const btnId = Number(btn.id.split('_')[1]);

			if (btnId > maxID) maxID = btnId;
		});

		return this.parent.id + '-btn_' + (maxID + 1);
	}

	/**
	 * Получение html компонента
	 */
	getHTML() {
		return template({ id: this.id, content: this.content, type: 'btn-' + this.type, icon: this.icon });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const currentButton = document.getElementById(this.id);

		if (this.disabled) {
			currentButton.disabled = true;
		}

		currentButton.onclick = this.onClick;
	}
}

export default Button;
