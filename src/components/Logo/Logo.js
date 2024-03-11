import template from './Logo.hbs';
import './Logo.scss';

/**
 * Логотип
 */
class Logo {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params -  параметры
	 * @param {void} params.onClick - функция при клике на лого
	 */
	constructor(parent, { onClick }) {
		this.onClick = onClick;
		this.parent = parent;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template());

		const logoBlock = document.getElementById('logo');

		/**
		 * Обработка нажатия на лого
		 */
		logoBlock.addEventListener('click', () => {
			this.onClick();
		});
	}
}

export default Logo;
