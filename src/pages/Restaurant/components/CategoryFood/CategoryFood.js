import FoodCard from '../FoodCard/FoodCard';
import template from './CategoryFood.hbs';
import './CategoryFood.scss';

/**
 * Категория блюд
 */
class CategoryFood {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {object} params.data - информация о еде
	 * @param {number} params.activeCategory - активная категория
	 * @param {void} params.setActiveCategory - обновить активную категорию
	 */
	constructor(parent, { data, activeCategory, setActiveCategory }) {
		this.parent = parent;
		this.data = data;
		this.activeCategory = activeCategory;
		this.setActiveCategory = setActiveCategory;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template({ name: this.data.name, id: this.data.id }));

		const category = document.getElementById(`category-${this.data.id}`);
		const foodList = category.querySelector('.category-food');

		this.data.items.forEach((item) => {
			const foodCard = new FoodCard(foodList, item);
			foodCard.render();
		});
	}
}

export default CategoryFood;
