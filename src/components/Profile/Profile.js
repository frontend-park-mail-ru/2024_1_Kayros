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

		return template({ name: this.#user.name, avatarUrl: avatar, class: avatar.includes('default') ? 'default' : '' });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML(this.#user));

		const name = this.#parent.querySelector('#name');

		name.onclick = () => {
			this.navigate(urls.profile);
		};
	}
}

export default Profile;
