import Button from '../../components/Button';
import Input from '../../components/Input';
import Logo from '../../components/Logo';
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

		const updateSignInButtonState = () => {
			const isEmailValid = validateEmail();
			const isPasswordValid = validatePassword();
			document.getElementById('sign-in-button').disabled = !(isEmailValid && isPasswordValid);
		};

		emailElement.addEventListener('input', updateSignInButtonState);

		passwordElement.addEventListener('input', updateSignInButtonState);
	}

	handleSubmit() {
		const userData = {
			email: document.getElementById('email').value,
			password: document.getElementById('password').value,
		};

		this.isLoading = true;
		setTimeout(() => {
			this.isLoading = false;

			if (userData.email.includes('used')) {
				const errorElement = document.getElementById('email-error');
				errorElement.textContent = 'Этот email уже используется.';
				errorElement.style.display = 'block';
			} else {
				localStorage.setItem('user', JSON.stringify(userData));
				router.navigate(urls.restaurants);
			}
		}, 1000);
	}
}

export default SignIn;
