import AddressForm from "../../components/AddressForm/index.js";
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
	validateMatchNewPassword,
} from '../../helpers/validation.js';
import api from '../../modules/api';
import {getCookie, getPhoneMask} from '../../utils';
import template from './Profile.hbs';
import './Profile.scss';
import {router} from "../../modules/router.js";
import Header from "../../components/Header/index.js";

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
		this.userAddress = '';
		this.file = '';
		this.name = '';
		this.email = '';
		this.phone = '';
		this.oldPassword = '';
		this.newPassword = '';
		this.confirmPassword = '';
		this.isEmailValid = false;
		this.isPhoneValid = false;
		this.isNameValid = false;
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

			const submitButton = this.#parent.querySelector('#profile-submit-button');
			submitButton.disabled = true;
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

			const newPasswordContainer = this.#parent.querySelector('#profile-new-password-input-container');
			const newPasswordLabelHolder = newPasswordContainer.querySelector('.input__label-holder');
			newPasswordLabelHolder.style.width = 0;

			const oldPasswordContainer = this.#parent.querySelector('#profile-old-password-input-container');
			const oldPasswordLabelHolder = oldPasswordContainer.querySelector('.input__label-holder');
			oldPasswordLabelHolder.style.width = 0;

			const confirmPasswordContainer = this.#parent.querySelector('#profile-confirm-password-input-container');
			const confirmPasswordLabelHolder = confirmPasswordContainer.querySelector('.input__label-holder');
			confirmPasswordLabelHolder.style.width = 0;
		});
	}

	changeAddress() {
		new AddressForm({isUserAddress: true, userAddress: this.userAddress}).render();
	}

	renderAddress(data) {
		const profileAddress = this.#parent.querySelector('.profile__address');

		this.userAddress = data?.address;

		const unauthId = getCookie('unauth_id');

		if (this.userAddress) {
			new Input(profileAddress, {
				id: 'user-address',
				style: 'dynamic',
				placeholder: 'Улица, номер дома',
				value: this.userAddress,
				onChange: (event) => {
					this.userAddress = event.target.value;
				},
				buttonOnClick: async () => {
					this.changeAddress();
				},
				button: 'Изменить',
			}).render();
		} else {
			new Button(profileAddress, {
				id: 'address-add-button',
				onClick: async () => {
					this.changeAddress();
				},
				icon: 'plus',
				content: 'Добавить адрес',
				style: 'default',
			}).render();
		}

		if (this.userAddress && unauthId) {
			new Button(profileAddress, {
				id: 'address-choose-button',
				onClick: async () => {
					const isOk = await api.chooseAddress();

					if (isOk) {
						const header = document.querySelector('.header');
						header.remove();
						const newHeader = new Header({ navigate: router.navigate.bind(router) });
						newHeader.render();
					}
				},
				content: 'Выбрать',
				style: 'primary',
			}).render();
		}
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

		const profileImage = this.#parent.querySelector('.profile__image');
		const fileUpload = new FileUpload(profileImage, {
			handleFile: (file) => {
				this.file = file;

				const submitButton = this.#parent.querySelector('#profile-submit-button');

				if (this.isEmailValid && this.isNameValid && this.isPhoneValid) {
					submitButton.disabled = false;
				}
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
		const name = this.#parent.querySelector('#profile-name-input');
		const nameErrorContainer = profileInfo.querySelector('#name-error');
		this.isNameValid = validateName(name, nameErrorContainer, true);

		name.addEventListener('input', () => {
			const isNameValid = validateName(name, nameErrorContainer, true);

			this.isNameValid = isNameValid;

			submit.disabled = !this.isNameValid || !this.isEmailValid || !this.isPhoneValid;
		});

		const email = this.#parent.querySelector('#profile-mail-input');
		const emailErrorContainer = profileInfo.querySelector('#email-error');
		this.isEmailValid = validateEmail(email, emailErrorContainer, true);

		email.addEventListener('input', () => {
			const isEmailValid = validateEmail(email, emailErrorContainer, true);

			this.isEmailValid = isEmailValid;

			submit.disabled = !this.isNameValid || !this.isEmailValid || !this.isPhoneValid;
		});

		const phone = this.#parent.querySelector('#profile-phone-input');
		const phoneErrorContainer = profileInfo.querySelector('#phone-error');
		this.isPhoneValid = validatePhone(phone, phoneErrorContainer);

		phone.addEventListener('input', () => {
			const isPhoneValid = validatePhone(phone, phoneErrorContainer);

			this.isPhoneValid = isPhoneValid;

			submit.disabled = !this.isNameValid || !this.isEmailValid || !this.isPhoneValid;
		});

		const oldPassword = this.#parent.querySelector('#profile-old-password-input');
		const newPassword = this.#parent.querySelector('#profile-new-password-input');
		const confirmPassword = this.#parent.querySelector('#profile-confirm-password-input');
		const submitPasswordButton = this.#parent.querySelector('#profile-submit-password-button');

		const oldPasswordErrorContainer = this.#parent.querySelector('#oldPassword-error');
		const newPasswordErrorContainer = this.#parent.querySelector('#newPassword-error');
		const confirmPasswordErrorContainer = this.#parent.querySelector('#confirmPassword-error');

		let hasPasswordInputStarted = false;
		let hasConfirmPasswordInputStarted = false;

		oldPassword.addEventListener('input', () => {
			this.isPasswordValid = validatePassword(oldPassword, oldPasswordErrorContainer, true);

			if (hasPasswordInputStarted) {
				this.isNewPasswordValid = validateMatchNewPassword(newPassword, oldPassword, newPasswordErrorContainer);
				submitPasswordButton.disabled = !(this.isPasswordValid && this.isNewPasswordValid && this.isPasswordsMatch);
			}
		});

		newPassword.addEventListener('input', () => {
			hasPasswordInputStarted = true;
			this.isNewPasswordValid = validateMatchNewPassword(newPassword, oldPassword, newPasswordErrorContainer);

			if (hasConfirmPasswordInputStarted) {
				this.isPasswordsMatch = validateConfirmPassword(
					newPassword,
					confirmPassword,
					confirmPasswordErrorContainer,
					hasConfirmPasswordInputStarted,
				);

				submitPasswordButton.disabled = !(this.isPasswordValid && this.isNewPasswordValid && this.isPasswordsMatch);
			}
		});

		confirmPassword.addEventListener('input', () => {
			hasConfirmPasswordInputStarted = true;
			this.isPasswordsMatch = validateConfirmPassword(
				newPassword,
				confirmPassword,
				confirmPasswordErrorContainer,
				hasConfirmPasswordInputStarted,
			);

			submitPasswordButton.disabled = !(this.isPasswordValid && this.isNewPasswordValid && this.isPasswordsMatch);
		});

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

	getUserAddress() {
		api.getUserAddress(this.renderAddress.bind(this), {user_address: true});
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.#parent.innerHTML = template();

		this.getData();
		this.getUserAddress();
	}
}

export default Profile;
