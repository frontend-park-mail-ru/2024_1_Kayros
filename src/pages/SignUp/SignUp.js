import AuthForm from '../../components/AuthForm';
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from '../../helpers/validation.js';

/**
 * Страница регистрации.
 */
class SignUp {
	/**
	 * Создает экземпляр страницы.
	 * @param {Element} parent Элемент DOM, в который будет рендериться страница.
	 */
	constructor(parent) {
		this.parent = parent;
		this.isLoading = false;
	}

	/**
	 * Рендер страницы.
	 */
	render() {
		const authForm = new AuthForm(this.parent, {
			title: 'Регистрация',
			redirectText: 'Уже зарегистрированы?',
			type: 'signup',
		});

		authForm.render();

		this.addFormValidation();
	}

	/**
	 * Валидация полей формы
	 */
	addFormValidation() {
		const emailElement = document.getElementById('email');
		const nameElement = document.getElementById('name');
		const passwordElement = document.getElementById('password');
		const confirmPasswordElement = document.getElementById('confirm-password');

		const emailErrorElement = document.getElementById('email-error');
		const nameErrorElement = document.getElementById('name-error');
		const passwordErrorElement = document.getElementById('password-error');
		const confirmPasswordErrorElement = document.getElementById('confirm-password-error');

		// Флаги начала ввода для каждого поля
		let hasEmailInputStarted = false;
		let hasNameInputStarted = false;
		let hasPasswordInputStarted = false;
		let hasConfirmPasswordInputStarted = false;

		// Состояние валидности каждого поля
		let isEmailValid = false;
		let isNameValid = false;
		let isPasswordValid = false;
		let isPasswordsMatch = false;

		// Функция для обновления состояния кнопки регистрации
		const updateSignUpButtonState = () => {
			document.getElementById('signup-button').disabled = !(
				isNameValid &&
				isEmailValid &&
				isPasswordValid &&
				isPasswordsMatch
			);
		};

		// Слушатели событий для обновления флагов и вызова функций валидации
		emailElement.addEventListener('input', () => {
			hasEmailInputStarted = true;
			isEmailValid = validateEmail(emailElement, emailErrorElement, hasEmailInputStarted);
			updateSignUpButtonState();
		});

		nameElement.addEventListener('input', () => {
			hasNameInputStarted = true;
			isNameValid = validateName(nameElement, nameErrorElement, hasNameInputStarted);
			updateSignUpButtonState();
		});

		passwordElement.addEventListener('input', () => {
			hasPasswordInputStarted = true;
			isPasswordValid = validatePassword(passwordElement, passwordErrorElement, hasPasswordInputStarted);

			// При каждом изменении пароля, нужно заново проверять его совпадение с подтверждением
			if (hasConfirmPasswordInputStarted) {
				isPasswordsMatch = validateConfirmPassword(
					passwordElement,
					confirmPasswordElement,
					confirmPasswordErrorElement,
					hasConfirmPasswordInputStarted,
				);
			}

			updateSignUpButtonState();
		});

		confirmPasswordElement.addEventListener('input', () => {
			hasConfirmPasswordInputStarted = true;
			isPasswordsMatch = validateConfirmPassword(
				passwordElement,
				confirmPasswordElement,
				confirmPasswordErrorElement,
				hasConfirmPasswordInputStarted,
			);

			updateSignUpButtonState();
		});
	}
}

export default SignUp;
