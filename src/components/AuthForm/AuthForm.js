import * as VKID from '@vkid/sdk';
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
	#parent;
	#config;
	#title;
	#redirectText;
	#type;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры формы
	 * @param {string} params.title - заголовок формы
	 * @param {string} params.redirectText - текст редиректа
	 * @param {'signin' | 'signup'} params.type - тип формы
	 */
	constructor(parent, { title, redirectText, type }) {
		this.#parent = parent;
		this.#config = CONFIG[type];
		this.#title = title;
		this.#redirectText = redirectText;
		this.#type = type;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		return template({
			title: this.#title,
			redirectText: this.#redirectText,
			signup: this.#type === 'signup',
		});
	}

	/**
	 * Обработка кнопки
	 */
	handleSubmit() {
		const signinButton = this.#parent.querySelector(`#${this.#type}-button`);

		const loaderBlock = signinButton.querySelector('.btn__loader');
		loaderBlock.classList.add('btn__loader--loading');

		const userData = {
			email: document.getElementById('email').value,
			password: document.getElementById('password').value,
		};

		if (this.#type === 'signup') {
			userData.name = document.getElementById('name').value;
		}

		this.#config.apiMethod(userData, (data) => {
			localStorage.setItem('user-info', data);
			router.back();
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		const urlParams = new URLSearchParams(window.location.search);
		const payload = urlParams.get('payload');

		console.log(JSON.parse(payload));

		this.#parent.insertAdjacentHTML('beforeend', this.getHTML());

		const logoDesktopContainer = document.querySelector('.auth-container__logo--desktop');

		if (logoDesktopContainer) {
			new Logo(logoDesktopContainer, {
				onClick: () => router.navigate(urls.restaurants),
				logoType: 'white',
			}).render();
		}

		const logoMobileContainer = document.querySelector('.auth-container__logo--mobile');

		if (logoMobileContainer) {
			new Logo(logoMobileContainer, {
				onClick: () => router.navigate(urls.restaurants),
			}).render();
		}

		const linkBlock = document.querySelector('.auth-container__redirect');
		const link = new Link(linkBlock, {
			id: `${this.#type}-link`,
			href: this.#config.redirectLinkHref,
			text: this.#config.redirectLinkText,
		});

		link.render();

		const backButtonDesktopBlock = document.querySelector('.auth-container__back-button--desktop');
		const backButtonDesktop = new BackButton(backButtonDesktopBlock, { id: `${this.#type}-back-button` });
		backButtonDesktop.render();

		const backButtonMobileBlock = document.querySelector('.auth-container__back-button--mobile');
		const backButtonMobile = new BackButton(backButtonMobileBlock, { id: `${this.#type}-back-button` });
		backButtonMobile.render();

		this.#config.fields.forEach((field) => {
			new Input(this.#parent.querySelector(field.selector), {
				id: field.id,
				placeholder: field.placeholder,
				type: field.type,
			}).render();
		});

		new Button(this.#parent.querySelector('.auth-container__button-container'), {
			id: `${this.#type}-button`,
			content: this.#config.submitButtonText,
			type: 'submit',
			disabled: true,
			withLoader: true,
			size: 's',
			onClick: (event) => {
				event.preventDefault();
				this.handleSubmit();
			},
		}).render();

		const oneTap = new VKID.OneTap();

		const vkAuthButton = document.querySelector('.auth-container__vk-auth');

		if (vkAuthButton) {
			oneTap.render({
				container: vkAuthButton,
				scheme: VKID.Scheme.LIGHT,
				lang: VKID.Languages.RUS,
				styles: { borderRadius: 14 },
			});
		}
	}
}

export default AuthForm;
