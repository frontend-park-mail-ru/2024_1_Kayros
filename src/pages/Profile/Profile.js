import Button from '../../components/Button/Button';
import FileUpload from '../../components/FileUpload/FileUpload';
import Input from '../../components/Input';
import { FIELDS_PROFILE_FORM, FIELDS_PROFILE_PASSWORD_CHANGE } from '../../constants';
import {
	validateConfirmPassword,
	validateEmail,
	validateName,
	validatePassword,
	validatePhone,
} from '../../helpers/validation.js';
import api from '../../modules/api';
import { getPhoneMask } from '../../utils';
import template from './Profile.hbs';
import './Profile.scss';

/**
 * Страница профиля
 */
class Profile {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
		this.file = '';
		this.name = '';
		this.email = '';
		this.phone = '';
		this.oldPassword = '';
		this.newPassword = '';
		this.confirmPassword = '';
	}

	/**
	 *
	 */
	handleSubmit() {
		const loaderBlock = this.#parent.querySelector('.btn__loader');
		loaderBlock.classList.add('btn__loader--loading');

		const formData = new FormData();
		formData.append('img', this.file);
		formData.append('name', this.name);
		formData.append('email', this.email);
		formData.append('phone', this.phone);

		api.updateUserData(formData, (data) => {
			localStorage.setItem('user-info', JSON.stringify(data));

			const profile = document.querySelector('.header__profile-image');
			profile.src = data.img_url;

			const name = document.querySelector('.header__profile-name');
			name.innerHTML = this.name;
		});
	}

	/**
	 *
	 */
	handlePasswordSubmit() {
		const loaderBlock = this.#parent.querySelector('.btn__loader');
		loaderBlock.classList.add('btn__loader--loading');

		api.changeUserPassword({ password: this.oldPassword, new_password: this.newPassword }, () => {
			const oldPassword = this.#parent.querySelector('#profile-old-password-input');
			const newPassword = this.#parent.querySelector('#profile-new-password-input');
			const confirmPassword = this.#parent.querySelector('#profile-confirm-password-input');

			oldPassword.value = '';
			newPassword.value = '';
			confirmPassword.value = '';
		});
	}

	/**
	 * Отрисовка профиля
	 * @param {Array} data - информация о пользователе
	 */
	renderData(data) {
		this.file = data.img_src;
		this.name = data.name;
		this.email = data.email;
		this.phone = data.phone;

		this.#parent.innerHTML = template();

		const profileImage = this.#parent.querySelector('.profile__image');
		const fileUpload = new FileUpload(profileImage, {
			handleFile: (file) => {
				this.file = file;

				const submitButton = this.#parent.querySelector('#profile-submit-button');
				submitButton.disabled = false;
			},
			file: data?.img_url,
		});

		fileUpload.render();

		const profileInfo = this.#parent.querySelector('.profile__info');
		const profilePasswordChange = this.#parent.querySelector('.profile__password-change');

		FIELDS_PROFILE_FORM.forEach((field) => {
			new Input(profileInfo, {
				id: field.id,
				placeholder: field.placeholder,
				value: data[field.name],
				style: 'dynamic',
				onChange: (event) => {
					this[field.name] = event.target.value;

					const submitButton = this.#parent.querySelector('#profile-submit-button');
					submitButton.disabled = false;
				},
			}).render();

			const errorMessage = document.createElement('div');
			errorMessage.classList.add('error-message');
			errorMessage.id = `${field.name}-error`;
			profileInfo.appendChild(errorMessage);
		});

		FIELDS_PROFILE_PASSWORD_CHANGE.forEach((field) => {
			new Input(profilePasswordChange, {
				id: field.id,
				placeholder: field.placeholder,
				value: data[field.name],
				style: 'dynamic',
				type: 'password',
				onChange: (event) => {
					this[field.name] = event.target.value;

					const submitButton = this.#parent.querySelector('#profile-submit-password-button');
					submitButton.disabled = false;
				},
			}).render();

			const errorMessage = document.createElement('div');
			errorMessage.classList.add('error-message');
			errorMessage.id = `${field.name}-error`;
			profilePasswordChange.appendChild(errorMessage);
		});

		const submitButton = new Button(profileInfo, {
			id: 'profile-submit-button',
			content: 'Сохранить',
			withLoader: true,
			disabled: true,
			onClick: () => {
				this.handleSubmit();
			},
		});

		const passwordSubmitButton = new Button(profilePasswordChange, {
			id: 'profile-submit-password-button',
			content: 'Сохранить',
			withLoader: true,
			disabled: true,
			onClick: () => {
				this.handlePasswordSubmit();
			},
		});

		submitButton.render();
		passwordSubmitButton.render();

		const submit = this.#parent.querySelector('#profile-submit-button');
		const submitPassword = this.#parent.querySelector('#profile-submit-password-button');

		const name = this.#parent.querySelector('#profile-name-input');
		const nameContainer = this.#parent.querySelector('#profile-name-input-container');
		const nameLabelHolder = nameContainer.querySelector('.input__label-holder');
		const nameErrorContainer = profileInfo.querySelector('#name-error');

		name.onblur = (event) => {
			if (!event.target.value) {
				nameLabelHolder.style.width = 0;
			}

			const isNameValid = validateName(name, nameErrorContainer, true);

			submit.disabled = !isNameValid;
		};

		const email = this.#parent.querySelector('#profile-mail-input');
		const emailContainer = this.#parent.querySelector('#profile-mail-input-container');
		const emailLabelHolder = emailContainer.querySelector('.input__label-holder');
		const emailErrorContainer = profileInfo.querySelector('#email-error');

		email.onblur = (event) => {
			if (!event.target.value) {
				emailLabelHolder.style.width = 0;
			}

			const isEmailValid = validateEmail(email, emailErrorContainer, true);

			submit.disabled = !isEmailValid;
		};

		const phone = this.#parent.querySelector('#profile-phone-input');
		const phoneContainer = this.#parent.querySelector('#profile-phone-input-container');
		const phoneLabelHolder = phoneContainer.querySelector('.input__label-holder');
		const phoneErrorContainer = profileInfo.querySelector('#phone-error');

		phone.onblur = (event) => {
			if (!event.target.value) {
				phoneLabelHolder.style.width = 0;
			}

			const isPhoneValid = validatePhone(phone, phoneErrorContainer);

			submit.disabled = !isPhoneValid;
		};

		const oldPassword = this.#parent.querySelector('#profile-old-password-input');
		const oldPasswordContainer = this.#parent.querySelector('#profile-old-password-input-container');
		const oldPasswordLabelHolder = oldPasswordContainer.querySelector('.input__label-holder');
		const oldPasswordErrorContainer = profilePasswordChange.querySelector('#oldPassword-error');

		oldPassword.onblur = (event) => {
			if (!event.target.value) {
				oldPasswordLabelHolder.style.width = 0;
			}

			const isPasswordValid = validatePassword(oldPassword, oldPasswordErrorContainer, true);

			submitPassword.disabled = !isPasswordValid;
		};

		const newPassword = this.#parent.querySelector('#profile-new-password-input');
		const newPasswordContainer = this.#parent.querySelector('#profile-new-password-input-container');
		const newPasswordLabelHolder = newPasswordContainer.querySelector('.input__label-holder');
		const newPasswordErrorContainer = profilePasswordChange.querySelector('#newPassword-error');

		const confirmPassword = this.#parent.querySelector('#profile-confirm-password-input');
		const confirmPasswordContainer = this.#parent.querySelector('#profile-confirm-password-input-container');
		const confirmPasswordLabelHolder = confirmPasswordContainer.querySelector('.input__label-holder');
		const confirmPasswordErrorContainer = profilePasswordChange.querySelector('#confirmPassword-error');

		newPassword.onblur = (event) => {
			if (!event.target.value) {
				newPasswordLabelHolder.style.width = 0;
			}

			const isPasswordFormatValid = validatePassword(newPassword, newPasswordErrorContainer, true);
			const isPasswordsMatch = validateConfirmPassword(
				newPassword,
				confirmPassword,
				confirmPasswordErrorContainer,
				true,
			);

			const isNewPasswordValid = isPasswordFormatValid && isPasswordsMatch;

			submitPassword.disabled = !isNewPasswordValid;
		};

		confirmPassword.onblur = (event) => {
			if (!event.target.value) {
				confirmPasswordLabelHolder.style.width = 0;
			}

			const isPasswordsMatch = validateConfirmPassword(
				newPassword,
				confirmPassword,
				confirmPasswordErrorContainer,
				true,
			);

			submitPassword.disabled = !isPasswordsMatch;
		};

		phone.oninput = () => {
			this.phone = getPhoneMask(phone);
		};
	}

	/**
	 * Получение данных о пользователе
	 */
	getData() {
		api.getUserInfo(this.renderData.bind(this));
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.getData();
	}
}

export default Profile;
