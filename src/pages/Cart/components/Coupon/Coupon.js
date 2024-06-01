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

	formatDate(dateString) {
		const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
		return new Date(dateString).toLocaleDateString('ru-RU', options);
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		let text = '';

		switch(this.data.type) {
			case 'first':
				text = 'Скидка действует на первый заказ в нашем сервисе';
				break;
			case 'sum':
				text = `Скидка действует от суммы заказа ${this.data.sum}р.`;
				break;
			case 'rest':
				text = `Скидка на первый заказ в ресторане ${this.data.rest}`;
				break;
			case 'once':
			default:
				text = 'Единоразовая скидка специально для Вас';
		}


		this.#parent.insertAdjacentHTML('beforeend', template(
			{
				id: this.#id,
				sale: this.data.sale,
				date: this.formatDate(this.data.date),
				code: this.data.code,
				text,
			}));

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
