import template from './Logo.hbs';
import './Logo.scss';

/**
 * Логотип
 */
class Logo {
	#onClick;
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params -  параметры
	 * @param {void} params.onClick - функция при клике на лого
	 */
	constructor(parent, { onClick }) {
		this.#onClick = onClick;
		this.#parent = parent;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template());

		const logoBlock = this.#parent.querySelector('.logo');
		// const logoBlock = this.#parent.querySelector('.header__logo-container');

		/**
		 * Обработка нажатия на лого
		 */
		logoBlock.addEventListener('click', () => {
			this.#onClick();
		});
	}
}

export default Logo;
