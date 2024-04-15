import urls from '../../routes/urls';
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
	 * @param {void} params.navigate - функция навигации по страницам
	 */
	constructor(parent, { user, navigate }) {
		this.#parent = parent;
		this.#user = user;
		this.navigate = navigate;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLDivElement} - html
	 */
	getHTML() {
		const avatar = this.#user.img_url;
		const classList = `avatar-container ${avatar.includes('default') ? 'avatar-container--default' : ''}`;
		return template({ name: this.#user.name, avatarUrl: avatar, class: classList });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML(this.#user));

		const name = this.#parent.querySelector('.header__profile-name');

		name.onclick = () => {
			this.navigate(urls.profile);
		};
	}
}

export default Profile;
