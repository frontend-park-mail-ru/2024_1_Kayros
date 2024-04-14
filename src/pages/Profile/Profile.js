import Button from '../../components/Button/Button';
import FileUpload from '../../components/FileUpload/FileUpload';
import Input from '../../components/Input';
import { EMAIL_REGEX, FIELDS_PROFILE_FORM, INVALID_PHONE, NAME_REGEX } from '../../constants';
import api from '../../modules/api';
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

				const submitButton = this.#parent.querySelector('#profile-submit');
				submitButton.disabled = false;
			},
			file: data?.img_url,
		});

		fileUpload.render();

		const profileInfo = this.#parent.querySelector('.profile__info');

		FIELDS_PROFILE_FORM.forEach((field) => {
			const input = new Input(profileInfo, {
				id: field.id,
				placeholder: field.placeholder,
				value: data[field.name],
				style: 'dynamic',
				onChange: (event) => {
					this[field.name] = event.target.value;

					const submitButton = this.#parent.querySelector('#profile-submit');
					submitButton.disabled = false;
				},
			});

			input.render();
		});

		const submitButton = new Button(profileInfo, {
			id: 'profile-submit',
			content: 'Сохранить',
			withLoader: true,
			disabled: true,
			onClick: () => {
				this.handleSubmit();
			},
		});

		submitButton.render();

		const name = this.#parent.querySelector('#profile-name-input');
		const submit = this.#parent.querySelector('#profile-submit');

		name.onblur = (event) => {
			const isNameValid = NAME_REGEX.test(event.target.value);

			if (!isNameValid || event.target.value === '') {
				name.style.border = '1px solid #ff0000';
				submit.disabled = true;
			} else {
				name.style.border = '';
				submit.disabled = false;
			}
		};

		const email = this.#parent.querySelector('#profile-mail-input');

		email.onblur = (event) => {
			const isEmailValid = EMAIL_REGEX.test(event.target.value);

			if (!isEmailValid || event.target.value === '') {
				email.style.border = '1px solid #ff0000';
				submit.disabled = true;
			} else {
				email.style.border = '';
				submit.disabled = false;
			}
		};

		const phone = this.#parent.querySelector('#profile-phone-input');

		phone.onblur = (event) => {
			const isPhoneValid = INVALID_PHONE.test(event.target.value);

			if (event.target.value && !isPhoneValid) {
				phone.style.border = '1px solid #ff0000';
				submit.disabled = true;
			} else {
				phone.style.border = '';
				submit.disabled = false;
			}
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
