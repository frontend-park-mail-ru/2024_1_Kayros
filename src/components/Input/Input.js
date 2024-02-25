import template from './Input.hbs';
import './Input.scss';

/**
 * Инпут
 */
class Input {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {string} position - место в элементе
	 * @param {string} placeholder - текстовая подсказка внутри поля
	 * @param {boolean} isPassword - является ли инпут паролем
	 * @param {string | undefined} button - название кнопки
	 */
	constructor(parent, position, placeholder, isPassword, button) {
		this.parent = parent;
		this.position = position;
		this.placeholder = placeholder;
		this.button = button;
		this.isPassword = isPassword;
	}

	getHTML() {
		return template({
			placeholder: this.placeholder,
			button: this.button,
			isPassword: this.isPassword,
			id: this.isPassword ? 'password' : 'input',
			type: this.isPassword ? 'password' : 'text',
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML(this.position, this.getHTML());

		if (!this.isPassword) return;

		const eyeIcons = document.getElementById('btn-eye');
		const password = document.getElementById('password');

		const [openEye, closeEye] = eyeIcons.children;

		eyeIcons.addEventListener('click', () => {
			if (openEye.style.opacity === '1') {
				openEye.style.transform = 'scale(0)';
				openEye.style.opacity = 0;
				closeEye.style.transform = 'scale(1)';
				closeEye.style.opacity = 1;
				password.type = 'password';
			} else {
				openEye.style.opacity = 1;
				openEye.style.transform = 'scale(1)';
				closeEye.style.opacity = 0;
				closeEye.style.transform = 'scale(0)';
				password.type = 'text';
			}
		});
	}
}

export default Input;
