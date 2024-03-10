import AuthForm from '../../components/AuthForm';
import { VALIDATION_ERRORS, NAME_REGEX, INVALID_NAME_CHAR_REGEX } from '../../constants';
import { validateEmail, validatePassword } from '../../helpers/validation.js';

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

		// Функция для валидации имени
		const validateName = () => {
			const isNameValid = NAME_REGEX.test(nameElement.value);
			const hasInvalidChars = INVALID_NAME_CHAR_REGEX.test(nameElement.value);

			if (hasInvalidChars) {
				nameErrorElement.textContent = VALIDATION_ERRORS.incorrectSymbol;
				nameElement.classList.add('input-error');
			} else if (nameElement.value) {
				nameErrorElement.textContent = isNameValid ? '' : VALIDATION_ERRORS.nameFormat;
				nameElement.classList.toggle('input-error', !isNameValid);
			} else {
				nameErrorElement.textContent = hasNameInputStarted ? VALIDATION_ERRORS.fieldRequired : '';
				nameElement.classList.toggle('input-error', hasNameInputStarted);
			}

			return nameElement.value && isNameValid;
		};

		// Функция для проверки совпадения паролей
		const validateConfirmPassword = () => {
			const isPasswordsMatch = confirmPasswordElement.value === passwordElement.value;

			if (!isPasswordsMatch) {
				confirmPasswordErrorElement.textContent = VALIDATION_ERRORS.passwordUnmatched;
				confirmPasswordErrorElement.classList.add('input-error');
			} else if (!confirmPasswordElement.value && hasConfirmPasswordInputStarted) {
				confirmPasswordErrorElement.textContent = VALIDATION_ERRORS.fieldRequired;
				confirmPasswordErrorElement.classList.add('input-error');
			} else {
				confirmPasswordErrorElement.textContent = '';
				confirmPasswordErrorElement.classList.remove('input-error');
			}

			return confirmPasswordElement.value && isPasswordsMatch;
		};

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
			isNameValid = validateName();
			updateSignUpButtonState();
		});

		passwordElement.addEventListener('input', () => {
			hasPasswordInputStarted = true;
			isPasswordValid = validatePassword(passwordElement, passwordErrorElement, hasPasswordInputStarted);

			// При каждом изменении пароля, нужно заново проверять его совпадение с подтверждением
			if (hasConfirmPasswordInputStarted) {
				isPasswordsMatch = validateConfirmPassword();
			}

			updateSignUpButtonState();
		});

		confirmPasswordElement.addEventListener('input', () => {
			hasConfirmPasswordInputStarted = true;
			isPasswordsMatch = validateConfirmPassword();
			updateSignUpButtonState();
		});
	}
}

export default SignUp;
