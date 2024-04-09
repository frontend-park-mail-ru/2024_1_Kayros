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
			},
			file: data?.img_url,
		});

		fileUpload.render();

		const profileInfo = this.#parent.querySelector('.profile__info');
		const nameInput = new Input(profileInfo, { id: 'profile-name-input', placeholder: 'Имя', style: 'dynamic' });
		nameInput.render();

		const phoneInput = new Input(profileInfo, {
			id: 'profile-phone-input',
			placeholder: 'Номер телефона',
			style: 'dynamic',
		});

		phoneInput.render();
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
