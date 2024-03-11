import { FIELDS_SIGN_IN, FIELDS_SIGN_UP } from '../../constants';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import BackButton from '../BackButton/BackButton';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Link from '../Link/Link';
import Logo from '../Logo/Logo';
import template from './AuthForm.hbs';
import './AuthForm.scss';

const CONFIG = {
	signin: {
		redirectLinkHref: urls.signUp,
		redirectLinkText: 'Зарегистрироваться',
		fields: FIELDS_SIGN_IN,
		submitButtonText: 'Войти',
		apiMethod: api.login.bind(api),
	},
	signup: {
		redirectLinkHref: urls.signIn,
		redirectLinkText: 'Войти',
		fields: FIELDS_SIGN_UP,
		submitButtonText: 'Зарегистрироваться',
		apiMethod: api.signup.bind(api),
	},
};

/**
 * Форма авторизации
 */
class AuthForm {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры формы
	 * @param {string} params.title - заголовок формы
	 * @param {string} params.redirectText - текст редиректа
	 * @param {'signin' | 'signup'} params.type - тип формы
	 */
	constructor(parent, { title, redirectText, type }) {
		this.parent = parent;
		this.title = title;
		this.redirectText = redirectText;
		this.type = type;
		this.config = CONFIG[type];
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		return template({
			title: this.title,
			redirectText: this.redirectText,
			signup: this.type === 'signup',
		});
	}

	/**
	 * Обработка кнопки
	 */
	handleSubmit() {
		const signinButton = this.parent.querySelector(`#${this.type}-button`);

		const loaderBlock = signinButton.querySelector('#btn-loader');
		loaderBlock.classList.add('loading');

		const userData = {
			email: document.getElementById('email').value,
			password: document.getElementById('password').value,
		};

		if (this.type === 'signup') {
			userData.name = document.getElementById('name').value;
		}

		this.config.apiMethod(userData, (data) => {
			localStorage.setItem('user-info', data);
			router.back();
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const logoContainer = document.querySelector('.logo-container-on-auth');

		if (logoContainer) {
			new Logo(logoContainer, { onClick: () => router.navigate(urls.restaurants) }).render();
		}

		const linkBlock = document.getElementById('auth-redirect');
		const link = new Link(linkBlock, {
			id: `${this.type}-link`,
			href: this.config.redirectLinkHref,
			text: this.config.redirectLinkText,
		});

		link.render();

		const backButtonBlock = document.getElementById('back-button');
		const backButton = new BackButton(backButtonBlock, { id: `${this.type}-back-button` });
		backButton.render();

		this.config.fields.forEach((field) => {
			new Input(this.parent.querySelector(field.selector), {
				id: field.id,
				placeholder: field.placeholder,
				type: field.type,
			}).render();
		});

		new Button(this.parent.querySelector('#auth-button-container'), {
			id: `${this.type}-button`,
			content: this.config.submitButtonText,
			type: 'submit',
			disabled: true,
			withLoader: true,
			onClick: (event) => {
				event.preventDefault();
				this.handleSubmit();
			},
		}).render();
	}
}

export default AuthForm;
