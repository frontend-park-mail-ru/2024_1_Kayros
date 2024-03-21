import defaultAvatar from '../../assets/default-avatar.png';
import template from './Profile.hbs';
import './Profile.scss';

/**
 * Профиль
 */
class Profile {
	#parent;
	#user;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {object} params.user - объект пользователя
	 */
	constructor(parent, { user }) {
		this.#parent = parent;
		this.#user = user;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLDivElement} - html
	 */
	getHTML() {
		const avatar = this.#user.avatarUrl || defaultAvatar;

		return template({ name: this.#user.name, avatarUrl: avatar });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML(this.#user));
	}
}

export default Profile;
