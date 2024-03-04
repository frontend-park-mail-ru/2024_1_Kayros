import Button from '../../components/Button';
import Input from '../../components/Input';
import urls from '../../routes/urls.js';
import template from './SignUp.hbs';

import './SignUp.scss';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

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

		// Создание и рендер полей формы
		new Input(this.parent.querySelector('#email-input-container'), {
			id: 'email',
			placeholder: 'Почта',
			type: 'email',
		}).render();

		new Input(this.parent.querySelector('#password-input-container'), {
			id: 'password',
			placeholder: 'Пароль',
			type: 'password',
		}).render();

		new Input(this.parent.querySelector('#confirm-password-input-container'), {
			id: 'confirm-password',
			placeholder: 'Повторите пароль',
			type: 'password',
		}).render();

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
			if (emailElement.value === '') {
				emailErrorElement.textContent = '';
				emailElement.style.borderColor = 'initial';
				return true; // Пустое поле не считается ошибкой валидации
			}

			const isEmailValid = EMAIL_REGEX.test(emailElement.value);
			emailErrorElement.textContent = isEmailValid ? '' : 'Неверный формат электронной почты';
			emailElement.style.borderColor = isEmailValid ? 'initial' : 'red';
			return isEmailValid;
		};

		// Функция для валидации пароля
		const validatePassword = () => {
			if (passwordElement.value === '') {
				passwordErrorElement.textContent = '';
				passwordElement.style.borderColor = 'initial';
				return true;
			}

			const isPasswordValid = PASSWORD_REGEX.test(passwordElement.value);
			passwordErrorElement.textContent = isPasswordValid
				? ''
				: 'Пароль должен содержать минимум 8 символов, включая число и букву';
			passwordElement.style.borderColor = isPasswordValid ? 'initial' : 'red';
			return isPasswordValid;
		};

		// Функция для проверки совпадения паролей
		const validateConfirmPassword = () => {
			if (confirmPasswordElement.value === '') {
				confirmPasswordErrorElement.textContent = '';
				confirmPasswordElement.style.borderColor = 'initial';
				return true;
			}

			const isPasswordsMatch = confirmPasswordElement.value === passwordElement.value;
			confirmPasswordErrorElement.textContent = isPasswordsMatch ? '' : 'Пароли не совпадают';
			confirmPasswordElement.style.borderColor = isPasswordsMatch ? 'initial' : 'red';
			return isPasswordsMatch;
		};

		emailElement.addEventListener('input', () => {
			validateEmail();
			updateSignUpButtonState();
		});

		passwordElement.addEventListener('input', () => {
			validatePassword();
			validateConfirmPassword();
			updateSignUpButtonState();
		});

		confirmPasswordElement.addEventListener('input', () => {
			validateConfirmPassword();
			updateSignUpButtonState();
		});

		const updateSignUpButtonState = () => {
			const isFormValid = validateEmail() && validatePassword() && validateConfirmPassword();
			document.getElementById('sign-up-button').disabled = !isFormValid;
		};
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
				window.location.href = urls.base;
			}
		}, 1000);
	}
}

export default SignUp;
