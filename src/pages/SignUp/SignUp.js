import Button from '../../components/Button';
import Input from '../../components/Input';
import urls from '../../routes/urls.js';
import template from './SignUp.hbs';
// import { router } from '../../modules/router';

import './SignUp.scss';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// Константа для описания полей формы
const FIELDS = [
	{
		selector: '#email-input-container',
		id: 'email',
		placeholder: 'Почта',
		type: 'email',
	},
	{
		selector: '#password-input-container',
		id: 'password',
		placeholder: 'Пароль',
		type: 'password',
	},
	{
		selector: '#confirm-password-input-container',
		id: 'confirm-password',
		placeholder: 'Повторите пароль',
		type: 'password',
	},
];

/**
 * Страница регистрации.
 */
class SignUp {
	/**
	 * Создает экземпляр страницы.
	 * @param {Element} parent Элемент DOM, в который будет рендериться страница.
	 */
	constructor() {
		this.parent = document.getElementById('root');
		this.isLoading = false;
	}

	/**
	 * Рендер страницы.
	 */
	render() {
		const templateVars = {
			signInUrl: urls.signIn,
		};

		this.parent.innerHTML = '';
		const html = template(templateVars);
		this.parent.insertAdjacentHTML('beforeend', html);

		// Рендеринг полей формы в цикле
		FIELDS.forEach((field) => {
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
			onClick: (e) => {
				e.preventDefault();
				this.handleSubmit();
			},
		}).render();

		this.errorsContainer = this.parent.querySelector('#errors-container');
		this.addFormValidation();
	}

	addFormValidation() {
		const emailElement = document.getElementById('email');
		const passwordElement = document.getElementById('password');
		const confirmPasswordElement = document.getElementById('confirm-password');

		const emailErrorElement = document.getElementById('email-error');
		const passwordErrorElement = document.getElementById('password-error');
		const confirmPasswordErrorElement = document.getElementById('confirm-password-error');

		// Функция для валидации email
		const validateEmail = () => {
			const isEmailValid = EMAIL_REGEX.test(emailElement.value);
			emailErrorElement.textContent = emailElement.value
				? isEmailValid
					? ''
					: 'Неверный формат электронной почты'
				: 'Поле не может быть пустым';
			emailElement.style.borderColor = emailElement.value && isEmailValid ? 'initial' : 'red';
			return emailElement.value && isEmailValid;
		};

		// Функция для валидации пароля
		const validatePassword = () => {
			const isPasswordValid = PASSWORD_REGEX.test(passwordElement.value);
			passwordErrorElement.textContent = passwordElement.value
				? isPasswordValid
					? ''
					: 'Пароль должен содержать минимум 8 символов, включая число и букву'
				: 'Поле не может быть пустым';
			passwordElement.style.borderColor = passwordElement.value && isPasswordValid ? 'initial' : 'red';
			return passwordElement.value && isPasswordValid;
		};

		// Функция для проверки совпадения паролей
		const validateConfirmPassword = () => {
			const isConfirmPasswordValidFormat = PASSWORD_REGEX.test(confirmPasswordElement.value);
			const isPasswordsMatch = confirmPasswordElement.value === passwordElement.value;

			confirmPasswordErrorElement.textContent = '';

			if (!isConfirmPasswordValidFormat) {
				confirmPasswordErrorElement.textContent =
					'Повтор пароля должен содержать минимум 8 символов, включая число и букву, и совпадать с паролем';
				confirmPasswordElement.style.borderColor = 'red';
			} else if (!isPasswordsMatch) {
				confirmPasswordErrorElement.textContent = 'Пароли не совпадают';
				confirmPasswordElement.style.borderColor = 'red';
			} else {
				confirmPasswordElement.style.borderColor = 'initial';
			}

			return isPasswordsMatch && isConfirmPasswordValidFormat;
		};

		// Обновление состояния кнопки регистрации
		const updateSignUpButtonState = () => {
			const isFormValid = validateEmail() && validatePassword() && validateConfirmPassword();
			document.getElementById('sign-up-button').disabled = !isFormValid;
		};

		emailElement.addEventListener('input', () => {
			const isEmailValid = validateEmail();
			const isPasswordValid = validatePassword();
			const isPasswordsMatch = validateConfirmPassword();
			updateSignUpButtonState(isEmailValid, isPasswordValid, isPasswordsMatch);
		});

		passwordElement.addEventListener('input', () => {
			const isPasswordValid = validatePassword();
			const isEmailValid = validateEmail();
			const isPasswordsMatch = validateConfirmPassword();
			updateSignUpButtonState(isEmailValid, isPasswordValid, isPasswordsMatch);
		});

		confirmPasswordElement.addEventListener('input', () => {
			const isPasswordsMatch = validateConfirmPassword();
			const isEmailValid = validateEmail();
			const isPasswordValid = validatePassword();
			updateSignUpButtonState(isEmailValid, isPasswordValid, isPasswordsMatch);
		});
	}

	handleSubmit() {
		// Подготовка данных пользователя
		const userData = {
			email: document.getElementById('email').value,
			password: document.getElementById('password').value,
			confirmPassword: document.getElementById('confirm-password').value,
		};

		this.isLoading = true;

		setTimeout(() => {
			this.isLoading = false;

			if (userData.email.includes('used')) {
				alert('Такой логин уже существует.');
			} else {
				// router.navigate(urls.restaurants);
				window.location.href = urls.base;
			}
		}, 1000);
	}
}

export default SignUp;
