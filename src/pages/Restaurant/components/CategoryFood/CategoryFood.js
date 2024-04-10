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
	 * @param {object} params.cart - информация о корзине
	 */
	constructor(parent, { data, activeCategory, setActiveCategory, cart }) {
		this.parent = parent;
		this.data = data;
		this.activeCategory = activeCategory;
		this.setActiveCategory = setActiveCategory;
		this.cart = cart;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template({ name: this.data.name, id: this.data.id }));

		const category = document.getElementById(`category-${this.data.id}`);
		const foodList = category.querySelector('.category-food');

		this.data.food?.forEach((item) => {
			let count = 0;

			this.cart?.food.forEach((dish) => {
				if (dish.id === item.id) count = dish.count;
			});

			const foodCard = new FoodCard(foodList, item, count);
			foodCard.render();
		});
	}
}

export default CategoryFood;
