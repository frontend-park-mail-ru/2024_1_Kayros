import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from '../../components/Link/Link';
import Logo from '../../components/Logo';
import { FIELDS_SIGN_IN } from '../../constants';
import { validateEmail, validatePassword } from '../../helpers/validation.js';
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
		document.getElementById('sign-in-button').disabled = !(this.isEmailValid && this.isPasswordValid);
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
