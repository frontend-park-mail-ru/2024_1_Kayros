import CounterButton from '../../../../components/CounterButton';
import template from './FoodCard.hbs';
import './FoodCard.scss';

/**
 * Карточка блюда
 */
class FoodCard {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} data - информация о еде
	 */
	constructor(parent, data) {
		this.parent = parent;
		this.data = data;
		this.added = false;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template(this.data));

		const food = document.getElementById(`food-${this.data.id}`);
		const action = food.querySelector('#food-action');
		const counterButton = new CounterButton(action, { id: `food-button-${this.data.id}`, initCount: 0 });
		counterButton.render();
	}
}

export default FoodCard;
