import defaultAvatar from '../../assets/default-avatar.png';
import Dropdown from '../Dropdown/Dropdown';
import template from './Profile.hbs';
import './Profile.scss';

const DEFAULT_USERNAME = 'Пользователь';

/**
 * Профиль
 */
class Profile {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {Object} params - параметры компонента
	 * @param {Object} params.user - объект пользователя
	 */
	constructor(parent, { user }) {
		this.parent = parent;
		this.user = user;
	}

	/**
	 * Получение html компонента
	 */
	getHTML() {
		const avatar = this.user.avatarUrl ? this.user.avatarUrl : defaultAvatar;

		return template({ name: this.user.name || DEFAULT_USERNAME, avatarUrl: avatar });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML(this.user));

		const profile = document.getElementById('profile');

		const dropdown = new Dropdown(profile, { id: 'dropdown-profile' });
		dropdown.render();
	}
}

export default Profile;
