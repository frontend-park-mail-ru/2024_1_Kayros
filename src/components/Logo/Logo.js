import template from './Logo.hbs';
import './Logo.scss';

/**
 * Логотип
 */
class Logo {
	#onClick;
	#parent;
	#logoType;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params -  параметры
	 * @param {void} params.onClick - функция при клике на лого
	 * @param {'default' | 'white'} params.logoType - тип логотипа (по умолчанию или белый)
	 */
	constructor(parent, { onClick, logoType = 'default' }) {
		this.#onClick = onClick;
		this.#parent = parent;
		this.#logoType = logoType;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		const logoSrc = this.#logoType === 'white' ? '/assets/logo-white.svg' : '/assets/logo.svg';
		this.#parent.insertAdjacentHTML('beforeend', template({ logoSrc }));

		const logoBlock = this.#parent.querySelector('.logo');

		/**
		 * Обработка нажатия на лого
		 */
		logoBlock.addEventListener('click', () => {
			this.#onClick();
		});
	}
}

export default Logo;
