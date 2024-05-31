import template from './Coupon.hbs';
import './Coupon.scss';

/**
 * Купон
 */
class Coupon {
	#parent;
	#id;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {string} params.id - id элемента
	 * @param {string} params.text - текст ссылки
	 */
	constructor(parent, { id, data }) {
		this.#parent = parent;
		this.#id = id;
		this.data = data;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		const timeDate = new Date(this.data.date);

		const date = timeDate.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' });

		this.#parent.insertAdjacentHTML('beforeend', template({ id: this.#id, sale: this.data.sale, date }));

		const c = document.getElementById(`${this.#id}`);

		c.onclick = async () => {
			await navigator.clipboard.writeText(this.data.code);
			c.classList.add('copied');
		};

		c.onmouseleave = () => {
			c.classList.remove('copied');
		};
	}
}

export default Coupon;
