import Button from '../../components/Button';
import Input from '../../components/Input';
import Logo from '../../components/Logo';
import { router } from '../../modules/router';
import urls from '../../routes/urls.js';
import template from './SignUp.hbs';

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

		const html = template(templateVars);
		this.parent.insertAdjacentHTML('beforeend', html);

		const logoContainer = document.querySelector('.logo-container-on-sign-up');

		if (logoContainer) {
			new Logo(logoContainer).render();
		}

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

		// Флаги начала ввода для каждого поля
		let hasEmailInputStarted = false;
		let hasPasswordInputStarted = false;
		let hasConfirmPasswordInputStarted = false;

		// Состояние валидности каждого поля
		let isEmailValid = false;
		let isPasswordValid = false;
		let isPasswordsMatch = false;

		// Функция для валидации email
		const validateEmail = () => {
			const isEmailValid = EMAIL_REGEX.test(emailElement.value);

			if (emailElement.value) {
				emailErrorElement.textContent = isEmailValid ? '' : 'Неверный формат электронной почты';
				emailElement.style.borderColor = isEmailValid ? 'initial' : 'red';
			} else if (hasEmailInputStarted) {
				emailErrorElement.textContent = 'Поле не может быть пустым';
				emailElement.style.borderColor = 'red';
			} else {
				emailErrorElement.textContent = '';
				emailElement.style.borderColor = 'initial';
			}

			return emailElement.value && isEmailValid;
		};

		// Функция для валидации пароля
		const validatePassword = () => {
			const isPasswordValid = PASSWORD_REGEX.test(passwordElement.value);

			if (passwordElement.value) {
				passwordErrorElement.textContent = isPasswordValid
					? ''
					: 'Пароль должен содержать минимум 8 символов, включая число и букву';

				passwordElement.style.borderColor = isPasswordValid ? 'initial' : 'red';
			} else if (hasPasswordInputStarted) {
				passwordErrorElement.textContent = 'Поле не может быть пустым';
				passwordElement.style.borderColor = 'red';
			} else {
				passwordErrorElement.textContent = '';
				passwordElement.style.borderColor = 'initial';
			}

			return passwordElement.value && isPasswordValid;
		};

		// Функция для проверки совпадения паролей
		const validateConfirmPassword = () => {
			const isConfirmPasswordValidFormat = PASSWORD_REGEX.test(confirmPasswordElement.value);
			const isPasswordsMatch = confirmPasswordElement.value === passwordElement.value;

			if (!confirmPasswordElement.value) {
				if (hasConfirmPasswordInputStarted) {
					// Показываем ошибку, если начался ввод, но поле пустое
					confirmPasswordErrorElement.textContent = 'Поле не может быть пустым';
					confirmPasswordElement.style.borderColor = 'red';
				} else {
					confirmPasswordErrorElement.textContent = '';
					confirmPasswordElement.style.borderColor = 'initial';
				}
			} else if (!isConfirmPasswordValidFormat || !isPasswordsMatch) {
				confirmPasswordErrorElement.textContent = !isConfirmPasswordValidFormat
					? 'Повтор пароля должен содержать минимум 8 символов, включая число и букву, и совпадать с паролем'
					: 'Пароли не совпадают';

				confirmPasswordElement.style.borderColor = 'red';
			} else {
				confirmPasswordErrorElement.textContent = '';
				confirmPasswordElement.style.borderColor = 'initial';
			}

			return isPasswordsMatch && isConfirmPasswordValidFormat;
		};

		// Функция для обновления состояния кнопки регистрации
		const updateSignUpButtonState = () => {
			document.getElementById('sign-up-button').disabled = !(isEmailValid && isPasswordValid && isPasswordsMatch);
		};

		// Слушатели событий для обновления флагов и вызова функций валидации
		emailElement.addEventListener('input', () => {
			hasEmailInputStarted = true;
			isEmailValid = validateEmail();
			updateSignUpButtonState();
		});

		passwordElement.addEventListener('input', () => {
			hasPasswordInputStarted = true;
			isPasswordValid = validatePassword();

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
				router.navigate(urls.restaurants);
			}
		}, 1000);
	}
}

export default SignUp;
