import Button from '../../components/Button';
import Input from '../../components/Input';
import Logo from '../../components/Logo';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls.js';
import template from './SignIn.hbs';
import './SignIn.scss';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

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
];

/**
 * Страница входа.
 */
class SignIn {
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
			signUpUrl: urls.signUp,
		};

		const html = template(templateVars);
		this.parent.insertAdjacentHTML('beforeend', html);

		const logoContainer = document.querySelector('.logo-container-on-sign-in');

		if (logoContainer) {
			new Logo(logoContainer).render();
		}

		FIELDS.forEach((field) => {
			new Input(this.parent.querySelector(field.selector), {
				id: field.id,
				placeholder: field.placeholder,
				type: field.type,
			}).render();
		});

		new Button(this.parent.querySelector('#sign-in-button-container'), {
			id: 'sign-in-button',
			content: 'Войти',
			type: 'submit',
			disabled: true,
			onClick: (e) => {
				e.preventDefault();
				this.handleSubmit();
			},
		}).render();

		this.addFormValidation();
	}

	addFormValidation() {
		const emailElement = document.getElementById('email');
		const passwordElement = document.getElementById('password');

		const emailErrorElement = document.getElementById('email-error');
		const passwordErrorElement = document.getElementById('password-error');

		// Флаги начала ввода для каждого поля
		let hasEmailInputStarted = false;
		let hasPasswordInputStarted = false;

		// Состояние валидности каждого поля
		let isEmailValid = false;
		let isPasswordValid = false;

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

		// Функция для обновления состояния кнопки регистрации
		const updateSignInButtonState = () => {
			document.getElementById('sign-in-button').disabled = !(isEmailValid && isPasswordValid);
		};

		// Слушатели событий для обновления флагов и вызова функций валидации
		emailElement.addEventListener('input', () => {
			hasEmailInputStarted = true;
			isEmailValid = validateEmail();
			updateSignInButtonState();
		});

		passwordElement.addEventListener('input', () => {
			hasPasswordInputStarted = true;
			isPasswordValid = validatePassword();
			updateSignInButtonState();
		});
	}

	handleSubmit() {
		const userData = {
			email: document.getElementById('email').value,
			password: document.getElementById('password').value,
		};

		api.login(userData, (data) => {
			localStorage.setItem('user-info', JSON.stringify(data));
			router.navigate(urls.restaurants);
		});
	}
}

export default SignIn;
