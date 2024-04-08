import CounterButton from '../../../../components/CounterButton';
import template from './DishCard.hbs';
import './DishCard.scss';

/**
 * Карточка блюда из корзины
 */
class DishCard {
	#parent;

	/**
	 * Создает экземпляр
	 * @param {HTMLDivElement} parent - родительский элемент
	 * @param {object} data - информация о еде
	 */
	constructor(parent, data) {
		this.#parent = parent;
		this.data = data;
	}

	/**
	 * Рендер страницы
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template(this.data));

		const card = this.#parent.querySelector(`#food-${this.data.id}`);

		const counterBlock = card.querySelector('.dish-card__counter-block');
		const counter = new CounterButton(counterBlock, {
			id: `dish-card__counter-${this.data.id}`,
			initCount: this.data.count,
		});

		counter.render();
	}
}

export default DishCard;
