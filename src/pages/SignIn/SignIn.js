import AuthForm from '../../components/AuthForm';
import { validateEmail, validatePassword } from '../../helpers/validation.js';

/**
 * Страница входа.
 */
class SignIn {
	#parent;

	/**
	 * Создает экземпляр страницы.
	 * @param {Element} parent Элемент DOM, в который будет рендериться страница.
	 */
	constructor(parent) {
		this.#parent = parent;
		this.isLoading = false;
	}

	/**
	 * Рендер страницы.
	 */
	render() {
		const authForm = new AuthForm(this.#parent, { title: 'Вход', redirectText: 'Нет аккаунта?', type: 'signin' });
		authForm.render();

		this.addFormValidation();
	}

	/**
	 * Валидация полей формы
	 */
	addFormValidation() {
		const emailElement = document.getElementById('email');
		const passwordElement = document.getElementById('password');

		const emailErrorElement = document.getElementById('email-error');
		const passwordErrorElement = document.getElementById('password-error');

		// Флаги начала ввода для каждого поля
		let hasEmailInputStarted = false;
		let hasPasswordInputStarted = false;

		emailElement.addEventListener('input', () => {
			hasEmailInputStarted = true;
			this.isEmailValid = validateEmail(emailElement, emailErrorElement, hasEmailInputStarted);
			this.updateSignInButtonState();
		});

		passwordElement.addEventListener('input', () => {
			hasPasswordInputStarted = true;
			this.isPasswordValid = validatePassword(passwordElement, passwordErrorElement, hasPasswordInputStarted);
			this.updateSignInButtonState();
		});
	}

	/**
	 *
	 */
	updateSignInButtonState() {
		document.getElementById('signin-button').disabled = !(this.isEmailValid && this.isPasswordValid);
	}
}

export default SignIn;
