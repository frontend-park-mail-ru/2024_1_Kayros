import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from '../../components/Link/Link';
import Logo from '../../components/Logo';
import {
	EMAIL_REGEX,
	INVALID_EMAIL_CHAR_REGEX,
	PASSWORD_REGEX,
	INVALID_PASSWORD_CHAR_REGEX,
	FIELDS_SIGN_IN,
} from '../../constants';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls.js';
import template from './SignIn.hbs';
import './SignIn.scss';

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

		const linkBlock = document.getElementById('signin-redirect');
		const link = new Link(linkBlock, { id: 'signin-link', href: urls.signUp, text: 'Зарегистрироваться' });
		link.render();

		FIELDS_SIGN_IN.forEach((field) => {
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
			withLoader: true,
			onClick: (e) => {
				e.preventDefault();
				this.handleSubmit();
			},
		}).render();

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

		// Состояние валидности каждого поля
		let isEmailValid = false;
		let isPasswordValid = false;

		// Функция для валидации email
		const validateEmail = () => {
			const isEmailValid = EMAIL_REGEX.test(emailElement.value);
			const hasInvalidChars = INVALID_EMAIL_CHAR_REGEX.test(emailElement.value);

			if (hasInvalidChars) {
				emailErrorElement.textContent = 'Содержит некорректный символ';
				emailElement.style.borderColor = 'red';
			} else if (emailElement.value) {
				emailErrorElement.textContent = isEmailValid ? '' : 'Неверный формат электронной почты';
				emailElement.style.borderColor = isEmailValid ? 'initial' : 'red';
			} else {
				emailErrorElement.textContent = hasEmailInputStarted ? 'Поле не может быть пустым' : '';
				emailElement.style.borderColor = hasEmailInputStarted ? 'red' : 'initial';
			}

			return emailElement.value && isEmailValid;
		};

		// Функция для валидации пароля
		const validatePassword = () => {
			const isPasswordValid = PASSWORD_REGEX.test(passwordElement.value);
			const hasInvalidChars = INVALID_PASSWORD_CHAR_REGEX.test(passwordElement.value);

			if (hasInvalidChars) {
				passwordErrorElement.textContent = 'Содержит некорректный символ';
				passwordElement.style.borderColor = 'red';
			} else if (passwordElement.value) {
				passwordErrorElement.textContent = isPasswordValid
					? ''
					: 'Пароль должен содержать минимум 8 символов, включая число и букву';

				passwordElement.style.borderColor = isPasswordValid ? 'initial' : 'red';
			} else {
				passwordErrorElement.textContent = hasPasswordInputStarted ? 'Поле не может быть пустым' : '';
				passwordElement.style.borderColor = hasPasswordInputStarted ? 'red' : 'initial';
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

	/**
	 * Обработка кнопки входа
	 */
	handleSubmit() {
		const signinButton = this.parent.querySelector('#sign-in-button');

		const loaderBlock = signinButton.querySelector('#btn-loader');
		loaderBlock.classList.add('loading');

		const userData = {
			email: document.getElementById('email').value,
			password: document.getElementById('password').value,
		};

		api.login(userData, (data) => {
			localStorage.setItem('user-info', data);
			router.navigate(urls.restaurants);
		});
	}
}

export default SignIn;
