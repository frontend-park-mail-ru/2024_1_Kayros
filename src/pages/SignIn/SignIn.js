import Button from '../../components/Button';
import Input from '../../components/Input';
import urls from '../../routes/urls.js';
import template from './SignIn.hbs';
import './SignIn.scss';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

/**
 * Страница входа.
 */
class SignIn {
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
			signUpUrl: urls.signUp,
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

		new Button(this.parent.querySelector('#sign-in-button-container'), {
			id: 'sign-in-button',
			content: 'Войти',
			type: 'submit',
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

		const emailErrorElement = document.getElementById('email-error');
		const passwordErrorElement = document.getElementById('password-error');

		const validateEmail = () => {
			if (emailElement.value === '') {
				emailErrorElement.textContent = '';
				emailElement.style.borderColor = 'initial';
				return true;
			}

			const isEmailValid = EMAIL_REGEX.test(emailElement.value);
			emailErrorElement.textContent = isEmailValid ? '' : 'Неверный формат электронной почты';
			emailElement.style.borderColor = isEmailValid ? 'initial' : 'red';
			return isEmailValid;
		};

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

		emailElement.addEventListener('input', validateEmail);
		passwordElement.addEventListener('input', validatePassword);

		const updateSignInButtonState = () => {
			const isFormValid = validateEmail() && validatePassword();
			document.getElementById('sign-in-button').disabled = !isFormValid;
		};

		updateSignInButtonState();
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
				window.location.href = urls.base;
			}
		}, 1000);
	}
}

export default SignIn;
