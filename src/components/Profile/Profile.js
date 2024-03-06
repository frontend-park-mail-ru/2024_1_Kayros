import defaultAvatar from '../../assets/default-avatar.png';
import Dropdown from '../Dropdown/Dropdown';
import template from './Profile.hbs';
import './Profile.scss';

/**
 * Профиль
 */
class Profile {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.parent = parent;
	}

	/**
	 * Получение html компонента
	 */
	getHTML(user) {
		const avatar = user.avatarUrl ? user.avatarUrl : defaultAvatar;

		return template({ name: user.name ? user.name : 'Пользователь', avatarUrl: avatar });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		const localInfo = localStorage.getItem('user-info');
		let user = localInfo ? JSON.parse(localInfo) : null;

		this.parent.insertAdjacentHTML('beforeend', this.getHTML(user));

		const profile = document.getElementById('profile');

		const dropdown = new Dropdown(profile, { id: 'dropdown-profile' });
		dropdown.render();
	}
}

export default Profile;
