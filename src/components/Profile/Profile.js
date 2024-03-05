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

		return template({ name: user.name, avatarUrl: avatar });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		let user = JSON.parse(localStorage.getItem('user-info'));

		this.parent.insertAdjacentHTML('beforeend', this.getHTML(user));

		const profile = document.getElementById('profile');

		const dropdown = new Dropdown(profile, { id: 'dropdown-profile' });
		dropdown.render();
	}
}

export default Profile;
