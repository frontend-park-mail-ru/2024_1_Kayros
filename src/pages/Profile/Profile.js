import Button from '../../components/Button/Button';
import FileUpload from '../../components/FileUpload/FileUpload';
import Input from '../../components/Input';
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
	}

	/**
	 * Отрисовка профиля
	 * @param {Array} data - информация о пользователе
	 */
	renderData(data) {
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
		const nameInput = new Input(profileInfo, {
			id: 'profile-name-input',
			placeholder: 'Имя',
			style: 'dynamic',
			value: data?.name,
		});

		nameInput.render();

		const mailInput = new Input(profileInfo, {
			id: 'profile-mail-input',
			placeholder: 'Email',
			style: 'dynamic',
			value: data?.email,
		});

		mailInput.render();

		const phoneInput = new Input(profileInfo, {
			id: 'profile-phone-input',
			placeholder: 'Номер телефона',
			style: 'dynamic',
			value: data?.phone,
		});

		phoneInput.render();

		const submitButton = new Button(profileInfo, {
			id: 'profile-submit',
			content: 'Сохранить',
			withLoader: true,
			disabled: true,
			onClick: () => {
				const loaderBlock = this.#parent.querySelector('#btn-loader');
				loaderBlock.classList.add('loading');

				const formData = new FormData();
				formData.append('img', this.file);

				api.updateUserData(formData, (data) => {
					localStorage.setItem('user-info', JSON.stringify(data));

					const profile = document.querySelector('.header__profile-image');
					profile.src = data.img_url;
				});
			},
		});

		submitButton.render();
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
