import Button from '../../components/Button';
import Input from '../../components/Input';
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
		const html = template();
		this.parent.insertAdjacentHTML('beforeend', html);

		document.getElementById('header')?.remove();

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

		this.addFormValidation();
	}

	addFormValidation() {
		const emailElement = document.getElementById('email');
		const passwordElement = document.getElementById('password');
		const confirmPasswordElement = document.getElementById('confirm-password');
		const signUpButtonElement = document.getElementById('sign-up-button');

		const validateForm = () => {
			const isEmailValid = emailElement.value.match(/^\S+@\S+\.\S+$/);
			const isPasswordValid = passwordElement.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
			const isPasswordsMatch = confirmPasswordElement.value === passwordElement.value;

			signUpButtonElement.disabled = !(isEmailValid && isPasswordValid && isPasswordsMatch);
		};

		[emailElement, passwordElement, confirmPasswordElement].forEach((element) => {
			element.addEventListener('input', validateForm);
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
				window.location.href = '/restaurants';
			}
		}, 2000);
	}
}

export default SignUp;
