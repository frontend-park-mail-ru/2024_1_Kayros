import template from './PayForm.hbs';
import './PayForm.scss';

/**
 * Форма оплаты
 */
class PayForm {
	#parent;

	/**
	 * Создает экземпляр
	 * @param {HTMLDivElement} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
	}

	/**
	 * Рендер страницы
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template());
	}
}

export default PayForm;
