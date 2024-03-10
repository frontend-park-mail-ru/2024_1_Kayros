import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from '../../components/Link/Link';
import Logo from '../../components/Logo';
import { VALIDATION_ERRORS, NAME_REGEX, INVALID_NAME_CHAR_REGEX, FIELDS_SIGN_UP } from '../../constants';
import { validateEmail, validatePassword } from '../../helpers/validation.js';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls.js';
import template from './SignUp.hbs';

import './SignUp.scss';

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
		const templateVars = {
			signInUrl: urls.signIn,
		};

		const html = template(templateVars);
		this.parent.insertAdjacentHTML('beforeend', html);

		const logoContainer = document.querySelector('.logo-container-on-sign-up');

		if (logoContainer) {
			new Logo(logoContainer).render();
		}

		const linkBlock = document.getElementById('signup-redirect');
		const link = new Link(linkBlock, { id: 'signin-link', href: urls.signIn, text: 'Войти' });
		link.render();

		// Рендеринг полей формы в цикле
		FIELDS_SIGN_UP.forEach((field) => {
			new Input(this.parent.querySelector(field.selector), {
				id: field.id,
				placeholder: field.placeholder,
				type: field.type,
			}).render();
		});

		new Button(this.parent.querySelector('#sign-up-button-container'), {
			id: 'sign-up-button',
			content: 'Создать аккаунт',
			type: 'submit',
			disabled: true,
			withLoader: true,
			onClick: (e) => {
				e.preventDefault();
				this.handleSubmit();
			},
		}).render();

		this.errorsContainer = this.parent.querySelector('#errors-container');
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
			document.getElementById('sign-up-button').disabled = !(
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

	/**
	 * Обработка кнопки входа
	 */
	handleSubmit() {
		const signinButton = this.parent.querySelector('#sign-up-button');
		const loaderBlock = signinButton.querySelector('#btn-loader');
		loaderBlock.classList.add('loading');

		// Подготовка данных пользователя
		const userData = {
			email: document.getElementById('email').value,
			name: document.getElementById('name').value,
			password: document.getElementById('password').value,
		};

		api.signup(userData, (data) => {
			localStorage.setItem('user-info', data);
			router.navigate(urls.restaurants);
		});
	}
}

export default SignUp;
