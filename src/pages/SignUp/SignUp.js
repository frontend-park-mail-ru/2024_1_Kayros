import template from './SignUp.hbs';
import './SignUp.scss';

/**
 * Страница регистрации.
 */
class SignUp {
	/**
	 * Создает экземпляр страницы.
	 * @param {Element} parent Элемент DOM, в который будет рендериться страница.
	 */
	constructor(parent) {
		/**
		 * Родительский элемент для страницы.
		 * @type {Element}
		 */
		this.parent = parent;
	}

	/**
	 * Рендер страницы.
	 */
	render() {
		const html = template();
		this.parent.insertAdjacentHTML('beforeend', html);
	}
}

export default SignUp;
